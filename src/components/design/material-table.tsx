"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { MaterialItem } from "@/lib/mock/materials";
import { cn } from "@/lib/utils";

const TIER_COLORS: Record<string, string> = {
  basic: "bg-muted text-muted-foreground",
  standard: "bg-secondary/10 text-secondary",
  premium: "bg-primary/10 text-primary",
};

export function MaterialTable({ items }: { items?: MaterialItem[] } = {}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const list = items;

  if (!list) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
        Loading material list…
      </div>
    );
  }
  if (list.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
        No materials snapshotted for this proposal yet.
      </div>
    );
  }

  const fmt = (v: number) => `$${Math.round(v / 1300).toLocaleString()}`;

  const total = list.reduce((acc, m) => acc + m.unitPrice * m.qty, 0);

  return (
    <div className="rounded-3xl border border-border bg-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="serif text-base font-medium">Material list</div>
        <div className="text-xs text-muted-foreground">
          {list.length} items
        </div>
      </div>
      <div>
        {list.map((m) => {
          const isOpen = expanded === m.id;
          return (
            <div key={m.id} className="border-b border-border last:border-b-0">
              <button
                onClick={() => setExpanded(isOpen ? null : m.id)}
                className="w-full px-5 py-4 flex items-center gap-3 hover:bg-muted/30 transition cursor-pointer text-left"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {m.category}
                  </div>
                  <div className="text-sm font-medium mt-1 truncate">
                    {m.name}
                    {m.brand && (
                      <span className="text-muted-foreground font-normal">
                        {" · "}
                        {m.brand}
                      </span>
                    )}
                  </div>
                </div>
                <span
                  className={cn(
                    "text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-medium",
                    TIER_COLORS[m.tier]
                  )}
                >
                  {m.tier}
                </span>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">
                    {m.qty} {m.unit}
                  </div>
                  <div className="text-sm font-semibold">
                    {fmt(m.unitPrice * m.qty)}
                  </div>
                </div>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
              {isOpen && m.alternatives && (
                <div className="bg-muted/30 px-5 py-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                    Alternatives
                  </div>
                  <div className="space-y-1.5">
                    {m.alternatives.map((alt, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-xs"
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className={cn(
                              "px-1.5 py-0.5 rounded-full",
                              TIER_COLORS[alt.tier]
                            )}
                          >
                            {alt.tier}
                          </span>
                          {alt.name}
                        </span>
                        <span className="font-medium">
                          {fmt(alt.unitPrice * m.qty)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <div className="px-5 py-4 bg-muted/40 flex items-center justify-between">
          <span className="text-sm font-medium">Materials total</span>
          <span className="serif text-xl text-primary font-semibold">{fmt(total)}</span>
        </div>
      </div>
    </div>
  );
}
