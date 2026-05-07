"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/common/fade-in";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n/locale-provider";

export function CtaStrip() {
  const { t } = useLocale();
  return (
    <section className="py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <FadeIn>
          <div className="relative flex flex-col gap-8 overflow-hidden rounded-lg bg-secondary p-10 text-secondary-foreground md:flex-row md:items-center md:justify-between md:p-16">
            <div className="relative">
              <h2 className="serif text-3xl md:text-5xl leading-tight max-w-xl">
                {t("landing.cta.title")}
              </h2>
              <p className="mt-4 text-secondary-foreground/80 max-w-md">
                {t("landing.cta.body")}
              </p>
            </div>
            <div className="relative flex flex-wrap gap-3">
              <Button asChild size="xl" variant="default">
                <Link href="/design">
                  {t("landing.hero.ctaPrimary")} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="xl" variant="outline" className="border-card/30 bg-transparent text-secondary-foreground hover:bg-card/10">
                <Link href="/matching">{t("landing.hero.ctaSecondary")}</Link>
              </Button>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
