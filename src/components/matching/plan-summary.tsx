"use client";

import Image from "next/image";
import Link from "next/link";
import { Sparkles, TrendingDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDesignPlan } from "@/lib/design-plan";
import { useLocale } from "@/lib/i18n/locale-provider";
import { CATEGORIES } from "@/lib/mock/design-options";
import { COST_BENCHMARK } from "@/lib/mock/materials";

export function PlanSummaryBanner() {
  const { plan, hasPlan, clearPlan } = useDesignPlan();
  const { t } = useLocale();
  if (!hasPlan || !plan) return null;

  const estimate = COST_BENCHMARK.ourQuote;
  const market = COST_BENCHMARK.marketAvg;
  const savings = market - estimate;
  const savingsPct = Math.round((savings / market) * 100);
  const fmtPrice = (v: number) =>
    `$${Math.round(v / 1300).toLocaleString()}`;

  return (
    <div className="rounded-3xl border border-primary/30 bg-primary/5 overflow-hidden">
      <div className="grid md:grid-cols-[200px_1fr] gap-0">
        {plan.heroProposal && (
          <div className="relative aspect-[4/3] md:aspect-auto md:h-full bg-muted">
            <Image
              src={plan.heroProposal}
              alt=""
              fill
              sizes="200px"
              className="object-cover"
            />
          </div>
        )}
        <div className="p-5 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-primary inline-flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                {t("matching.plan.title")}
              </div>
              <div className="serif text-xl font-medium mt-1">
                {plan.styleLabel}
              </div>
            </div>
            <button
              type="button"
              onClick={() => clearPlan()}
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 cursor-pointer"
              title={t("matching.plan.clear")}
            >
              <X className="h-3.5 w-3.5" />
              {t("matching.plan.clear")}
            </button>
          </div>

          {plan.options.length > 0 && (
            <div className="mt-4">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
                {t("matching.plan.options")} · {plan.options.length}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {plan.options.map((o) => (
                  <span
                    key={o.id}
                    className="inline-flex items-center gap-1.5 rounded-full bg-card border border-border px-2.5 py-1 text-[11px]"
                  >
                    {o.swatch && (
                      <span
                        className="h-2.5 w-2.5 rounded-full border border-border"
                        style={{ background: o.swatch }}
                      />
                    )}
                    <span className="text-muted-foreground text-[10px] uppercase tracking-wider">
                      {CATEGORIES.find((c) => c.key === o.category)?.label ?? ""}
                    </span>
                    {o.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 rounded-2xl bg-card border border-border p-3 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                {t("matching.plan.estimate")}
              </div>
              <div className="serif text-2xl font-medium leading-none mt-1">
                {fmtPrice(estimate)}
              </div>
              <div className="text-[11px] text-muted-foreground mt-1">
                {t("matching.plan.estimateNote")}
              </div>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-1 text-[11px] font-medium text-[color:var(--success)] bg-[color:var(--success)]/10 rounded-full px-2 py-0.5">
                <TrendingDown className="h-3 w-3" />
                {t("matching.plan.vsMarket")} −{savingsPct}%
              </div>
              <div className="text-[11px] text-muted-foreground mt-1">
                {fmtPrice(savings)} {t("matching.plan.savings")}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground">
              {t("matching.plan.attached")}
            </span>
            <Button asChild variant="outline" size="sm">
              <Link href="/design">{t("matching.plan.viewDesign")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
