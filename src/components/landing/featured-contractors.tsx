"use client";

import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Star } from "lucide-react";
import { FadeIn } from "@/components/common/fade-in";
import { SectionHeading } from "@/components/common/section-heading";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n/locale-provider";
import { CONTRACTORS } from "@/lib/mock/contractors";

export function FeaturedContractors() {
  const { t, pick } = useLocale();
  const featured = CONTRACTORS.slice(0, 4);

  return (
    <section className="py-24 md:py-32 bg-muted/40">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <FadeIn>
            <SectionHeading
              eyebrow={t("landing.contractors.eyebrow")}
              title={t("landing.contractors.title")}
              body={t("landing.contractors.body")}
            />
          </FadeIn>
          <FadeIn delay={0.1}>
            <Button asChild variant="outline">
              <Link href="/matching">{t("common.viewAll")}</Link>
            </Button>
          </FadeIn>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {featured.map((c, i) => (
            <FadeIn key={c.id} delay={i * 0.06}>
              <Link
                href={`/matching/${c.id}`}
                className="group block h-full rounded-3xl overflow-hidden border border-border bg-card transition-all hover:shadow-[0_18px_40px_rgba(42,39,36,0.1)] hover:-translate-y-0.5"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={c.cover}
                    alt={pick(c.name)}
                    fill
                    sizes="(min-width: 768px) 22vw, 44vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    {c.licensed ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-card/95 px-2.5 py-1 text-[10px] font-medium text-[color:var(--success)]">
                        <ShieldCheck className="h-3 w-3" />
                        {t("matching.filter.licensed")}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-card/95 px-2.5 py-1 text-[10px] font-medium text-secondary">
                        <ShieldCheck className="h-3 w-3" />
                        {t("matching.filter.unlicensed")}
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <div className="serif text-base md:text-lg font-medium leading-tight">
                    {pick(c.company)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {pick(c.name)} · {pick(c.region)}
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-xs">
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                      {c.rating}
                    </span>
                    <span className="text-muted-foreground">
                      {c.completedProjects}+
                    </span>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
