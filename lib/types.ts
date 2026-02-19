/**
 * Core application type definitions.
 * All types match the FastAPI backend API contracts.
 */

// ---- Auth ----

export interface User {
  id: string;
  username: string;
  email: string;
  is_active: boolean;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

// ---- AI Detection ----

export type DetectionResult = "ai_generated" | "human_written" | "uncertain";
export type DetectionSource = "text" | "file";

export interface AIDetectionResponse {
  result: DetectionResult;
  confidence: number;
  text_preview: string;
  source: DetectionSource;
  file_name: string | null;
  metadata: Record<string, unknown> | null;
}

export interface UserLimits {
  daily_limit: number;
  daily_used: number;
  daily_remaining: number;
  daily_reset_at: string;
  monthly_limit: number;
  monthly_used: number;
  monthly_remaining: number;
  monthly_reset_at: string;
  total_requests: number;
  is_premium: boolean;
  can_make_request: boolean;
}

export interface AIDetectionWithLimitsResponse extends AIDetectionResponse {
  limits: UserLimits;
}

// ---- Detection History ----

export interface DetectionHistoryItem {
  id: string;
  source: DetectionSource;
  file_name: string | null;
  result: DetectionResult;
  confidence: number;
  text_preview: string;
  created_at: string;
  processing_time_ms: number | null;
}

export interface DetectionHistoryResponse {
  items: DetectionHistoryItem[];
  total: number;
  limit: number;
  offset: number;
}

// ---- User Stats ----

export interface UserStats {
  total_detections: number;
  results_breakdown: Record<string, number>;
  average_confidence: number;
}

// ---- Telegram ----

export interface TelegramConnectResponse {
  bot_url: string;
}

export interface TelegramStatusResponse {
  is_connected: boolean;
  telegram_chat_id: string | null;
}

// ---- Legacy types kept for UI compatibility ----

export interface AnalysisRequest {
  text: string;
  language?: "ru" | "kk" | "en" | "auto";
}

/** Mapped from AIDetectionWithLimitsResponse for the results UI */
export interface AnalysisResult {
  id: string;
  text: string;
  aiProbability: number;
  humanProbability: number;
  verdict: "ai" | "human" | "mixed";
  language: string;
  wordCount: number;
  createdAt: string;
  metrics: AnalysisMetrics;
}

export interface AnalysisMetrics {
  perplexity: number;
  burstiness: number;
  entropy: number;
  repetitiveness: number;
}

export interface AnalysisHistoryItem {
  id: string;
  textPreview: string;
  aiProbability: number;
  verdict: "ai" | "human" | "mixed";
  createdAt: string;
  wordCount: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ValidationErrorItem {
  loc: string[];
  msg: string;
  type: string;
}

export interface ApiError {
  detail: string | ValidationErrorItem[];
  error_type?: string;
}

export type AnalysisStatus = "idle" | "uploading" | "analyzing" | "complete" | "error";
