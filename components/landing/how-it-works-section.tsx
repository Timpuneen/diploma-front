"use client";

/**
 * Landing page section explaining the analysis workflow.
 */

import { useLanguage } from "@/lib/language-context";
import type { TranslationKey } from "@/lib/i18n";
import { Upload, Cpu, CheckCircle } from "lucide-react";

const STEP_KEYS: {
  icon: typeof Upload;
  step: string;
  titleKey: TranslationKey;
  descKey: TranslationKey;
}[] = [
  { icon: Upload, step: "01", titleKey: "step1Title", descKey: "step1Desc" },
  { icon: Cpu, step: "02", titleKey: "step2Title", descKey: "step2Desc" },
  { icon: CheckCircle, step: "03", titleKey: "step3Title", descKey: "step3Desc" },
];

export function HowItWorksSection() {
  const { t } = useLanguage();

  return (
    <section id="how-it-works" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-balance text-3xl font-bold text-foreground sm:text-4xl">
            {t("howItWorksTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
            {t("howItWorksSubtitle")}
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {STEP_KEYS.map((step, i) => (
            <div key={step.step} className="relative text-center">
              {i < STEP_KEYS.length - 1 && (
                <div className="absolute right-0 top-12 hidden h-px w-full translate-x-1/2 bg-border md:block" />
              )}
              <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-2xl border border-border/50 bg-card">
                <step.icon className="h-8 w-8 text-primary" />
                <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {step.step}
                </span>
              </div>
              <h3 className="mt-6 text-lg font-semibold text-foreground">
                {t(step.titleKey)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t(step.descKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
