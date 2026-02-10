"use client";

/**
 * Landing page features grid showcasing core capabilities.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/lib/language-context";
import type { TranslationKey } from "@/lib/i18n";
import {
  Brain,
  FileText,
  Globe,
  BarChart3,
  Zap,
  Lock,
} from "lucide-react";

const FEATURE_KEYS: {
  icon: typeof Brain;
  titleKey: TranslationKey;
  descKey: TranslationKey;
}[] = [
  { icon: Brain, titleKey: "featureNlpTitle", descKey: "featureNlpDesc" },
  { icon: Globe, titleKey: "featureMultilingualTitle", descKey: "featureMultilingualDesc" },
  { icon: FileText, titleKey: "featureFormatsTitle", descKey: "featureFormatsDesc" },
  { icon: BarChart3, titleKey: "featureMetricsTitle", descKey: "featureMetricsDesc" },
  { icon: Zap, titleKey: "featureFastTitle", descKey: "featureFastDesc" },
  { icon: Lock, titleKey: "featureSecureTitle", descKey: "featureSecureDesc" },
];

export function FeaturesSection() {
  const { t } = useLanguage();

  return (
    <section id="features" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-balance text-3xl font-bold text-foreground sm:text-4xl">
            {t("featuresTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
            {t("featuresSubtitle")}
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURE_KEYS.map((feature) => (
            <Card
              key={feature.titleKey}
              className="border-border/50 bg-card transition-colors hover:border-primary/30"
            >
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-foreground">{t(feature.titleKey)}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t(feature.descKey)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
