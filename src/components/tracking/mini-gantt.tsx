"use client";

import { Check } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-provider";
import { PROJECT_STAGES, type ProjectStage } from "@/lib/mock/projects";
import { cn } from "@/lib/utils";

export function MiniGantt({ current }: { current: ProjectStage }) {
  const { t } = useLocale();
  const idx = PROJECT_STAGES.findIndex((s) => s.key === current);

  return (
    <div className="border border-border bg-card p-5 shadow-[var(--shadow-warm)]">
      <div className="mb-4 text-xs uppercase tracking-[0.16em] text-muted-foreground">
        {t("tracking.gantt.title")}
      </div>
      <ol className="space-y-3">
        {PROJECT_STAGES.map((s, i) => {
          const done = i < idx;
          const active = i === idx;
          return (
            <li key={s.key} className="flex items-center gap-3">
              <span
                className={cn(
                  "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-[11px] font-medium",
                  active
                    ? "bg-primary text-primary-foreground"
                    : done
                    ? "bg-primary/15 text-primary"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span
                className={cn(
                  "text-sm",
                  active
                    ? "font-medium text-foreground"
                    : done
                    ? "text-foreground/80"
                    : "text-muted-foreground"
                )}
              >
                {t(s.tKey as any)}
              </span>
              {active && (
                <span className="ml-auto text-[10px] uppercase tracking-wider text-primary">
                  Current
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
