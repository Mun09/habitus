"use client";

import { toast } from "sonner";
import { Check, Crown, Lock, Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDesignPlan } from "@/lib/design-plan";
import { useLocale } from "@/lib/i18n/locale-provider";
import { COST_BENCHMARK } from "@/lib/mock/materials";
import { formatKRW, cn } from "@/lib/utils";

const COVERAGE = [
  { key: "minor", ko: "잔하자 보수 (페인트, 마감 등)", en: "Minor defects (paint, finish)" },
  { key: "major", ko: "구조 하자 (배관, 전기, 누수)", en: "Structural (plumbing, electric, leaks)" },
  { key: "rework", ko: "재시공 보장", en: "Re-work guarantee" },
  { key: "free_pm", ko: "전담 PM 응대", en: "Dedicated PM support" },
  { key: "legal", ko: "분쟁 시 법률 상담 무료", en: "Free legal consult on dispute" },
];

const BASIC = ["minor", "major"];
const PREMIUM = ["minor", "major", "rework", "free_pm", "legal"];

const PREMIUM_TOTAL_DAYS = 365;
const BASIC_TOTAL_DAYS = 30;

export function WarrantyCard({
  projectStatus,
  daysSinceCompletion = 0,
}: {
  projectStatus: "in_progress" | "completed" | "pending";
  daysSinceCompletion?: number;
}) {
  const { t, locale } = useLocale();
  const { plan, setAftercareUpgrade } = useDesignPlan();
  const enrolled = !!plan?.aftercareUpgrade;
  // pre-construction option enrollment is only allowed when project hasn't started
  const canStillEnroll = projectStatus === "pending";

  if (enrolled) {
    return <EnrolledCard daysSinceCompletion={daysSinceCompletion} projectStatus={projectStatus} />;
  }

  return (
    <div
      className={cn(
        "rounded-3xl border bg-card overflow-hidden",
        canStillEnroll ? "border-primary/30 bg-primary/5" : "border-border"
      )}
    >
      <div className="p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0",
              canStillEnroll
                ? "bg-primary/15 text-primary"
                : "bg-muted text-muted-foreground"
            )}
          >
            {canStillEnroll ? (
              <Crown className="h-5 w-5" />
            ) : (
              <Lock className="h-5 w-5" />
            )}
          </div>
          <div className="flex-1">
            <div className="text-xs uppercase tracking-[0.16em] text-secondary inline-flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" />
              {t("aftercare.warranty.title")}
            </div>
            <h3 className="serif text-xl md:text-2xl font-medium mt-2">
              {t("aftercare.gate.title")}
            </h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-2xl">
              {t("aftercare.gate.body")}
            </p>
          </div>
        </div>

        {/* coverage compare */}
        <div className="mt-6 grid md:grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
              {t("aftercare.warranty.basic")}
            </div>
            <ul className="space-y-1.5 text-xs">
              {COVERAGE.map((c) => {
                const ok = BASIC.includes(c.key);
                return (
                  <li key={c.key} className="flex items-start gap-1.5">
                    {ok ? (
                      <Check className="h-3 w-3 text-[color:var(--success)] mt-0.5" />
                    ) : (
                      <X className="h-3 w-3 text-muted-foreground mt-0.5" />
                    )}
                    <span
                      className={
                        ok
                          ? "text-foreground"
                          : "text-muted-foreground line-through"
                      }
                    >
                      {locale === "ko" ? c.ko : c.en}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div
            className={cn(
              "rounded-2xl p-4",
              canStillEnroll
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border"
            )}
          >
            <div className="text-xs uppercase tracking-wider opacity-80 mb-2">
              {t("aftercare.warranty.premium")}
            </div>
            <ul className="space-y-1.5 text-xs">
              {COVERAGE.map((c) => (
                <li key={c.key} className="flex items-start gap-1.5">
                  <Check className="h-3 w-3 mt-0.5" />
                  <span>{locale === "ko" ? c.ko : c.en}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {canStillEnroll ? (
          <div className="mt-6 rounded-2xl bg-card border border-primary/30 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="serif text-3xl md:text-4xl font-medium text-primary">
                  {locale === "ko"
                    ? formatKRW(Math.round(COST_BENCHMARK.ourQuote * 0.5))
                    : `$${Math.round(
                        (COST_BENCHMARK.ourQuote * 0.5) / 1300
                      ).toLocaleString()}`}
                </span>
                <span className="text-sm text-muted-foreground">
                  {locale === "ko" ? "공사비의 50%" : "50% of construction cost"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
                {t("aftercare.gate.priceNote")}
              </p>
            </div>
            <Button
              size="lg"
              onClick={() => {
                if (!plan) {
                  toast.warning(
                    locale === "ko"
                      ? "먼저 AI 디자인 플랜을 만들어 주세요."
                      : "Please create a design plan first."
                  );
                  return;
                }
                setAftercareUpgrade(true);
                toast.success(
                  locale === "ko"
                    ? "사후관리 프리미엄에 가입되었습니다."
                    : "Enrolled in Aftercare Premium."
                );
              }}
            >
              <Crown className="h-4 w-4" />
              {t("aftercare.gate.cta")}
            </Button>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl bg-warning/10 border border-warning/30 p-4 flex gap-3">
            <Lock className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
            <div className="text-xs text-foreground/80 leading-relaxed">
              {t("aftercare.gate.locked")}
              <div className="text-[11px] text-muted-foreground mt-1">
                {t("aftercare.gate.unavailableNote")}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EnrolledCard({
  daysSinceCompletion,
  projectStatus,
}: {
  daysSinceCompletion: number;
  projectStatus: "in_progress" | "completed" | "pending";
}) {
  const { t, locale } = useLocale();
  const totalDays = PREMIUM_TOTAL_DAYS;
  const isStarted = projectStatus === "completed";
  const daysLeft = isStarted
    ? Math.max(totalDays - daysSinceCompletion, 0)
    : totalDays;

  const expiresOn = (() => {
    const d = new Date();
    d.setDate(d.getDate() + daysLeft);
    return d.toLocaleDateString(locale === "ko" ? "ko-KR" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  })();

  return (
    <div className="rounded-3xl border border-primary/40 bg-card overflow-hidden">
      <div className="grid md:grid-cols-2">
        <div className="p-7 md:border-r border-border">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 text-primary px-2.5 py-1 text-xs font-medium">
              <Crown className="h-3 w-3" />
              {t("aftercare.enrolled.activeBadge")}
            </span>
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              {t("aftercare.warranty.premium")}
            </span>
          </div>
          <h3 className="serif text-2xl font-medium mt-4">
            {t("aftercare.enrolled.title")}
          </h3>
          <div className="mt-6">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              {t("aftercare.enrolled.expires")}
            </div>
            <div className="serif text-7xl md:text-8xl font-medium text-primary leading-none mt-2">
              {daysLeft}
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              {t("aftercare.warranty.daysLeft")} ·{" "}
              {t("aftercare.enrolled.expiresOn")} {expiresOn}
            </div>
          </div>
          <div className="mt-6 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${(daysLeft / totalDays) * 100}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>{t("aftercare.enrolled.totalDays")}</span>
            <span>{totalDays}일</span>
          </div>
        </div>
        <div className="p-7 bg-muted/30">
          <div className="text-xs uppercase tracking-[0.16em] text-secondary mb-3">
            {t("aftercare.warranty.premium")}
          </div>
          <ul className="space-y-2 text-sm">
            {COVERAGE.map((c) => {
              const ok = PREMIUM.includes(c.key);
              return (
                <li key={c.key} className="flex items-start gap-2">
                  {ok ? (
                    <Check className="h-4 w-4 text-[color:var(--success)] mt-0.5 flex-shrink-0" />
                  ) : (
                    <X className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  )}
                  <span>{locale === "ko" ? c.ko : c.en}</span>
                </li>
              );
            })}
          </ul>
          {!isStarted && (
            <p className="mt-5 text-[11px] text-muted-foreground">
              {locale === "ko"
                ? "시공 완료 일자부터 보증이 시작됩니다."
                : "Coverage begins on construction completion date."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
