"use client";

/**
 * Landing page features grid showcasing core capabilities.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocale } from "@/lib/i18n/locale-context";
import {
  Brain,
  FileText,
  Globe,
  BarChart3,
  Zap,
  Lock,
} from "lucide-react";
import type { ElementType } from "react";

export function FeaturesSection() {
  const { t } = useLocale();

  const FEATURES: { icon: ElementType; title: string; description: string }[] = [
    {
      icon: Brain,
      title: t.features.deepNlp,
      description: t.features.deepNlpDesc,
    },
    {
      icon: Globe,
      title: t.features.multilingual,
      description: t.features.multilingualDesc,
    },
    {
      icon: FileText,
      title: t.features.multipleFormats,
      description: t.features.multipleFormatsDesc,
    },
    {
      icon: BarChart3,
      title: t.features.detailedMetrics,
      description: t.features.detailedMetricsDesc,
    },
    {
      icon: Zap,
      title: t.features.fastProcessing,
      description: t.features.fastProcessingDesc,
    },
    {
      icon: Lock,
      title: t.features.securePrivate,
      description: t.features.securePrivateDesc,
    },
  ];

  return (
    <section id="features" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-balance text-3xl font-bold text-foreground sm:text-4xl">
            {t.features.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
            {t.features.subtitle}
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card
              key={feature.title}
              className="border-border/50 bg-card transition-colors hover:border-primary/30"
            >
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
