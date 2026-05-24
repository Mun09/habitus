"use client";

import { useTransition } from "react";
import { useLocale } from "@/lib/i18n/locale-provider";
import type { Locale } from "@/lib/i18n/dictionaries";
import { updateLocale } from "@/app/settings/actions";
import { cn } from "@/lib/utils";

const OPTIONS: { value: Locale; label: string }[] = [
  { value: "en", label: "English" },
  { value: "ko", label: "한국어" },
];

export function LanguageToggle() {
  const { locale, setLocale } = useLocale();
  const [pending, startTransition] = useTransition();

  const choose = (next: Locale) => {
    if (next === locale) return;
    setLocale(next);
    startTransition(() => {
      void updateLocale(next);
    });
  };

  return (
    <div
      role="radiogroup"
      aria-label="Language"
      className="inline-flex rounded-full border border-border bg-muted/40 p-1"
    >
      {OPTIONS.map((opt) => {
        const active = opt.value === locale;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => choose(opt.value)}
            disabled={pending}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-full transition cursor-pointer",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
              pending && "opacity-60",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
