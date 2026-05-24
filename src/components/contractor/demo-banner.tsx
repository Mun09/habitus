"use client";

import { Sparkles } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-provider";

export function DemoBanner() {
  const { t } = useLocale();
  return (
    <div className="rounded-2xl border border-warning/40 bg-warning/10 px-4 py-3 flex items-start gap-3">
      <div className="mt-0.5 inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-warning/20 text-[color:var(--warning)]">
        <Sparkles className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--warning)]">
          {t("contractor.demo.badge")}
        </div>
        <p className="mt-1 text-xs leading-relaxed text-foreground/80">
          {t("contractor.demo.description")}
        </p>
      </div>
    </div>
  );
}
