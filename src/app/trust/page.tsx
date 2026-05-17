"use client";

import Image from "next/image";
import { Download, ShieldCheck, Sparkles, Lock, Scale } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/common/fade-in";
import { SectionHeading } from "@/components/common/section-heading";
import { useLocale } from "@/lib/i18n/locale-provider";
import { TRUST_FAQ, TRUST_LAYERS } from "@/lib/mock/bans";
import { IMAGES } from "@/lib/mock/images";
import { TrustStats } from "@/components/trust/trust-stats";

const ICONS = [ShieldCheck, Sparkles, Lock, Scale];

export default function TrustPage() {
  const { t } = useLocale();

  const reports = [
    {
      title: "Q1 2026 Trust Report",
      sub: "18 disputes, 9 permanent bans",
    },
    {
      title: "Q4 2025 Trust Report",
      sub: "14 disputes, 7 permanent bans",
    },
    {
      title: "Q3 2025 Trust Report",
      sub: "11 disputes, 6 permanent bans",
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative isolate overflow-hidden warm-grain">
        <div className="absolute inset-0 -z-10">
          <Image src={IMAGES.hero.trust} alt="" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/85 to-background/50" />
        </div>
        <div className="mx-auto max-w-5xl px-5 md:px-8 pt-20 pb-24 md:pt-28 md:pb-36">
          <FadeIn>
            <div className="text-xs uppercase tracking-[0.18em] text-primary mb-4">
              {t("nav.trust")}
            </div>
            <h1 className="serif text-5xl md:text-7xl font-medium leading-[1.05]">
              {t("trust.title")}
            </h1>
            <p className="mt-6 text-lg text-foreground/80 max-w-2xl leading-relaxed">
              {t("trust.body")}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Layers */}
      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <FadeIn>
            <SectionHeading title={t("trust.layers.title")} align="center" className="mx-auto" />
          </FadeIn>
          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {TRUST_LAYERS.map((layer, i) => {
              const Icon = ICONS[i];
              return (
                <FadeIn key={i} delay={i * 0.06}>
                  <div className="rounded-3xl border border-border bg-card p-6 h-full">
                    <div className="h-11 w-11 rounded-2xl bg-primary/15 text-primary flex items-center justify-center">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="serif text-lg font-medium mt-5">
                      {layer.title}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      {layer.body}
                    </p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Live ban stats from ban_records */}
      <TrustStats />

      {/* Reports */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <FadeIn>
            <SectionHeading
              title={t("trust.reports.title")}
              body={t("trust.reports.body")}
            />
          </FadeIn>
          <div className="mt-10 grid md:grid-cols-3 gap-5">
            {reports.map((r, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div className="rounded-3xl border border-border bg-card p-6 h-full flex flex-col">
                  <div className="text-xs uppercase tracking-wider text-primary">
                    Report
                  </div>
                  <div className="serif text-xl font-medium mt-2">{r.title}</div>
                  <div className="text-sm text-muted-foreground mt-2">{r.sub}</div>
                  <Button variant="outline" size="sm" className="mt-6 w-fit">
                    <Download className="h-3.5 w-3.5" />
                    PDF
                  </Button>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <FadeIn>
            <SectionHeading title={t("trust.faq.title")} align="center" className="mx-auto" />
          </FadeIn>
          <div className="mt-10">
            <Accordion type="single" collapsible>
              {TRUST_FAQ.map((q, i) => (
                <AccordionItem key={i} value={`q-${i}`}>
                  <AccordionTrigger>{q.q}</AccordionTrigger>
                  <AccordionContent>{q.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
}
