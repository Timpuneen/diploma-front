"use client";

/**
 * Internationalization context providing locale state and dictionary access.
 * Supports Russian (ru) and Kazakh (kk) with locale persistence via localStorage.
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
import { createElement } from "react";
import type { Dictionary, Locale } from "./types";
import { ru } from "./ru";
import { kk } from "./kk";

const LOCALE_STORAGE_KEY = "app_locale";
const DEFAULT_LOCALE: Locale = "ru";

const dictionaries: Record<Locale, Dictionary> = { ru, kk };

interface I18nContextValue {
  locale: Locale;
  t: Dictionary;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

/** Hook to access the current locale and translation dictionary. */
export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  /* Hydrate locale from storage on mount */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null;
      if (stored && (stored === "ru" || stored === "kk")) {
        setLocaleState(stored);
      }
    } catch {
      /* ignore localStorage errors (SSR / privacy modes) */
    }
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    /* Update <html lang> attribute */
    document.documentElement.lang = next;
  }, []);

  const t = dictionaries[locale];

  const value = useMemo(() => ({ locale, t, setLocale }), [locale, t, setLocale]);

  return createElement(I18nContext.Provider, { value }, children);
}

export type { Dictionary, Locale };
