"use client";

/**
 * Landing page section highlighting supported languages.
 */

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/language-context";
import type { TranslationKey } from "@/lib/i18n";

const LANGUAGE_ITEMS: {
  code: string;
  nameKey: TranslationKey;
  descKey: TranslationKey;
}[] = [
  { code: "RU", nameKey: "langRuName", descKey: "langRuDesc" },
  { code: "KK", nameKey: "langKkName", descKey: "langKkDesc" },
];

export function LanguagesSection() {
  const { t } = useLanguage();

  return (
    <section id="languages" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-balance text-3xl font-bold text-foreground sm:text-4xl">
            {t("langTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
            {t("langSubtitle")}
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {LANGUAGE_ITEMS.map((lang) => (
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
                    {t("langStable")}
                  </Badge>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {t(lang.nameKey)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(lang.descKey)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
