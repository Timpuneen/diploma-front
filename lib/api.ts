/**
 * API service layer providing a typed HTTP client.
 * All backend interactions go through this module.
 * Connected to the FastAPI backend at /api/v1.
 */

import type {
  AIDetectionWithLimitsResponse,
  AnalysisHistoryItem,
  AnalysisResult,
  ApiError,
  AuthTokens,
  DetectionHistoryItem,
  DetectionHistoryResponse,
  LoginCredentials,
  RegisterCredentials,
  TelegramConnectResponse,
  TelegramStatusResponse,
  User,
  UserLimits,
  UserStats,
} from "./types";
import { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from "./constants";

/** Maps a backend DetectionResult to a UI-friendly verdict. */
function mapResultToVerdict(result: string): "ai" | "human" | "mixed" {
  switch (result) {
    case "ai_generated":
      return "ai";
    case "human_written":
      return "human";
    default:
      return "mixed";
  }
}

/** Converts a backend detection response into the legacy AnalysisResult shape used by UI. */
function mapDetectionToAnalysisResult(
  res: AIDetectionWithLimitsResponse,
  originalText: string
): AnalysisResult {
  const aiProb = Math.round(res.confidence * 100);
  return {
    id: `analysis_${Date.now()}`,
    text: originalText,
    aiProbability: res.result === "human_written" ? 100 - aiProb : aiProb,
    humanProbability: res.result === "human_written" ? aiProb : 100 - aiProb,
    verdict: mapResultToVerdict(res.result),
    language: "auto",
    wordCount: (res.metadata as Record<string, number>)?.word_count ?? originalText.split(/\s+/).length,
    createdAt: new Date().toISOString(),
    metrics: {
      perplexity: (res.metadata as Record<string, number>)?.perplexity ?? 0,
      burstiness: (res.metadata as Record<string, number>)?.burstiness ?? 0,
      entropy: (res.metadata as Record<string, number>)?.entropy ?? 0,
      repetitiveness: (res.metadata as Record<string, number>)?.repetitiveness ?? 0,
    },
  };
}

/** Converts a backend history item into the legacy AnalysisHistoryItem shape. */
function mapHistoryItem(item: DetectionHistoryItem): AnalysisHistoryItem {
  const aiProb = Math.round(item.confidence * 100);
  return {
    id: item.id,
    textPreview: item.text_preview,
    aiProbability: item.result === "human_written" ? 100 - aiProb : aiProb,
    verdict: mapResultToVerdict(item.result),
    createdAt: item.created_at,
    wordCount: item.text_preview.split(/\s+/).length,
  };
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /** Returns stored access token from cookie. */
  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${AUTH_TOKEN_KEY}=`))
      ?.split("=")[1] ?? null;
  }

  /** Stores auth tokens in cookies. */
  setTokens(tokens: AuthTokens): void {
    // Access token — short-lived (30 min from backend config)
    document.cookie = `${AUTH_TOKEN_KEY}=${tokens.access_token}; path=/; max-age=1800; SameSite=Strict`;
    // Refresh token — longer-lived (7 days)
    document.cookie = `${REFRESH_TOKEN_KEY}=${tokens.refresh_token}; path=/; max-age=604800; SameSite=Strict`;
  }

  /** Clears auth tokens. */
  clearTokens(): void {
    document.cookie = `${AUTH_TOKEN_KEY}=; path=/; max-age=0`;
    document.cookie = `${REFRESH_TOKEN_KEY}=; path=/; max-age=0`;
  }

  /** Constructs headers with optional auth bearer token. */
  private getHeaders(contentType?: string): HeadersInit {
    const headers: HeadersInit = {};
    if (contentType) {
      headers["Content-Type"] = contentType;
    }
    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }

  /** Generic fetch wrapper with error handling. */
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders("application/json"),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        detail: "An unexpected error occurred",
      }));
      throw error;
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  // ---- Auth ----

  async login(credentials: LoginCredentials): Promise<AuthTokens> {
    return this.request<AuthTokens>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async register(credentials: RegisterCredentials): Promise<AuthTokens> {
    return this.request<AuthTokens>("/auth/register", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async getMe(): Promise<User> {
    return this.request<User>("/auth/me");
  }

  // ---- AI Detection ----

  async detectText(text: string): Promise<{ result: AnalysisResult; limits: UserLimits }> {
    const res = await this.request<AIDetectionWithLimitsResponse>("/ai-detection/detect-text", {
      method: "POST",
      body: JSON.stringify({ text }),
    });
    return {
      result: mapDetectionToAnalysisResult(res, text),
      limits: res.limits,
    };
  }

  async detectFile(file: File): Promise<{ result: AnalysisResult; limits: UserLimits }> {
    const formData = new FormData();
    formData.append("file", file);

    const token = this.getToken();
    const headers: HeadersInit = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const url = `${this.baseUrl}/ai-detection/detect-file`;
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        detail: "File upload failed",
      }));
      throw error;
    }

    const res: AIDetectionWithLimitsResponse = await response.json();
    return {
      result: mapDetectionToAnalysisResult(res, res.text_preview),
      limits: res.limits,
    };
  }

  async detectUrl(url: string): Promise<{ result: AnalysisResult; limits: UserLimits }> {
    const res = await this.request<AIDetectionWithLimitsResponse>("/ai-detection/detect-url", {
      method: "POST",
      body: JSON.stringify({ url }),
    });
    return {
      result: mapDetectionToAnalysisResult(res, res.text_preview),
      limits: res.limits,
    };
  }

  // ---- User Limits & History ----

  async getUserLimits(): Promise<UserLimits> {
    return this.request<UserLimits>("/user/limits");
  }

  async getDetectionHistory(
    limit = 50,
    offset = 0
  ): Promise<{ items: AnalysisHistoryItem[]; total: number }> {
    const res = await this.request<DetectionHistoryResponse>(
      `/user/history?limit=${limit}&offset=${offset}`
    );
    return {
      items: res.items.map(mapHistoryItem),
      total: res.total,
    };
  }

  async getUserStats(): Promise<UserStats> {
    return this.request<UserStats>("/user/stats");
  }

  async deleteHistory(): Promise<{ message: string; deleted_count: number }> {
    return this.request("/user/history", { method: "DELETE" });
  }

  // ---- Telegram ----

  async generateTelegramUrl(): Promise<TelegramConnectResponse> {
    return this.request<TelegramConnectResponse>("/telegram/connect", {
      method: "POST",
    });
  }

  async getTelegramStatus(): Promise<TelegramStatusResponse> {
    return this.request<TelegramStatusResponse>("/telegram/status");
  }

  async disconnectTelegram(): Promise<{ message: string }> {
    return this.request("/telegram/disconnect", { method: "DELETE" });
  }
}

export const apiClient = new ApiClient(
  process.env.NEXT_PUBLIC_API_BASE_URL || "/api/v1"
);
