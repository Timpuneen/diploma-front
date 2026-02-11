"use client";

/**
 * Landing page section highlighting supported languages.
 */

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/lib/i18n/locale-context";

export function LanguagesSection() {
  const { t } = useLocale();

  const LANGUAGES = [
    {
      code: "RU",
      name: t.languagesSection.russian,
      description: t.languagesSection.russianDesc,
      status: t.languagesSection.stable,
    },
    {
      code: "KK",
      name: t.languagesSection.kazakh,
      description: t.languagesSection.kazakhDesc,
      status: t.languagesSection.stable,
    },
  ];

  return (
    <section id="languages" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-balance text-3xl font-bold text-foreground sm:text-4xl">
            {t.languagesSection.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
            {t.languagesSection.subtitle}
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-3xl gap-6 md:grid-cols-2">
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
