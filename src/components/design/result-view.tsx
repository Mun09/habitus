"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Info, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n/locale-provider";
import { useDesignPlan } from "@/lib/design-plan";
import { IMAGES } from "@/lib/mock/images";
import { DESIGN_OPTIONS } from "@/lib/mock/design-options";
import {
  RANDOM_STYLE_BENCHMARKS,
  RANDOM_STYLE_MATERIALS,
} from "@/lib/mock/materials";
import { cn } from "@/lib/utils";
import { BeforeAfter } from "./before-after";
import { MaterialTable } from "./material-table";
import { CostBenchmarkChart } from "./cost-benchmark-chart";
import { ContractChecklist } from "./contract-checklist";

const STYLE_LABELS: Record<string, { name: string; summary: string }> = {
  midcentury: {
    name: "Mid-century Modern",
    summary:
      "Warm woods, curved furniture, natural light. Living room in muted terracotta with oak flooring.",
  },
  minimalist: {
    name: "Minimalist White",
    summary: "Clean lines, white tones, allergy-friendly eco materials.",
  },
  industrial: {
    name: "Industrial",
    summary: "Exposed concrete and metal details — a cafe-like living space.",
  },
  scandinavian: {
    name: "Scandinavian",
    summary: "Bright tones and natural materials — warm, family-friendly.",
  },
  random: {
    name: "Random — 5 styles",
    summary:
      "Placed your chair and lamp in the W8 space and rendered 5 different moods. Pick your favorite to proceed.",
  },
};

const RANDOM_STYLE_VARIANTS: string[] = [
  "Warm minimalism",
  "Nordic Scandinavian",
  "Modern vintage",
  "Cozy home cafe",
  "Natural planterior",
];

type StyleKey =
  | "midcentury"
  | "minimalist"
  | "industrial"
  | "scandinavian"
  | "random";

