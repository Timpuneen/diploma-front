"use client";

/**
 * Main text analysis page combining input form, progress, and results.
 * Connected to the FastAPI backend for AI detection via text, file, or URL.
 */

import { useCallback, useState } from "react";
import type { AnalysisResult, AnalysisStatus } from "@/lib/types";
import { apiClient } from "@/lib/api";
import { TextInputForm } from "@/components/dashboard/text-input-form";
import { AnalysisProgress } from "@/components/dashboard/analysis-progress";
import { AnalysisResults } from "@/components/dashboard/analysis-results";
import { useLocale } from "@/lib/i18n/locale-context";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export default function AnalyzePage() {
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { t } = useLocale();

  const handleAnalyze = useCallback(async (text: string, language: string) => {
    setStatus("analyzing");
    try {
      const { result: analysisResult } = await apiClient.detectText(text, language);
      setResult(analysisResult);
      setStatus("complete");
    } catch (err) {
      const detail = (err as { detail?: string })?.detail;
      toast.error(detail || t.analyze.analysisFailed);
      setStatus("error");
    }
  }, [t]);

  const handleFileAnalyze = useCallback(async (file: File, language: string) => {
    setStatus("uploading");
    try {
      const { result: analysisResult } = await apiClient.detectFile(file, language);
      setResult(analysisResult);
      setStatus("complete");
    } catch (err) {
      const detail = (err as { detail?: string })?.detail;
      toast.error(detail || t.analyze.fileFailed);
      setStatus("error");
    }
  }, [t]);

  const handleUrlAnalyze = useCallback(async (url: string) => {
    setStatus("analyzing");
    try {
      const { result: analysisResult } = await apiClient.detectUrl(url);
      setResult(analysisResult);
      setStatus("complete");
    } catch (err) {
      const detail = (err as { detail?: string })?.detail;
      toast.error(detail || t.analyze.urlFailed);
      setStatus("error");
    }
  }, [t]);

  function handleReset() {
    setStatus("idle");
    setResult(null);
  }

  const showResetButton = status === "complete" && result;

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t.analyze.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t.analyze.subtitle}
          </p>
        </div>
        {showResetButton && (
          <Button onClick={handleReset} variant="outline" className="gap-2 bg-transparent shrink-0">
            <RotateCcw className="h-4 w-4" />
            {t.results.analyzeAnother}
          </Button>
        )}
      </div>

      {status === "idle" || status === "error" ? (
        <TextInputForm
          onAnalyze={handleAnalyze}
          onFileAnalyze={handleFileAnalyze}
          onUrlAnalyze={handleUrlAnalyze}
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
