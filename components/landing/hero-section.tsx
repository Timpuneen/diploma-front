"use client";

/**
 * Landing page hero section with primary call-to-action.
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/lib/constants";
import { useLocale } from "@/lib/i18n/locale-context";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
  const { t } = useLocale();

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(160_84%_39%/0.08),transparent_70%)]" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <Badge
          variant="outline"
          className="mb-6 border-primary/30 bg-primary/5 text-primary"
        >
          <Sparkles className="mr-1.5 h-3 w-3" />
          {t.hero.badge}
        </Badge>

        <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          {t.hero.titleStart}{" "}
          <span className="text-primary">{t.hero.titleHighlight}</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
          {t.hero.description}
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" asChild className="gap-2 px-8">
            <Link href={ROUTES.REGISTER}>
              {t.hero.startAnalyzing}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="gap-2 px-8 bg-transparent">
            <a href="#how-it-works">{t.hero.learnMore}</a>
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8">
          {[
            { value: "67.69%", label: t.hero.accuracy },
            { value: "2", label: t.hero.languagesCount },
            { value: "<2s", label: t.hero.analysisTime },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl font-bold text-foreground sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
