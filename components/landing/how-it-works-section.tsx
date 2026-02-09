/**
 * Landing page section explaining the analysis workflow.
 */

import { Upload, Cpu, CheckCircle } from "lucide-react";

const STEPS = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Your Text",
    description:
      "Paste text directly or upload a file in TXT, PDF, or DOCX format. Supports up to 50,000 characters.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI Analysis",
    description:
      "Our NLP models analyze linguistic patterns, perplexity, burstiness, and entropy across the text.",
  },
  {
    icon: CheckCircle,
    step: "03",
    title: "Get Results",
    description:
      "Receive a detailed verdict with confidence percentages and metric breakdowns in seconds.",
  },
] as const;

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-balance text-3xl font-bold text-foreground sm:text-4xl">
            How it works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
            Three simple steps to verify the authenticity of any text.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <div key={step.step} className="relative text-center">
              {i < STEPS.length - 1 && (
                <div className="absolute right-0 top-12 hidden h-px w-full translate-x-1/2 bg-border md:block" />
              )}
              <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-2xl border border-border/50 bg-card">
                <step.icon className="h-8 w-8 text-primary" />
                <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {step.step}
                </span>
              </div>
              <h3 className="mt-6 text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
