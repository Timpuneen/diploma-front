/**
 * Mock data generators for development and demo purposes.
 * Replace these with real API calls when backend is connected.
 */

import type { AnalysisHistoryItem, AnalysisResult, User } from "./types";

/** Simulates network delay. */
export function simulateDelay(ms = 1500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Generates a mock user object. */
export function getMockUser(): User {
  return {
    id: "usr_demo_001",
    email: "demo@aidetector.kz",
    name: "Demo User",
    createdAt: "2025-09-15T10:00:00Z",
  };
}

/** Generates a random analysis result with realistic metrics. */
export function generateMockAnalysis(text: string): AnalysisResult {
  const aiProb = Math.random();
  const wordCount = text.trim().split(/\s+/).length;

  let verdict: "ai" | "human" | "mixed";
  if (aiProb > 0.7) verdict = "ai";
  else if (aiProb < 0.3) verdict = "human";
  else verdict = "mixed";

  return {
    id: `analysis_${Date.now()}`,
    text,
    aiProbability: Math.round(aiProb * 100),
    humanProbability: Math.round((1 - aiProb) * 100),
    verdict,
    language: "auto",
    wordCount,
    createdAt: new Date().toISOString(),
    metrics: {
      perplexity: Math.round(Math.random() * 150 + 20),
      burstiness: Math.round(Math.random() * 100) / 100,
      entropy: Math.round(Math.random() * 8 * 100) / 100,
      repetitiveness: Math.round(Math.random() * 100) / 100,
    },
  };
}

/** Generates mock analysis history items. */
export function getMockHistory(): AnalysisHistoryItem[] {
  const samples = [
    "Artificial intelligence has transformed the way we interact with technology...",
    "The mountains of Kazakhstan stretch across the vast landscape...",
    "Machine learning algorithms process data to identify patterns...",
    "Spring arrived early this year, bringing warmth to the city...",
    "Neural networks are computational systems inspired by biological brains...",
  ];

  return samples.map((textPreview, i) => {
    const aiProb = Math.round(Math.random() * 100);
    let verdict: "ai" | "human" | "mixed";
    if (aiProb > 70) verdict = "ai";
    else if (aiProb < 30) verdict = "human";
    else verdict = "mixed";

    return {
      id: `hist_${i + 1}`,
      textPreview,
      aiProbability: aiProb,
      verdict,
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
      wordCount: Math.round(Math.random() * 500 + 50),
    };
  });
}