export function ResultView({
  spaceImage,
  styleKey,
  userReferences,
  optionImages,
  selectedOptionIds,
  onRegenerate,
}: {
  spaceImage: string;
  styleKey: StyleKey;
  userReferences: string[];
  optionImages: string[];
  selectedOptionIds: string[];
  onRegenerate: () => void;
}) {
  const { t } = useLocale();
  const router = useRouter();
  const { savePlan } = useDesignPlan();
  const style = STYLE_LABELS[styleKey];

  const isRandom = styleKey === "random";

  // AI proposals — for Random, show all 5 specific style outputs;
  // otherwise mix the demo "after" with moodboard + completed gallery.
  const proposals = isRandom
    ? IMAGES.scenarios.random.styles
    : (() => {
        const k = styleKey as Exclude<StyleKey, "random">;
        return Array.from(
          new Set([
            IMAGES.designDemo.after,
            ...IMAGES.moodboard[k].slice(0, 4),
            ...IMAGES.projectCompleted.slice(0, 2),
          ])
        ).slice(0, 5);
      })();

  // For the Random scenario the 5 outputs are rendered onto the
  // reference space — override "before" so the slider stays coherent.
  const usedRandomReference = userReferences.includes(
    IMAGES.scenarios.random.referenceSpace
  );
  const heroBefore =
    isRandom && usedRandomReference
      ? IMAGES.scenarios.random.referenceSpace
      : spaceImage;

  const [activeProposal, setActiveProposal] = useState(proposals[0]);
  const heroAfter = activeProposal;

  // For Random, the active proposal index selects the per-variant
  // material list and cost benchmark — each style implies a distinct
  // surface treatment, flooring, lighting and built-in spec.
  const activeVariantIdx = isRandom
    ? Math.max(0, proposals.indexOf(activeProposal))
    : -1;
  const activeMaterials =
    activeVariantIdx >= 0
      ? RANDOM_STYLE_MATERIALS[activeVariantIdx]
      : undefined;
  const activeBenchmark =
    activeVariantIdx >= 0
      ? RANDOM_STYLE_BENCHMARKS[activeVariantIdx]
      : undefined;

  const proceedToMatching = () => {
    const options = selectedOptionIds
      .map((id) => DESIGN_OPTIONS.find((o) => o.id === id))
      .filter((o): o is NonNullable<typeof o> => !!o);
    // strip blob: refs that won't survive a reload
    const cleanUserRefs = userReferences.filter((r) => !r.startsWith("blob:"));
    const cleanSpace = spaceImage.startsWith("blob:") ? undefined : spaceImage;
    savePlan({
      styleKey,
      styleLabel: style.name,
      options,
      spaceImage: cleanSpace,
      heroProposal: activeProposal,
      proposals,
      userReferences: cleanUserRefs,
    });
    router.push(`/matching?planId=${styleKey}`);
  };

  return (
    <div className="space-y-7">
      {/* Hero summary */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="rounded-3xl border border-border bg-card overflow-hidden"
      >
        <div className="p-6 md:p-8 grid md:grid-cols-[1fr_320px] gap-6 items-start border-b border-border">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-primary">
              <Sparkles className="h-3.5 w-3.5" /> {t("design.result.title")}
            </div>
            <div className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">
              {t("design.result.style")}
            </div>
            <h2 className="serif text-3xl md:text-4xl font-medium mt-1">
              {style.name}
            </h2>
            <p className="mt-3 text-sm text-foreground/80 leading-relaxed max-w-xl">
              {style.summary}
            </p>
            <div className="mt-5 flex items-center gap-3">
              <Button size="lg" onClick={proceedToMatching}>
                {t("design.proceedToMatching")}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="ghost" onClick={onRegenerate}>
                <RotateCcw className="h-4 w-4" />
                {t("design.regenerate")}
              </Button>
            </div>
          </div>
          {(userReferences.length > 0 || optionImages.length > 0) && (
            <div className="space-y-4">
              {userReferences.length > 0 && (
                <ThumbStrip
                  label={t("design.reference.userUploads")}
                  count={userReferences.length}
                  images={userReferences}
                />
              )}
              {optionImages.length > 0 && (
                <ThumbStrip
                  label={t("design.reference.selectedOptions")}
                  count={optionImages.length}
                  images={optionImages}
                />
              )}
            </div>
          )}
        </div>

        {/* Before/After slider */}
        <div className="p-3 md:p-5">
          <BeforeAfter before={heroBefore} after={heroAfter} />
        </div>

        {/* Proposals grid */}
        <div className="px-6 pb-6 md:px-8 md:pb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              {t("design.result.proposalCount")} · {proposals.length}
            </span>
            <span className="text-[11px] text-muted-foreground hidden md:inline">
              {t("design.result.proposalHint")}
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {proposals.map((src, i) => {
              const active = src === activeProposal;
              const variantLabel = isRandom ? RANDOM_STYLE_VARIANTS[i] : null;
              return (
                <motion.button
                  type="button"
                  key={src + i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
                  onClick={() => setActiveProposal(src)}
                  className={cn(
                    "relative aspect-[4/5] rounded-2xl overflow-hidden bg-muted cursor-pointer transition group",
                    active
                      ? "ring-3 ring-primary ring-offset-2 ring-offset-card"
                      : "hover:opacity-90"
                  )}
                >
                  <Image
                    src={src}
                    alt={variantLabel ?? ""}
                    fill
                    sizes="(min-width: 768px) 18vw, 50vw"
                    className="object-cover pointer-events-none"
                    draggable={false}
                  />
                  {active && (
                    <span className="absolute top-2 left-2 rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-[10px] font-medium">
                      ●
                    </span>
                  )}
                  {variantLabel && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/85 to-transparent px-2 py-1.5">
                      <span className="text-[11px] text-background font-medium leading-tight">
                        {variantLabel}
                      </span>
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
          <div className="mt-4 flex items-start gap-2 rounded-2xl bg-muted/40 p-3 text-xs text-muted-foreground">
            <Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
            <span>{t("design.result.warning")}</span>
          </div>
        </div>
      </motion.div>

      {/* Materials, cost, contract */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <SectionLabel>
            {t("design.result.materials")}
            {isRandom && (
              <span className="ml-2 normal-case tracking-normal text-foreground/70">
                · {RANDOM_STYLE_VARIANTS[activeVariantIdx]}
              </span>
            )}
          </SectionLabel>
          <MaterialTable items={activeMaterials} />
        </div>
        <div className="space-y-6">
          <SectionLabel>{t("design.result.cost")}</SectionLabel>
          <CostBenchmarkChart benchmark={activeBenchmark} />
        </div>
      </div>
      <div>
        <SectionLabel>{t("design.result.contract")}</SectionLabel>
        <div className="mt-3">
          <ContractChecklist />
        </div>
      </div>

      <div className="rounded-3xl bg-primary/8 border border-primary/30 p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-primary">
            {t("design.stage.matching")}
          </div>
          <div className="serif text-lg md:text-xl mt-1">
            Let&apos;s match a contractor who fits this design.
          </div>
        </div>
        <Button size="lg" onClick={proceedToMatching}>
          {t("design.proceedToMatching")}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
      {children}
    </div>
  );
}

function ThumbStrip({
  label,
  count,
  images,
}: {
  label: string;
  count: number;
  images: string[];
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
        {label} · {count}
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {images.slice(0, 6).map((src, i) => {
          const isFile = src.startsWith("blob:") || src.startsWith("data:");
          return (
            <div
              key={src + i}
              className="relative aspect-square rounded-lg overflow-hidden bg-muted"
            >
              {isFile ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={src} alt="" className="w-full h-full object-cover" />
              ) : (
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
