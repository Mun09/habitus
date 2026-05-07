"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type DesignStage = "compose" | "generating" | "result";

const ORDER: DesignStage[] = ["compose", "generating", "result"];

export function StageIndicator({
  current,
  labels,
}: {
  current: DesignStage;
  labels: Record<DesignStage, string>;
}) {
  const idx = ORDER.indexOf(current);
  return (
    <div className="flex w-fit max-w-full items-center gap-1 overflow-x-auto border border-border bg-card p-1.5 shadow-[var(--shadow-warm)] no-scrollbar">
      {ORDER.map((s, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <div
            key={s}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all",
              active
                ? "bg-primary text-primary-foreground"
                : done
                ? "text-foreground/80"
                : "text-muted-foreground"
            )}
          >
            <span
              className={cn(
                "inline-flex h-5 w-5 items-center justify-center rounded-md text-[10px]",
                active
                  ? "bg-primary-foreground text-primary"
                  : done
                  ? "bg-primary/15 text-primary"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {done ? <Check className="h-3 w-3" /> : i + 1}
            </span>
            {labels[s]}
          </div>
        );
      })}
    </div>
  );
}
