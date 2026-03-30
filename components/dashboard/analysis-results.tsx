"use client";

import React, { useState } from "react";

/**
 * Displays analysis results with verdict, probability gauge, and expandable text view.
 */

import type { AnalysisResult } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useLocale } from "@/lib/i18n/locale-context";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  RotateCcw,
  Maximize2,
  Minimize2,
} from "lucide-react";

interface AnalysisResultsProps {
  result: AnalysisResult;
  onReset: () => void;
}

export function AnalysisResults({ result, onReset }: AnalysisResultsProps) {
  const { t } = useLocale();
  const [isExpanded, setIsExpanded] = useState(false);

  /** Returns verdict-specific color class and icon. */
  function getVerdictConfig(v: AnalysisResult["verdict"]) {
    switch (v) {
      case "ai":
        return {
          label: t.results.aiGenerated,
          color: "text-destructive",
          bgColor: "bg-destructive/10",
          borderColor: "border-destructive/30",
          icon: AlertTriangle,
        };
      case "human":
        return {
          label: t.results.humanWritten,
          color: "text-primary",
          bgColor: "bg-primary/10",
          borderColor: "border-primary/30",
          icon: CheckCircle,
        };
      case "mixed":
        return {
          label: t.results.mixedContent,
          color: "text-[hsl(var(--warning))]",
          bgColor: "bg-[hsl(var(--warning))]/10",
          borderColor: "border-[hsl(var(--warning))]/30",
          icon: HelpCircle,
        };
    }
  }

  const verdict = getVerdictConfig(result.verdict);
  const VerdictIcon = verdict.icon;

  return (
    <div className="flex flex-col gap-6">
      {/* Verdict card */}
      <Card className={`${verdict.borderColor} border`}>
        <CardContent className="flex flex-col items-center gap-4 py-8 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-full ${verdict.bgColor}`}
            >
              <VerdictIcon className={`h-7 w-7 ${verdict.color}`} />
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${verdict.color}`}>
                {verdict.label}
              </h2>
              <p className="text-sm text-muted-foreground">
                {result.wordCount} {t.results.wordsAnalyzed}
              </p>
            </div>
          </div>
          <Badge variant="outline" className={`${verdict.borderColor} ${verdict.color}`}>
            {result.aiProbability}% {t.results.aiProbability}
          </Badge>
        </CardContent>
      </Card>

      {/* Probability bars */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-sm">
              <span>{t.results.aiProbability}</span>
              <span className="text-destructive">{result.aiProbability}%</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress
              value={result.aiProbability}
              className="h-3 [&>div]:bg-destructive"
            />
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-sm">
              <span>{t.results.humanProbability}</span>
              <span className="text-primary">{result.humanProbability}%</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress
              value={result.humanProbability}
              className="h-3 [&>div]:bg-primary"
            />
          </CardContent>
        </Card>
      </div>

      {/* Analyzed text - expandable */}
      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base">{t.results.analyzedText}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            {isExpanded ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              "overflow-y-auto rounded-lg bg-background p-4 transition-all duration-300",
              isExpanded ? "max-h-[70vh] min-h-[400px]" : "max-h-64 min-h-[200px]"
            )}
          >
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
              {result.text}
            </p>
          </div>
        </CardContent>
      </Card>

      <Button onClick={onReset} variant="outline" className="gap-2 self-center bg-transparent">
        <RotateCcw className="h-4 w-4" />
        {t.results.analyzeAnother}
      </Button>
    </div>
  );
}
