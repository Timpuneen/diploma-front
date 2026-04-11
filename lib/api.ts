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
  SubscriptionStatus,
  BillingActionResponse,
  TelegramConnectResponse,
  TelegramStatusResponse,
  User,
  UserLimits,
  UserStats,
} from "./types";
import { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from "./constants";

const DEFAULT_ACCESS_MAX_AGE = 30 * 60;
const REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60;

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
    // Use language returned by backend if available, otherwise fall back to "auto"
    language: (res.metadata as Record<string, string>)?.language ?? "auto",
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
  console.log("[v0] History item from backend:", JSON.stringify(item, null, 2));
  const aiProb = Math.round(item.confidence * 100);
  return {
    id: item.id,
    textPreview: item.text_preview,
    aiProbability: item.result === "human_written" ? 100 - aiProb : aiProb,
    verdict: mapResultToVerdict(item.result),
    createdAt: item.created_at,
    wordCount: item.word_count ?? item.text_preview.split(/\s+/).filter(Boolean).length,
  };
}

function readCookieValue(key: string): string | null {
  if (typeof window === "undefined") return null;
  const row = document.cookie.split("; ").find((r) => r.startsWith(`${key}=`));
  if (!row) return null;
  const raw = row.slice(key.length + 1);
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

/** Merge init headers with base headers (supports Headers instances, not only plain objects). */
function mergeRequestHeaders(
  base: Record<string, string>,
  init?: RequestInit
): Headers {
  const merged = new Headers();
  for (const [k, v] of Object.entries(base)) {
    merged.set(k, v);
  }
  if (init?.headers) {
    const extra = new Headers(init.headers as HeadersInit);
    extra.forEach((value, key) => merged.set(key, value));
  }
  return merged;
}

function isAuthRefreshUrl(url: string): boolean {
  return url.includes("/auth/refresh");
}

class ApiClient {
  private baseUrl: string;
  /** Single in-flight refresh so parallel 401s share one POST /auth/refresh. */
  private refreshInFlight: Promise<AuthTokens | null> | null = null;
  private proactiveTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /** Returns stored access token from cookie. */
  private getToken(): string | null {
    return readCookieValue(AUTH_TOKEN_KEY);
  }

  /** Returns stored refresh token from cookie. */
  private getRefreshToken(): string | null {
    return readCookieValue(REFRESH_TOKEN_KEY);
  }

  /** Stores auth tokens in cookies. Access max-age follows backend `expires_in` when present. */
  setTokens(tokens: AuthTokens): void {
    const accessMaxAge =
      typeof tokens.expires_in === "number" && tokens.expires_in > 0
        ? tokens.expires_in
        : DEFAULT_ACCESS_MAX_AGE;
    document.cookie = `${AUTH_TOKEN_KEY}=${encodeURIComponent(tokens.access_token)}; path=/; max-age=${accessMaxAge}; SameSite=Strict`;
    document.cookie = `${REFRESH_TOKEN_KEY}=${encodeURIComponent(tokens.refresh_token)}; path=/; max-age=${REFRESH_COOKIE_MAX_AGE}; SameSite=Strict`;
    this.scheduleProactiveRefresh(accessMaxAge);
  }

  private clearProactiveTimer(): void {
    if (this.proactiveTimer !== null) {
      clearTimeout(this.proactiveTimer);
      this.proactiveTimer = null;
    }
  }

  /**
   * Silently refresh before access expiry so the access cookie is not dropped while the tab is idle.
   */
  private scheduleProactiveRefresh(accessTtlSeconds: number): void {
    this.clearProactiveTimer();
    if (typeof window === "undefined") return;
    const marginSec = 60;
    const delayMs = Math.max(10_000, (accessTtlSeconds - marginSec) * 1000);
    this.proactiveTimer = setTimeout(() => {
      this.proactiveTimer = null;
      void this.refreshTokens();
    }, delayMs);
  }

  /** Clears auth tokens. */
  clearTokens(): void {
    this.clearProactiveTimer();
    document.cookie = `${AUTH_TOKEN_KEY}=; path=/; max-age=0`;
    document.cookie = `${REFRESH_TOKEN_KEY}=; path=/; max-age=0`;
  }

  /**
   * Exchange refresh for new tokens. Returns null on failure (cookies cleared).
   * Concurrent calls share one network request.
   */
  async refreshTokens(): Promise<AuthTokens | null> {
    if (typeof window === "undefined") return null;
    const rt = this.getRefreshToken();
    if (!rt) return null;

    if (!this.refreshInFlight) {
      this.refreshInFlight = (async () => {
        try {
          const tokens = await this.requestPublic<AuthTokens>("/auth/refresh", {
            method: "POST",
            body: JSON.stringify({ refresh_token: rt }),
          });
          this.setTokens(tokens);
          return tokens;
        } catch {
          this.clearTokens();
          return null;
        } finally {
          this.refreshInFlight = null;
        }
      })();
    }
    return this.refreshInFlight;
  }

  /** Base headers for authenticated requests (Bearer when access cookie is present). */
  private buildAuthHeaders(contentType?: string): Record<string, string> {
    const headers: Record<string, string> = {};
    if (contentType) {
      headers["Content-Type"] = contentType;
    }
    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }

  /** JSON request without attaching the stored access token (public auth flows). */
  private getPublicJsonHeaders(): HeadersInit {
    return { "Content-Type": "application/json" };
  }

  private async requestPublic<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getPublicJsonHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        detail: "An unexpected error occurred",
      }));
      throw error;
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  /**
   * Authenticated fetch: on 401, or on 403 when access cookie is gone but refresh exists
   * (FastAPI returns 403 "Not authenticated" if Authorization is missing), refresh once then retry.
   */
  private async authFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const isFormData =
      typeof FormData !== "undefined" && options.body instanceof FormData;
    const contentType = isFormData ? undefined : "application/json";

    let response = await fetch(url, {
      ...options,
      headers: mergeRequestHeaders(this.buildAuthHeaders(contentType), options),
    });

    const hasRefresh = !!this.getRefreshToken();
    const missingAccessButHaveRefresh =
      !this.getToken() && hasRefresh;
    const shouldTryRefresh =
      hasRefresh &&
      !isAuthRefreshUrl(url) &&
      (response.status === 401 ||
        (response.status === 403 && missingAccessButHaveRefresh));

    if (shouldTryRefresh) {
      const refreshed = await this.refreshTokens();
      if (refreshed) {
        response = await fetch(url, {
          ...options,
          headers: mergeRequestHeaders(this.buildAuthHeaders(contentType), options),
        });
      }
    }

    return response;
  }

  /** Generic JSON request with Bearer; refresh + retry on 401. */
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await this.authFetch(url, options);

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        detail: "An unexpected error occurred",
      }));
      throw error;
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  // ---- Auth ----

  async login(credentials: LoginCredentials): Promise<AuthTokens> {
    return this.requestPublic<AuthTokens>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async register(credentials: RegisterCredentials): Promise<AuthTokens> {
    return this.requestPublic<AuthTokens>("/auth/register", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async getMe(): Promise<User> {
    return this.request<User>("/auth/me");
  }

  async verifyEmail(token: string): Promise<{ status: string }> {
    return this.request<{ status: string }>("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
  }

  async resendVerification(): Promise<void> {
    return this.request<void>("/auth/resend-verification", {
      method: "POST",
    });
  }

  async forgotPassword(payload: { email: string }): Promise<{ status: string; message: string }> {
    return this.requestPublic("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async validateResetToken(
    token: string
  ): Promise<{ valid: boolean; code: string | null }> {
    return this.requestPublic("/auth/reset-password/validate", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
  }

  async resetPassword(payload: {
    token: string;
    password: string;
  }): Promise<{ status: string }> {
    return this.requestPublic("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async loginWithGoogle(payload: {
    code: string;
    redirect_uri: string;
  }): Promise<AuthTokens> {
    return this.requestPublic<AuthTokens>("/auth/google", {
      method: "POST",
      body: JSON.stringify({
        code: payload.code,
        redirect_uri: payload.redirect_uri,
      }),
    });
  }

  // ---- AI Detection ----

  async detectText(text: string, language: string = "auto"): Promise<{ result: AnalysisResult; limits: UserLimits }> {
    const res = await this.request<AIDetectionWithLimitsResponse>("/ai-detection/detect-text", {
      method: "POST",
      body: JSON.stringify({ text, language }),
    });
    return {
      result: mapDetectionToAnalysisResult(res, text),
      limits: res.limits,
    };
  }

  async detectFile(file: File, language: string = "auto"): Promise<{ result: AnalysisResult; limits: UserLimits }> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("language", language);

    const url = `${this.baseUrl}/ai-detection/detect-file`;
    const response = await this.authFetch(url, {
      method: "POST",
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

  // ---- Billing ----

  async getSubscriptionStatus(): Promise<SubscriptionStatus> {
    return this.request<SubscriptionStatus>("/billing/subscription");
  }

  async createCheckoutSession(): Promise<{ url: string }> {
    return this.request<{ url: string }>("/billing/checkout", { method: "POST" });
  }

  async createPortalSession(): Promise<{ url: string }> {
    return this.request<{ url: string }>("/billing/portal", { method: "POST" });
  }

  async cancelSubscription(): Promise<BillingActionResponse> {
    return this.request<BillingActionResponse>("/billing/cancel", { method: "POST" });
  }

  async resumeSubscription(): Promise<BillingActionResponse> {
    return this.request<BillingActionResponse>("/billing/resume", { method: "POST" });
  }
}

export const apiClient = new ApiClient(
  process.env.NEXT_PUBLIC_API_BASE_URL || "/api/v1"
);
