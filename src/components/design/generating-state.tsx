"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Check, Loader2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocale } from "@/lib/i18n/locale-provider";
import { cn } from "@/lib/utils";

const STEP_KEYS = ["analyze", "match", "materials", "benchmark", "contract"] as const;

export function GeneratingState({
  spaceImage,
  referenceImages,
  onDone,
  totalDuration = 4500,
}: {
  spaceImage?: string;
  referenceImages: string[];
  onDone: () => void;
  totalDuration?: number;
}) {
  const { t } = useLocale();
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    const stepDuration = totalDuration / STEP_KEYS.length;
    const intervals: NodeJS.Timeout[] = [];
    STEP_KEYS.forEach((_, i) => {
      intervals.push(
        setTimeout(() => setStepIdx(i + 1), stepDuration * (i + 1))
      );
    });
    intervals.push(setTimeout(() => onDone(), totalDuration + 200));
    return () => intervals.forEach((id) => clearTimeout(id));
  }, [onDone, totalDuration]);

  return (
    <div className="rounded-3xl border border-border bg-card overflow-hidden">
      <div className="relative aspect-[16/8] bg-foreground/85 overflow-hidden">
        {spaceImage && (
          <>
            <Image
              src={spaceImage}
              alt=""
              fill
              sizes="100vw"
              className="object-cover opacity-50"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
              className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-primary/40 to-transparent"
            />
          </>
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-background gap-3">
          <div className="h-14 w-14 rounded-2xl bg-primary/90 flex items-center justify-center">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="serif text-2xl md:text-3xl text-center px-6">
            {t("design.generating.title")}
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 grid md:grid-cols-[1fr_240px] gap-8 items-center">
        <ol className="space-y-3">
          {STEP_KEYS.map((s, i) => {
            const done = i < stepIdx;
            const active = i === stepIdx;
            return (
              <li key={s} className="flex items-center gap-3">
                <span
                  className={cn(
                    "h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0",
                    done
                      ? "bg-primary/15 text-primary"
                      : active
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {done ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : active ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <span className="text-[11px]">{i + 1}</span>
                  )}
                </span>
                <span
                  className={cn(
                    "text-sm",
                    active ? "font-medium text-foreground" : done ? "text-foreground/70" : "text-muted-foreground"
                  )}
                >
                  {t(`design.generating.step.${s}` as any)}
                </span>
              </li>
            );
          })}
        </ol>

        {referenceImages.length > 0 && (
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">
              {t("design.generating.inputs")}
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {referenceImages.slice(0, 6).map((src, i) => (
                <motion.div
                  key={src + i}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="relative aspect-square rounded-lg overflow-hidden bg-muted"
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
