"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, ShieldCheck, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n/locale-provider";
import { IMAGES } from "@/lib/mock/images";

const guardrails = ["Material clarity", "Verified pros", "Project tracking"];

export function Hero() {
  const { t } = useLocale();

  return (
    <section className="relative isolate overflow-hidden warm-grain">
      <div className="mx-auto grid min-h-[calc(100vh-4rem-5rem)] w-full max-w-7xl grid-cols-1 items-center gap-7 px-5 py-6 md:min-h-[calc(100vh-4rem)] md:grid-cols-[0.9fr_1.1fr] md:px-8 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 border-b border-primary/25 pb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            {t("landing.hero.eyebrow")}
          </div>

          <h1 className="serif mt-6 text-5xl font-medium leading-[0.96] text-secondary md:text-7xl">
            Habitus
          </h1>
          <p className="mt-4 max-w-xl text-xl leading-relaxed text-foreground/82 md:text-2xl">
            {t("landing.hero.title")}
          </p>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
            {t("landing.hero.subtitle")}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
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

          <div className="mt-7 grid max-w-xl grid-cols-1 gap-2 sm:grid-cols-3">
            {guardrails.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 border border-border bg-card/70 px-3 py-2 text-sm text-foreground/80 backdrop-blur"
              >
                <Check className="h-4 w-4 text-primary" />
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 grid grid-cols-[0.78fr_1fr] gap-3 md:gap-4"
        >
          <div className="flex flex-col gap-3 pt-8 md:gap-4 md:pt-14">
            <ImagePanel
              src={IMAGES.designDemo.before}
              label="Current space"
              className="aspect-[4/5]"
              priority
            />
            <SurfaceNote
              icon={<ShieldCheck className="h-4 w-4" />}
              title="Safer decisions"
              body="Design, quote, and contractor context stay connected."
            />
          </div>

          <div className="flex flex-col gap-3 md:gap-4">
            <ImagePanel
              src={IMAGES.designDemo.after}
              label="AI proposal"
              className="aspect-[4/5]"
              priority
            />
            <SurfaceNote
              icon={<Users className="h-4 w-4" />}
              title="Human follow-through"
              body="Move from visual direction to vetted execution."
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ImagePanel({
  src,
  label,
  className,
  priority,
}: {
  src: string;
  label: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden border border-border bg-muted shadow-[var(--shadow-warm)] ${className ?? ""}`}>
      <Image
        src={src}
        alt={label}
        fill
        priority={priority}
        sizes="(min-width: 768px) 38vw, 48vw"
        className="object-cover"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-secondary/86 to-transparent p-3">
        <span className="bg-card/92 px-2.5 py-1 text-xs font-medium text-secondary backdrop-blur">
          {label}
        </span>
      </div>
    </div>
  );
}

function SurfaceNote({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="border border-border bg-card/82 p-4 shadow-[var(--shadow-warm)] backdrop-blur">
      <div className="flex items-center gap-2 text-primary">
        {icon}
        <div className="text-sm font-semibold text-secondary">{title}</div>
      </div>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p>
    </div>
  );
}
