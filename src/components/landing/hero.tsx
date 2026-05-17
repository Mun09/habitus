"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n/locale-provider";

const verbs = [
  { word: "design", color: "text-secondary" },
  { word: "match", color: "text-primary" },
  { word: "track", color: "text-accent" },
];

const PUNCHLINE = "all in one Habitus.";
const HABITUS_START = PUNCHLINE.indexOf("Habitus");
const HABITUS_END = HABITUS_START + "Habitus".length - 1;

export function Hero() {
  const { t } = useLocale();

  return (
    <section className="relative isolate h-[calc(100dvh-4rem)] overflow-hidden warm-grain">
      <div className="mx-auto flex h-full w-full max-w-5xl flex-col items-center justify-center gap-7 px-5 py-8 text-center md:gap-10 md:px-8 md:py-10">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="serif flex items-center justify-center text-6xl font-medium leading-none tracking-tight text-secondary md:text-8xl"
          aria-label="Habitus"
        >
          <Image
            src="/logo.png"
            alt=""
            width={160}
            height={160}
            priority
            aria-hidden
            className="-mr-1 inline-block h-[1.15em] w-auto object-contain md:-mr-2"
          />
          <span aria-hidden>abitus</span>
        </motion.h1>

        <div className="flex flex-col items-center gap-3 md:gap-5">
          <div className="flex flex-col items-center gap-1.5 md:gap-2">
            {verbs.map((v, i) => (
              <motion.div
                key={v.word}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.65,
                  delay: 0.32 + i * 0.13,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="serif text-[2.75rem] font-light leading-[1.05] tracking-tight md:text-7xl"
              >
                <span className="text-secondary/45">We </span>
                <span className={`italic ${v.color}`}>{v.word}</span>
                <span className="text-secondary/45">.</span>
              </motion.div>
            ))}
          </div>

          <span
            aria-label={PUNCHLINE}
            className="serif inline-block whitespace-nowrap text-xl md:text-3xl"
          >
            {Array.from(PUNCHLINE).map((ch, i) => {
              const isHabitus = i >= HABITUS_START && i <= HABITUS_END;
              const isHabitusH = i === HABITUS_START;
              return (
                <motion.span
                  key={i}
                  aria-hidden
                  className={`inline-block ${
                    isHabitus
                      ? "italic text-secondary"
                      : "text-secondary/55"
                  }`}
                  animate={{
                    x: [-540, -180, 0],
                    y: [60, -260, 0],
                    opacity: [0, 1, 1],
                  }}
                  transition={{
                    duration: 1.05,
                    delay: 0.9 + i * 0.05,
                    times: [0, 0.5, 1],
                    ease: [0.42, 0, 0.2, 1],
                  }}
                >
                  {isHabitusH ? (
                    <Image
                      src="/logo.png"
                      alt=""
                      width={48}
                      height={48}
                      aria-hidden
                      className="-mr-[0.18em] inline-block h-[1.2em] w-auto -translate-y-[0.1em] object-contain"
                    />
                  ) : ch === " " ? (
                    " "
                  ) : (
                    ch
                  )}
                </motion.span>
              );
            })}
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Button asChild size="xl">
            <Link href="/design">
              {t("landing.hero.ctaPrimary")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
