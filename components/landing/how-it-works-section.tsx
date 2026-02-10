"use client";

/**
 * Landing page section explaining the analysis workflow.
 */

import { useI18n } from "@/lib/i18n";
import { Upload, Cpu, CheckCircle } from "lucide-react";

const STEP_ICONS = [Upload, Cpu, CheckCircle];
const STEP_NUMBERS = ["01", "02", "03"];

export function HowItWorksSection() {
  const { t } = useI18n();

  return (
    <section id="how-it-works" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-balance text-3xl font-bold text-foreground sm:text-4xl">
            {t.howItWorks.heading}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
            {t.howItWorks.subheading}
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {t.howItWorks.steps.map((step, i) => {
            const Icon = STEP_ICONS[i];
            const num = STEP_NUMBERS[i];
            return (
              <div key={i} className="relative text-center">
                {i < t.howItWorks.steps.length - 1 && (
                  <div className="absolute right-0 top-12 hidden h-px w-full translate-x-1/2 bg-border md:block" />
                )}
                <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-2xl border border-border/50 bg-card">
                  <Icon className="h-8 w-8 text-primary" />
                  <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {num}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
