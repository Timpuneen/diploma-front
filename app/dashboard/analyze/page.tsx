"use client";

/**
 * Main text analysis page combining input form, progress, and results.
 * Uses mock analysis for demo; ready for backend integration.
 */

import { useCallback, useState } from "react";
import type { AnalysisResult, AnalysisStatus } from "@/lib/types";
import { generateMockAnalysis, simulateDelay } from "@/lib/mock";
import { TextInputForm } from "@/components/dashboard/text-input-form";
import { AnalysisProgress } from "@/components/dashboard/analysis-progress";
import { AnalysisResults } from "@/components/dashboard/analysis-results";
import { useLocale } from "@/lib/i18n/locale-context";
import { toast } from "sonner";

export default function AnalyzePage() {
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { t } = useLocale();

  const handleAnalyze = useCallback(async (text: string, _language: string) => {
    setStatus("analyzing");
    try {
      // TODO: Replace with apiClient.analyzeText({ text, language }) when backend is ready
      await simulateDelay(2000);
      const analysisResult = generateMockAnalysis(text);
      setResult(analysisResult);
      setStatus("complete");
    } catch {
      toast.error(t.analyze.analysisFailed);
      setStatus("error");
    }
  }, [t]);

  const handleFileAnalyze = useCallback(async (file: File, _language: string) => {
    setStatus("uploading");
    try {
      // TODO: Replace with apiClient.analyzeFile(file, language) when backend is ready
      await simulateDelay(2500);
      const mockText = `[Contents of ${file.name}] This is a placeholder for the extracted text from the uploaded file. In production, the backend will extract and analyze the actual file contents.`;
      const analysisResult = generateMockAnalysis(mockText);
      setResult(analysisResult);
      setStatus("complete");
    } catch {
      toast.error(t.analyze.fileFailed);
      setStatus("error");
    }
  }, [t]);

  function handleReset() {
    setStatus("idle");
    setResult(null);
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">{t.analyze.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t.analyze.subtitle}
        </p>
      </div>

      {status === "idle" || status === "error" ? (
        <TextInputForm
          onAnalyze={handleAnalyze}
          onFileAnalyze={handleFileAnalyze}
          isAnalyzing={false}
        />
      ) : status === "analyzing" || status === "uploading" ? (
        <AnalysisProgress />
      ) : status === "complete" && result ? (
        <AnalysisResults result={result} onReset={handleReset} />
      ) : null}
    </div>
  );
}
