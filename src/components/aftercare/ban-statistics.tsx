"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { useLocale } from "@/lib/i18n/locale-provider";
import { BAN_REASON_LABELS, MONTHLY_BANS, REASON_DISTRIBUTION } from "@/lib/mock/bans";

export function BanStatistics() {
  const { pick, locale } = useLocale();

  const chartData = MONTHLY_BANS.map((m) => ({
    month: m.month.slice(5),
    bans: m.bans,
  }));

  const total = REASON_DISTRIBUTION.reduce((acc, r) => acc + r.count, 0);

  return (
    <div className="grid md:grid-cols-2 gap-5">
      <div className="rounded-3xl border border-border bg-card p-5">
        <div className="serif text-base font-medium mb-4">
          {locale === "ko" ? "월별 영구 밴" : "Monthly bans"}
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ left: -20, top: 10, right: 10, bottom: 0 }}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="month"
                fontSize={11}
                stroke="var(--muted-foreground)"
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                fontSize={11}
                stroke="var(--muted-foreground)"
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={{ fill: "rgba(42,39,36,0.04)" }}
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                }}
              />
              <Bar dataKey="bans" radius={[6, 6, 0, 0]} fill="var(--danger)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-3xl border border-border bg-card p-5">
        <div className="serif text-base font-medium mb-4">
          {locale === "ko" ? "사유 분포 (12개월)" : "Reasons (12mo)"}
        </div>
        <div className="space-y-3">
          {REASON_DISTRIBUTION.map((r) => {
            const pct = (r.count / total) * 100;
            return (
              <div key={r.reason}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span>{pick(BAN_REASON_LABELS[r.reason])}</span>
                  <span className="text-muted-foreground">
                    {r.count} · {pct.toFixed(0)}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-secondary"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
