"use client";

import { useLocale } from "@/lib/i18n/locale-provider";
import { cn } from "@/lib/utils";

export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale } = useLocale();
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-card p-0.5 text-xs font-medium",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setLocale("ko")}
        className={cn(
          "px-3 py-1 rounded-full transition cursor-pointer",
          locale === "ko"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        KO
      </button>
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={cn(
          "px-3 py-1 rounded-full transition cursor-pointer",
          locale === "en"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        EN
      </button>
    </div>
  );
}
