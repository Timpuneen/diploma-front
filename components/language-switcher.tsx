"use client";

/**
 * Language switcher dropdown for selecting between Russian and Kazakh.
 */

import { useLocale, type Locale } from "@/lib/i18n/locale-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";

const LOCALE_OPTIONS: { value: Locale; label: string; flag: string }[] = [
  { value: "ru", label: "Русский", flag: "RU" },
  { value: "kk", label: "Қазақша", flag: "KZ" },
];

export function LanguageSwitcher({ variant = "ghost" }: { variant?: "ghost" | "outline" }) {
  const { locale, setLocale } = useLocale();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size="sm" className="gap-2">
          <Languages className="h-4 w-4" />
          <span className="text-xs font-medium">
            {locale === "ru" ? "RU" : "KZ"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LOCALE_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setLocale(option.value)}
            className={locale === option.value ? "bg-accent" : ""}
          >
            <span className="mr-2 text-xs font-bold">{option.flag}</span>
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
