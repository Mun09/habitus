"use client";

import { CountUp } from "@/components/common/count-up";
import { FadeIn } from "@/components/common/fade-in";
import { useLocale } from "@/lib/i18n/locale-provider";

export function TrustNumbers() {
  const { t } = useLocale();
  const items = [
    { value: 327, suffix: "+", label: t("landing.numbers.contractors") },
    {
      value: 4.2,
      suffix: ` ${t("landing.numbers.days")}`,
      label: t("landing.numbers.resolution"),
      decimals: 1,
    },
    { value: 96, suffix: "%", label: t("landing.numbers.satisfaction") },
  ];
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <FadeIn>
          <div className="rounded-3xl border border-border bg-card p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
            {items.map((item, i) => (
              <div
                key={i}
                className="text-center md:border-r md:last:border-r-0 border-border"
              >
                <div className="serif text-5xl md:text-6xl font-medium text-primary leading-none">
                  <CountUp
                    to={item.value}
                    decimals={item.decimals ?? 0}
                    suffix={item.suffix}
                  />
                </div>
                <div className="mt-3 text-sm text-muted-foreground">{item.label}</div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
