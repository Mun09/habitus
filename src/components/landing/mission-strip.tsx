"use client";

import { FadeIn } from "@/components/common/fade-in";
import { SectionHeading } from "@/components/common/section-heading";
import { useLocale } from "@/lib/i18n/locale-provider";

export function MissionStrip() {
  const { t } = useLocale();

  const stats = [
    { value: t("landing.mission.stat1"), label: t("landing.mission.stat1Label") },
    { value: t("landing.mission.stat2"), label: t("landing.mission.stat2Label") },
    { value: t("landing.mission.stat3"), label: t("landing.mission.stat3Label") },
  ];

  return (
    <section className="py-24 md:py-32 bg-muted/40">
      <div className="mx-auto max-w-7xl px-5 md:px-8 grid md:grid-cols-2 gap-12 items-end">
        <FadeIn>
          <SectionHeading
            eyebrow={t("landing.mission.eyebrow")}
            title={t("landing.mission.title")}
            body={t("landing.mission.body")}
          />
        </FadeIn>
        <FadeIn delay={0.15}>
          <div className="grid grid-cols-3 gap-6 md:gap-10">
            {stats.map((s, i) => (
              <div key={i} className="space-y-2">
                <div className="serif text-3xl md:text-5xl font-medium text-primary leading-none">
                  {s.value}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground leading-snug">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
