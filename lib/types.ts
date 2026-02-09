/**
 * Core application type definitions.
 * All types are designed to match the expected backend API contracts.
 */

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

export interface AnalysisRequest {
  text: string;
  language?: "ru" | "kk" | "en" | "auto";
}

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

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

export type AnalysisStatus = "idle" | "uploading" | "analyzing" | "complete" | "error";
