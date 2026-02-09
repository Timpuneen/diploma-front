/**
 * Landing page section highlighting supported languages.
 */

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const LANGUAGES = [
  {
    code: "RU",
    name: "Russian",
    description: "Full support for Russian language detection with a dedicated corpus of 500K+ samples.",
    status: "Stable",
  },
  {
    code: "KK",
    name: "Kazakh",
    description: "Specialized Kazakh language model trained on academic and web text corpora.",
    status: "Stable",
  },
  {
    code: "EN",
    name: "English",
    description: "Comprehensive English detection with broad training data coverage.",
    status: "Stable",
  },
] as const;

export function LanguagesSection() {
  return (
    <section id="languages" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-balance text-3xl font-bold text-foreground sm:text-4xl">
            Multilingual detection
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
            Purpose-built models for Russian and Kazakh language corpora,
            with English support included.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {LANGUAGES.map((lang) => (
            <Card
              key={lang.code}
              className="border-border/50 bg-card transition-colors hover:border-primary/30"
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-primary">
                    {lang.code}
                  </span>
                  <Badge
                    variant="outline"
                    className="border-primary/30 text-primary"
                  >
                    {lang.status}
                  </Badge>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {lang.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {lang.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
