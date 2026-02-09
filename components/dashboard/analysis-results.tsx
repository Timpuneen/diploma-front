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

/** Returns verdict-specific color class and icon. */
function getVerdictConfig(verdict: AnalysisResult["verdict"]) {
  switch (verdict) {
    case "ai":
      return {
        label: "AI-Generated",
        color: "text-destructive",
        bgColor: "bg-destructive/10",
        borderColor: "border-destructive/30",
        icon: AlertTriangle,
      };
    case "human":
      return {
        label: "Human-Written",
        color: "text-primary",
        bgColor: "bg-primary/10",
        borderColor: "border-primary/30",
        icon: CheckCircle,
      };
    case "mixed":
      return {
        label: "Mixed Content",
        color: "text-[hsl(var(--warning))]",
        bgColor: "bg-[hsl(var(--warning))]/10",
        borderColor: "border-[hsl(var(--warning))]/30",
        icon: HelpCircle,
      };
  }
}

export function AnalysisResults({ result, onReset }: AnalysisResultsProps) {
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
                {result.wordCount} words analyzed
              </p>
            </div>
          </div>
          <Badge variant="outline" className={`${verdict.borderColor} ${verdict.color}`}>
            {result.aiProbability}% AI Probability
          </Badge>
        </CardContent>
      </Card>

      {/* Probability bars */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-sm">
              <span>AI Probability</span>
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
              <span>Human Probability</span>
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

      {/* Detailed metrics */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Detailed Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              icon={Brain}
              label="Perplexity"
              value={result.metrics.perplexity.toFixed(1)}
              description="Language model surprise score"
            />
            <MetricCard
              icon={Activity}
              label="Burstiness"
              value={result.metrics.burstiness.toFixed(2)}
              description="Sentence length variation"
            />
            <MetricCard
              icon={Waves}
              label="Entropy"
              value={result.metrics.entropy.toFixed(2)}
              description="Information density"
            />
            <MetricCard
              icon={Repeat}
              label="Repetitiveness"
              value={result.metrics.repetitiveness.toFixed(2)}
              description="Pattern repetition score"
            />
          </div>
        </CardContent>
      </Card>

      {/* Analyzed text preview */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Analyzed Text</CardTitle>
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
        Analyze Another Text
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
    <div className="flex flex-col gap-2 rounded-lg border border-border/50 p-4">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <span className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
