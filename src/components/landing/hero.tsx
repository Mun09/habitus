"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n/locale-provider";
import { IMAGES } from "@/lib/mock/images";

export function Hero() {
  const { t } = useLocale();
  return (
    <section className="relative isolate overflow-hidden warm-grain min-h-[calc(100vh-4rem-5rem)] md:min-h-[calc(100vh-4rem)] flex items-center">
      <div className="absolute inset-0 -z-10">
        <Image
          src={IMAGES.hero.landing}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/96 via-background/85 to-background/40" />
      </div>

      <div className="mx-auto max-w-7xl w-full px-5 md:px-8 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-card/80 backdrop-blur border border-border px-4 py-1.5 text-xs font-medium text-foreground/80">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            {t("landing.hero.eyebrow")}
          </div>
          <h1 className="serif mt-6 text-5xl md:text-7xl font-medium leading-[1.05] tracking-tight whitespace-pre-line">
            {t("landing.hero.title")}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-foreground/75 leading-relaxed max-w-xl">
            {t("landing.hero.subtitle")}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button asChild size="xl">
              <Link href="/design">
                {t("landing.hero.ctaPrimary")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl">
              <Link href="/matching">{t("landing.hero.ctaSecondary")}</Link>
            </Button>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-foreground/70">
            <Pill icon={<Sparkles className="h-3.5 w-3.5" />} text={t("landing.hero.badge.ai")} />
            <Pill icon={<Users className="h-3.5 w-3.5" />} text={t("landing.hero.badge.matching")} />
            <Pill icon={<Clock className="h-3.5 w-3.5" />} text={t("landing.hero.badge.tracking")} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Pill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="text-primary">{icon}</span>
      {text}
    </span>
  );
}
