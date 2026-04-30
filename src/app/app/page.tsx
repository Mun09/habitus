"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { PhoneFrame } from "@/components/common/phone-frame";
import { useLocale } from "@/lib/i18n/locale-provider";
import {
  HomeScreen,
  DesignScreen,
  MatchingScreen,
  DetailScreen,
  TrackingScreen,
  AftercareScreen,
} from "@/components/app-preview/mobile-screens";

export default function AppPreviewPage() {
  const { t } = useLocale();
  const scrollerRef = useRef<HTMLDivElement>(null);

  const screens = [
    { key: "home", label: t("app.frame.home"), Component: HomeScreen },
    { key: "design", label: t("app.frame.design"), Component: DesignScreen },
    { key: "matching", label: t("app.frame.matching"), Component: MatchingScreen },
    { key: "detail", label: t("app.frame.detail"), Component: DetailScreen },
    { key: "tracking", label: t("app.frame.tracking"), Component: TrackingScreen },
    { key: "aftercare", label: t("app.frame.aftercare"), Component: AftercareScreen },
  ];

  const scroll = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 380, behavior: "smooth" });
  };

  return (
    <div className="bg-[#1a1714] text-white min-h-screen">
      <div className="mx-auto max-w-7xl px-5 md:px-8 pt-10 pb-20">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("nav.home")}
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-8 max-w-3xl"
        >
          <div className="text-xs uppercase tracking-[0.2em] text-primary mb-3">
            {t("nav.appPreview")}
          </div>
          <h1 className="serif text-4xl md:text-6xl font-medium leading-[1.05]">
            {t("app.title")}
          </h1>
          <p className="mt-5 text-lg text-white/70 max-w-xl">{t("app.body")}</p>
        </motion.div>

        <div className="mt-12 relative">
          <button
            onClick={() => scroll(-1)}
            className="hidden md:flex absolute -left-2 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur items-center justify-center cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scroll(1)}
            className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur items-center justify-center cursor-pointer"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div
            ref={scrollerRef}
            className="overflow-x-auto no-scrollbar pb-8 -mx-5 px-5 md:mx-0 md:px-0"
          >
            <div className="flex gap-10 md:gap-14 w-fit">
              {screens.map((s, i) => {
                const Comp = s.Component;
                return (
                  <motion.div
                    key={s.key}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.06 }}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="phone-frame">
                        <div className="phone-screen">
                          <Comp />
                        </div>
                      </div>
                      <div className="text-xs uppercase tracking-[0.18em] text-white/60">
                        {s.label}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
