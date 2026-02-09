"use client";

/**
 * Animated progress indicator shown during text analysis.
 */

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

const STEPS = [
  "Preprocessing text...",
  "Computing perplexity scores...",
  "Analyzing burstiness patterns...",
  "Calculating entropy metrics...",
  "Running classification model...",
  "Generating results...",
] as const;

export function AnalysisProgress() {
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);

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
      setStepIndex((prev) => (prev + 1) % STEPS.length);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 rounded-xl border border-border/50 bg-card p-12">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <div className="w-full max-w-md">
        <Progress value={progress} className="h-2" />
      </div>
      <p className="text-sm text-muted-foreground">{STEPS[stepIndex]}</p>
    </div>
  );
}
