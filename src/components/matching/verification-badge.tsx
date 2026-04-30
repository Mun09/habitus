"use client";

import { ShieldCheck, ShieldHalf } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-provider";
import { cn } from "@/lib/utils";

export function VerificationBadge({
  licensed,
  className,
}: {
  licensed: boolean;
  className?: string;
}) {
  const { t } = useLocale();
  if (licensed) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full bg-[color:var(--success)]/10 border border-[color:var(--success)]/30 text-[color:var(--success)] px-3 py-1 text-xs font-medium",
          className
        )}
      >
        <ShieldCheck className="h-3.5 w-3.5" />
        {t("matching.filter.licensed")}
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-secondary/10 border border-secondary/25 text-secondary px-3 py-1 text-xs font-medium",
        className
      )}
    >
      <ShieldHalf className="h-3.5 w-3.5" />
      {t("matching.filter.unlicensed")}
    </span>
  );
}
