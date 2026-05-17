"use client";

import { useEffect, useState } from "react";

type Stats = {
  total: number;
  monthly: { month: string; count: number }[];
  byReason: { reason: string; count: number }[];
};

const REASON_LABEL: Record<string, string> = {
  quote_fraud: "Quote fraud",
  material_swap: "Material swap",
  abandonment: "Abandonment",
  false_license: "False license",
  abuse: "Verbal abuse",
};

export function TrustStats() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/trust/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: Stats | null) => {
        if (!cancelled) setStats(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!stats || stats.total === 0) return null;

  const peakMonth = stats.monthly.reduce(
    (acc, m) => (m.count > acc.count ? m : acc),
    { month: "", count: 0 }
  );

  return (
    <section className="py-20 md:py-24 bg-muted/40">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1fr_2fr]">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-primary">
              Trust by the numbers
            </div>
            <h2 className="serif text-3xl md:text-4xl font-medium mt-3 leading-tight">
              {stats.total} contractors permanently removed in the last 12 months
            </h2>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Verified incidents only. Reports map to specific violations
              tracked in our `ban_records` audit log. The peak month was{" "}
              <span className="text-foreground font-medium">
                {peakMonth.month}
              </span>{" "}
              with {peakMonth.count} bans.
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                  By reason
                </div>
                <ul className="space-y-2">
                  {stats.byReason.map((r) => {
                    const pct =
                      stats.total > 0
                        ? Math.round((r.count / stats.total) * 100)
                        : 0;
                    return (
                      <li key={r.reason} className="text-sm">
                        <div className="flex items-center justify-between">
                          <span>{REASON_LABEL[r.reason] ?? r.reason}</span>
                          <span className="font-medium tabular-nums">
                            {r.count}
                          </span>
                        </div>
                        <div className="mt-1 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                  By month
                </div>
                <div className="flex h-32 items-end gap-1.5">
                  {stats.monthly.map((m) => {
                    const max = Math.max(...stats.monthly.map((x) => x.count));
                    const h = max > 0 ? Math.round((m.count / max) * 100) : 0;
                    return (
                      <div
                        key={m.month}
                        className="flex-1 flex flex-col items-center gap-1"
                        title={`${m.month}: ${m.count}`}
                      >
                        <div
                          className="w-full bg-primary/30 rounded-t"
                          style={{ height: `${h}%` }}
                        />
                        <div className="text-[9px] uppercase text-muted-foreground tracking-wider">
                          {m.month.slice(5)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
