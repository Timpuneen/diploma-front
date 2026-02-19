"use client";

/**
 * Analysis history page showing past text analyses.
 * Connected to the FastAPI backend for detection history.
 */

import { useEffect, useState } from "react";
import type { AnalysisHistoryItem } from "@/lib/types";
import { apiClient } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { useLocale } from "@/lib/i18n/locale-context";
import { FileSearch } from "lucide-react";

export default function HistoryPage() {
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLocale();

  function getVerdictBadge(verdict: AnalysisHistoryItem["verdict"]) {
    switch (verdict) {
      case "ai":
        return (
          <Badge variant="destructive" className="text-xs">
            {t.historyPage.aiLabel}
          </Badge>
        );
      case "human":
        return (
          <Badge className="bg-primary/10 text-primary border-primary/30 text-xs">
            {t.historyPage.humanLabel}
          </Badge>
        );
      case "mixed":
        return (
          <Badge variant="outline" className="border-[hsl(var(--warning))]/30 text-[hsl(var(--warning))] text-xs">
            {t.historyPage.mixedLabel}
          </Badge>
        );
    }
  }

  useEffect(() => {
    apiClient
      .getDetectionHistory(50, 0)
      .then(({ items }) => {
        setHistory(items);
      })
      .catch(() => {
        // Silently handle — user will see empty state
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">{t.historyPage.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t.historyPage.subtitle}
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner className="h-8 w-8" />
        </div>
      ) : history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FileSearch className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold text-foreground">
            {t.historyPage.noAnalyses}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {t.historyPage.historyAppear}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {history.map((item) => (
            <Card
              key={item.id}
              className="border-border/50 transition-colors hover:border-primary/20 cursor-pointer"
            >
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex-1 min-w-0 mr-4">
                  <p className="truncate text-sm font-medium text-foreground">
                    {item.textPreview}
                  </p>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{item.wordCount} {t.historyPage.words}</span>
                    <span>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-foreground">
                    {item.aiProbability}%
                  </span>
                  {getVerdictBadge(item.verdict)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
