"use client";

import Image from "next/image";
import { Sparkles, Users, Activity, ShieldCheck } from "lucide-react";
import { FadeIn } from "@/components/common/fade-in";
import { SectionHeading } from "@/components/common/section-heading";
import { useLocale } from "@/lib/i18n/locale-provider";
import { IMAGES } from "@/lib/mock/images";

export function ProcessSteps() {
  const { t } = useLocale();

  const steps = [
    {
      n: "01",
      icon: Sparkles,
      title: t("landing.process.step1.title"),
      body: t("landing.process.step1.body"),
      image: IMAGES.moodboard.midcentury[0],
    },
    {
      n: "02",
      icon: Users,
      title: t("landing.process.step2.title"),
      body: t("landing.process.step2.body"),
      image: IMAGES.moodboard.scandinavian[0],
    },
    {
      n: "03",
      icon: Activity,
      title: t("landing.process.step3.title"),
      body: t("landing.process.step3.body"),
      image: IMAGES.projectUpdates[0],
    },
    {
      n: "04",
      icon: ShieldCheck,
      title: t("landing.process.step4.title"),
      body: t("landing.process.step4.body"),
      image: IMAGES.projectCompleted[0],
    },
  ];

  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <FadeIn>
          <SectionHeading
            eyebrow={t("landing.process.eyebrow")}
            title={t("landing.process.title")}
            align="center"
            className="mx-auto"
          />
        </FadeIn>
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <FadeIn key={step.n} delay={i * 0.08}>
                <div className="group relative h-full rounded-3xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-[0_24px_60px_rgba(42,39,36,0.12)] hover:-translate-y-1">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={step.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 22vw, 44vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />
                    <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-card/95 backdrop-blur px-3 py-1 text-xs font-medium">
                      <Icon className="h-3.5 w-3.5 text-primary" />
                      <span className="serif">{step.n}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="serif text-xl font-medium">{step.title}</h3>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {step.body}
                    </p>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
