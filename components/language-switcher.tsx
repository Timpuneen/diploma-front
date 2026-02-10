"use client";

/**
 * Language switcher toggle between Russian and Kazakh.
 */

import { useI18n, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const LOCALES: { value: Locale; label: string }[] = [
  { value: "ru", label: "RU" },
  { value: "kk", label: "KZ" },
];

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { locale, setLocale } = useI18n();

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border border-border/50 bg-background/50 p-0.5",
        className
      )}
      role="radiogroup"
      aria-label="Language"
    >
      {LOCALES.map((l) => (
        <button
          key={l.value}
          type="button"
          role="radio"
          aria-checked={locale === l.value}
          onClick={() => setLocale(l.value)}
          className={cn(
            "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
            locale === l.value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
