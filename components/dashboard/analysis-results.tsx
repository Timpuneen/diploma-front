"use client";

import React from "react"

/**
 * Displays analysis results with verdict, probability gauge, and detailed metrics.
 */

import type { AnalysisResult } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useLocale } from "@/lib/i18n/locale-context";
import {
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  RotateCcw,
  Brain,
  Activity,
  Waves,
  Repeat,
} from "lucide-react";

interface AnalysisResultsProps {
  result: AnalysisResult;
  onReset: () => void;
}

export function AnalysisResults({ result, onReset }: AnalysisResultsProps) {
  const { t } = useLocale();

  /** Returns verdict-specific color class and icon. */
  function getVerdictConfig(v: AnalysisResult["verdict"]) {
    switch (v) {
      case "ai":
        return {
          label: t.results.aiGenerated,
          color: "text-destructive",
          bgColor: "bg-destructive/15",
          borderColor: "border-destructive/40",
          shadowColor: "shadow-destructive/10",
          icon: AlertTriangle,
        };
      case "human":
        return {
          label: t.results.humanWritten,
          color: "text-accent",
          bgColor: "bg-accent/15",
          borderColor: "border-accent/40",
          shadowColor: "shadow-accent/10",
          icon: CheckCircle,
        };
      case "mixed":
        return {
          label: t.results.mixedContent,
          color: "text-[hsl(var(--warning))]",
          bgColor: "bg-[hsl(var(--warning))]/15",
          borderColor: "border-[hsl(var(--warning))]/40",
          shadowColor: "shadow-[hsl(var(--warning))]/10",
          icon: HelpCircle,
        };
    }
  }

  const verdict = getVerdictConfig(result.verdict);
  const VerdictIcon = verdict.icon;

  return (
    <div className="flex flex-col gap-6">
      {/* Verdict card */}
      <Card className={`${verdict.borderColor} border shadow-lg ${verdict.shadowColor}`}>
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
              <span className="text-accent">{result.humanProbability}%</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress
              value={result.humanProbability}
              className="h-3 [&>div]:bg-accent"
            />
          </CardContent>
        </Card>
      </div>

      {/* Detailed metrics */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">{t.results.detailedMetrics}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              icon={Brain}
              label={t.results.perplexity}
              value={result.metrics.perplexity.toFixed(1)}
              description={t.results.perplexityDesc}
            />
            <MetricCard
              icon={Activity}
              label={t.results.burstiness}
              value={result.metrics.burstiness.toFixed(2)}
              description={t.results.burstinessDesc}
            />
            <MetricCard
              icon={Waves}
              label={t.results.entropy}
              value={result.metrics.entropy.toFixed(2)}
              description={t.results.entropyDesc}
            />
            <MetricCard
              icon={Repeat}
              label={t.results.repetitiveness}
              value={result.metrics.repetitiveness.toFixed(2)}
              description={t.results.repetitivenessDesc}
            />
          </div>
        </CardContent>
      </Card>

      {/* Analyzed text preview */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">{t.results.analyzedText}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-48 overflow-y-auto rounded-lg bg-background p-4">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {result.text.length > 2000
                ? `${result.text.slice(0, 2000)}...`
                : result.text}
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

interface MetricCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  description: string;
}

function MetricCard({ icon: Icon, label, value, description }: MetricCardProps) {
  return (
    <div className="group flex flex-col gap-2 rounded-lg border border-border/50 p-4 transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary transition-colors group-hover:text-accent" />
        <span className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
