/**
 * Landing page features grid showcasing core capabilities.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Brain,
  FileText,
  Globe,
  BarChart3,
  Zap,
  Lock,
} from "lucide-react";

const FEATURES = [
  {
    icon: Brain,
    title: "Deep NLP Analysis",
    description:
      "Advanced natural language processing models trained on multilingual corpora for accurate AI text detection.",
  },
  {
    icon: Globe,
    title: "Multilingual Support",
    description:
      "Specialized support for Russian, Kazakh, and English languages with corpus-specific tuning.",
  },
  {
    icon: FileText,
    title: "Multiple Formats",
    description:
      "Upload plain text, PDF, or DOCX files for seamless analysis without manual copy-pasting.",
  },
  {
    icon: BarChart3,
    title: "Detailed Metrics",
    description:
      "Get perplexity, burstiness, entropy, and repetitiveness scores alongside the final verdict.",
  },
  {
    icon: Zap,
    title: "Fast Processing",
    description:
      "Results delivered in under 2 seconds with real-time progress tracking during analysis.",
  },
  {
    icon: Lock,
    title: "Secure & Private",
    description:
      "Your texts are processed securely and never stored permanently. Full data privacy guaranteed.",
  },
] as const;

export function FeaturesSection() {
  return (
    <section id="features" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-balance text-3xl font-bold text-foreground sm:text-4xl">
            Powerful detection capabilities
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
            Built with state-of-the-art machine learning techniques to
            provide reliable AI text detection across multiple languages.
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
