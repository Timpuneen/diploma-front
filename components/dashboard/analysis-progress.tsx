"use client";

/**
 * Animated progress indicator shown during text analysis.
 */

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/lib/language-context";
import type { TranslationKey } from "@/lib/i18n";
import { Loader2 } from "lucide-react";

const STEP_KEYS: TranslationKey[] = [
  "progressStep1",
  "progressStep2",
  "progressStep3",
  "progressStep4",
  "progressStep5",
  "progressStep6",
];

export function AnalysisProgress() {
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 15 + 5;
        return next >= 95 ? 95 : next;
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % STEP_KEYS.length);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 rounded-xl border border-border/50 bg-card p-12">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <div className="w-full max-w-md">
        <Progress value={progress} className="h-2" />
      </div>
      <p className="text-sm text-muted-foreground">{t(STEP_KEYS[stepIndex])}</p>
    </div>
  );
}
