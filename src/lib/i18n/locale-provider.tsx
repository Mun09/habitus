"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { dictionaries, type Locale, type TKey } from "./dictionaries";
import { LOCALE_COOKIE } from "./cookie";

type Bilingual<T> = T | { en: T; ko?: T };

type LocaleContextValue = {
  locale: Locale;
  t: (key: TKey) => string;
  pick: <T>(value: Bilingual<T>) => T;
  setLocale: (next: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

type ProviderProps = {
  children: React.ReactNode;
  initialLocale?: Locale;
};

export function LocaleProvider({ children, initialLocale = "en" }: ProviderProps) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback(
    (next: Locale) => {
      if (next === locale) return;
      setLocaleState(next);
      if (typeof document !== "undefined") {
        const oneYear = 60 * 60 * 24 * 365;
        document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${oneYear}; SameSite=Lax`;
      }
      router.refresh();
    },
    [locale, router],
  );

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      t: (key) => dictionaries[locale][key] ?? dictionaries.en[key] ?? key,
      pick: <T,>(value: Bilingual<T>) => {
        if (value && typeof value === "object" && "en" in (value as object)) {
          const obj = value as { en: T; ko?: T };
          if (locale === "ko" && obj.ko !== undefined) return obj.ko;
          return obj.en;
        }
        return value as T;
      },
      setLocale,
    }),
    [locale, setLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used inside LocaleProvider");
  return ctx;
}
