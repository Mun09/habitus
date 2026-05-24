"use client";

import { Clock, Hammer, Star, Wallet } from "lucide-react";
import { DemoBanner } from "@/components/contractor/demo-banner";
import { useLocale } from "@/lib/i18n/locale-provider";
import { formatKRW } from "@/lib/utils";
import type { DemoAnalytics } from "@/lib/mock/contractor-demo";

type Props = {
  analytics: DemoAnalytics;
  isDemo: boolean;
};

export function AnalyticsClient({ analytics, isDemo }: Props) {
  const { t } = useLocale();
  const maxRevenue = Math.max(...analytics.monthlyRevenue.map((m) => m.revenue), 1);
  const maxRating = 5;
  const minRating = Math.min(...analytics.ratingTrend.map((r) => r.rating)) - 0.2;

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12">
      <div className="space-y-2">
        <h1 className="serif text-3xl font-medium leading-tight text-secondary md:text-4xl">
          {t("contractor.analytics.title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("contractor.analytics.subtitle")}
        </p>
      </div>

      {isDemo && (
        <div className="mt-5">
          <DemoBanner />
        </div>
      )}

      {/* KPIs */}
      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <KpiCard
          icon={<Hammer className="h-4 w-4" />}
          label={t("contractor.analytics.kpi.active")}
          value={String(analytics.activeCount)}
        />
        <KpiCard
          icon={<Hammer className="h-4 w-4" />}
          label={t("contractor.analytics.kpi.completed")}
          value={String(analytics.completedCount)}
        />
        <KpiCard
          icon={<Clock className="h-4 w-4" />}
          label={t("contractor.analytics.kpi.response")}
          value={`${analytics.avgResponseHours}h`}
        />
        <KpiCard
          icon={<Star className="h-4 w-4 fill-primary text-primary" />}
          label={t("contractor.analytics.kpi.rating")}
          value={`${analytics.rating} · ${analytics.reviewCount}`}
        />
      </div>

      {/* Revenue chart */}
      <section className="mt-10 rounded-3xl border border-border bg-card p-5 md:p-7">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="serif text-xl font-medium text-secondary">
              {t("contractor.analytics.revenueTitle")}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("contractor.analytics.revenueSubtitle")}
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 text-primary">
            <Wallet className="h-4 w-4" />
            <span className="serif text-lg font-medium">
              {formatKRW(
                analytics.monthlyRevenue.reduce((acc, m) => acc + m.revenue, 0),
              )}
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-12 items-end gap-2 h-48">
          {analytics.monthlyRevenue.map((m) => {
            const h = (m.revenue / maxRevenue) * 100;
            return (
              <div
                key={m.monthLabel}
                className="flex h-full flex-col items-center justify-end gap-2"
                title={`${m.monthLabel}: ${formatKRW(m.revenue)}`}
              >
                <div className="w-full overflow-hidden rounded-t-lg bg-muted">
                  <div
                    className="w-full bg-primary transition-all"
                    style={{ height: `${Math.max(h * 1.6, 4)}px` }}
                  />
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {m.monthLabel}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Rating trend */}
      <section className="mt-10 rounded-3xl border border-border bg-card p-5 md:p-7">
        <h2 className="serif text-xl font-medium text-secondary">
          {t("contractor.analytics.ratingTitle")}
        </h2>

        <div className="mt-6 grid grid-cols-6 items-end gap-3 h-32">
          {analytics.ratingTrend.map((r) => {
            const range = Math.max(maxRating - minRating, 0.1);
            const fillPct = ((r.rating - minRating) / range) * 100;
            return (
              <div
                key={r.month}
                className="flex h-full flex-col items-center justify-end gap-2"
                title={`${r.month}: ${r.rating}`}
              >
                <div className="text-[10px] font-medium text-foreground">
                  {r.rating.toFixed(1)}
                </div>
                <div className="w-full overflow-hidden rounded-t-md bg-muted h-full flex flex-col justify-end">
                  <div
                    className="w-full bg-secondary"
                    style={{ height: `${Math.max(fillPct, 8)}%` }}
                  />
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {r.month}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent reviews */}
      <section className="mt-10">
        <h2 className="serif text-xl font-medium text-secondary">
          {t("contractor.analytics.reviewsTitle")}
        </h2>
        <ul className="mt-4 space-y-3">
          {analytics.recentReviews.map((r) => (
            <li
              key={r.id}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {r.customerName}
                  </div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">
                    {r.projectTitle} · {formatDate(r.date)}
                  </div>
                </div>
                <div className="inline-flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={
                        "h-3.5 w-3.5 " +
                        (i < r.rating
                          ? "fill-primary text-primary"
                          : "text-muted")
                      }
                    />
                  ))}
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-foreground/85">
                {r.body}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-2 serif text-2xl font-medium text-foreground md:text-3xl">
        {value}
      </div>
    </div>
  );
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return iso;
  }
}
