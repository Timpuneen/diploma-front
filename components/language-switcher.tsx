"use client";

/**
 * Language switcher dropdown component for Russian/Kazakh toggle.
 */

import { useLanguage, LANGUAGE_OPTIONS } from "@/lib/language-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";

interface LanguageSwitcherProps {
  className?: string;
  compact?: boolean;
}

export function LanguageSwitcher({ className, compact }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  return (
    <Select value={language} onValueChange={(v) => setLanguage(v as "ru" | "kk")}>
      <SelectTrigger
        className={`${compact ? "w-[100px]" : "w-[130px]"} ${className ?? ""}`}
        aria-label="Select language"
      >
        <Globe className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {LANGUAGE_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
