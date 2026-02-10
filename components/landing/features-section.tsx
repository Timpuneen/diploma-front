"use client";

/**
 * Landing page features grid showcasing core capabilities.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import {
  Brain,
  FileText,
  Globe,
  BarChart3,
  Zap,
  Lock,
} from "lucide-react";

const FEATURE_ICONS = [Brain, Globe, FileText, BarChart3, Zap, Lock];

export function FeaturesSection() {
  const { t } = useI18n();

  return (
    <section id="features" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-balance text-3xl font-bold text-foreground sm:text-4xl">
            {t.features.heading}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
            {t.features.subheading}
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {t.features.items.map((feature, i) => {
            const Icon = FEATURE_ICONS[i];
            return (
              <Card
                key={i}
                className="border-border/50 bg-card transition-colors hover:border-primary/30"
              >
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
