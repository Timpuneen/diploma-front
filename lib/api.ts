/**
 * API service layer providing a typed HTTP client.
 * All backend interactions should go through this module.
 * Currently uses mock implementations that can be swapped for real API calls.
 */

import type {
  AnalysisHistoryItem,
  AnalysisRequest,
  AnalysisResult,
  ApiError,
  LoginCredentials,
  RegisterCredentials,
  User,
} from "./types";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /** Returns stored auth token from cookie or memory. */
  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth_token="))
      ?.split("=")[1] ?? null;
  }

  /** Constructs headers with optional auth bearer token. */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }

  /**
   * Generic fetch wrapper with error handling.
   * Ready to be connected to a real backend.
   */
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        message: "An unexpected error occurred",
        statusCode: response.status,
      }));
      throw error;
    }

    return response.json();
  }

  // --- Auth ---

  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async register(credentials: RegisterCredentials): Promise<{ user: User; token: string }> {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async logout(): Promise<void> {
    return this.request("/auth/logout", { method: "POST" });
  }

  async getProfile(): Promise<User> {
    return this.request("/auth/profile");
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    return this.request("/auth/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  // --- Analysis ---

  async analyzeText(data: AnalysisRequest): Promise<AnalysisResult> {
    return this.request("/analysis/analyze", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async analyzeFile(file: File, language?: string): Promise<AnalysisResult> {
    const formData = new FormData();
    formData.append("file", file);
    if (language) formData.append("language", language);

    const token = this.getToken();
    const headers: HeadersInit = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const url = `${this.baseUrl}/analysis/analyze-file`;
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        message: "File upload failed",
        statusCode: response.status,
      }));
      throw error;
    }

    return response.json();
  }

  async getAnalysisHistory(): Promise<AnalysisHistoryItem[]> {
    return this.request("/analysis/history");
  }

  async getAnalysisById(id: string): Promise<AnalysisResult> {
    return this.request(`/analysis/${id}`);
  }
}

export const apiClient = new ApiClient(
  process.env.NEXT_PUBLIC_API_BASE_URL || "/api"
);
