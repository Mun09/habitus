"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { dictionaries, type Locale, type TKey } from "./dictionaries";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (next: Locale) => void;
  t: (key: TKey) => string;
  pick: <T>(value: { ko: T; en: T }) => T;
};

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

const STORAGE_KEY = "gather.locale";

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ko");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved === "ko" || saved === "en") {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = next;
  }, []);

  const t = useCallback(
    (key: TKey) => dictionaries[locale][key] ?? dictionaries.ko[key] ?? key,
    [locale]
  );

  const pick = useCallback(
    <T,>(value: { ko: T; en: T }) => value[locale],
    [locale]
  );

  const value = useMemo(
    () => ({ locale, setLocale, t, pick }),
    [locale, setLocale, t, pick]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used inside LocaleProvider");
  return ctx;
}
