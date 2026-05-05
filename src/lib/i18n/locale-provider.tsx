"use client";

import { createContext, useContext, useMemo } from "react";
import { dictionaries, type Locale, type TKey } from "./dictionaries";

type LocaleContextValue = {
  locale: Locale;
  t: (key: TKey) => string;
  pick: <T>(value: T | { en: T }) => T;
};

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const value = useMemo<LocaleContextValue>(
    () => ({
      locale: "en",
      t: (key) => dictionaries.en[key] ?? key,
      pick: <T,>(value: T | { en: T }) =>
        value && typeof value === "object" && "en" in (value as object)
          ? (value as { en: T }).en
          : (value as T),
    }),
    []
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
