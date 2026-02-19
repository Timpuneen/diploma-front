"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
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

export function LanguageSwitcher({ variant = "ghost", className }: { variant?: "ghost" | "outline"; className?: string }) {
  const { locale, setLocale } = useLocale();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Button variant={variant} size="sm" className={cn("gap-2", className)} disabled>
        <Languages className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size="sm" className={cn("gap-2", className)}>
          <Languages className="h-4 w-4" />
          <span className="text-xs font-medium">{locale === "ru" ? "RU" : "KZ"}</span>
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