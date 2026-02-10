"use client";

/**
 * Language context providing i18n support for Russian and Kazakh.
 * Stores the selected language in localStorage and provides a translation function.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ru, kk, type TranslationKey } from "./i18n";

export type Language = "ru" | "kk";

const LANGUAGE_STORAGE_KEY = "app_language";
const DEFAULT_LANGUAGE: Language = "ru";

const translations: Record<Language, Record<TranslationKey, string>> = {
  ru,
  kk,
};

export const LANGUAGE_OPTIONS: { value: Language; label: string }[] = [
  { value: "ru", label: "Русский" },
  { value: "kk", label: "Қазақша" },
];

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

function getStoredLanguage(): Language {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored === "ru" || stored === "kk") return stored;
  return DEFAULT_LANGUAGE;
}

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLanguageState(getStoredLanguage());
    setMounted(true);
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  }, []);

  const t = useCallback(
    (key: TranslationKey) => {
      return translations[language]?.[key] ?? key;
    },
    [language]
  );

  const value = useMemo(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t]
  );

  // Prevent hydration mismatch by rendering with default language first
  if (!mounted) {
    const defaultT = (key: TranslationKey) => translations[DEFAULT_LANGUAGE][key] ?? key;
    return (
      <LanguageContext.Provider value={{ language: DEFAULT_LANGUAGE, setLanguage, t: defaultT }}>
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
