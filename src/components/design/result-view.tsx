"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Info,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n/locale-provider";
import { useDesignPlan } from "@/lib/design-plan";
import { DESIGN_OPTIONS } from "@/lib/mock/design-options";
import type { MaterialItem } from "@/lib/mock/materials";
import type { CostBenchmark } from "@/lib/mock/materials";
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
    summary: "Exposed concrete and metal details, a cafe-like living space.",
  },
  scandinavian: {
    name: "Scandinavian",
    summary: "Bright tones and natural materials. Warm, family-friendly.",
  },
  random: {
    name: "Random · 5 styles",
    summary:
      "Five distinct moods rendered onto your space. Pick your favorite to proceed.",
  },
};

const RANDOM_STYLE_VARIANT_LABELS: string[] = [
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
  spaceImages,
  styleKey,
  userReferences,
  optionImages,
  selectedOptionIds,
  generatedUrls,
  planDbId,
  onRegenerate,
}: {
  spaceImage: string;
  spaceImages?: string[];
  styleKey: StyleKey;
  userReferences: string[];
  optionImages: string[];
  selectedOptionIds: string[];
  generatedUrls?: string[];
  planDbId?: string | null;
  onRegenerate: () => void;
}) {
  const { t } = useLocale();
  const router = useRouter();
  const { savePlan } = useDesignPlan();
  const style = STYLE_LABELS[styleKey];

  const isRandom = styleKey === "random";
  const proposals: string[] = generatedUrls ?? [];
  const allSpaces: string[] = proposals.map(
    (_, i) => spaceImages?.[i] ?? spaceImage
  );
  const labels: string[] = proposals.map((_, i) =>
    isRandom
      ? RANDOM_STYLE_VARIANT_LABELS[i] ?? `Proposal ${i + 1}`
      : `Proposal ${i + 1}`
  );
  const isMultiSpace = proposals.length > 1;

  const [activeProposal, setActiveProposal] = useState(proposals[0] ?? "");
  useEffect(() => {
    // When generation finishes (proposals first appear) make sure the
    // active selection points at a real URL.
    if (!activeProposal && proposals[0]) setActiveProposal(proposals[0]);
  }, [proposals, activeProposal]);

  const activeIdx = Math.max(0, proposals.indexOf(activeProposal));
  const heroAfter = activeProposal;
  const heroBefore = allSpaces[activeIdx] ?? spaceImage;

  // Per-variant material BOM + cost benchmark are snapshotted server-side
  // at generation time, then fetched here when the user switches proposals.
  const [bom, setBom] = useState<{
    items: MaterialItem[] | null;
    benchmark: CostBenchmark | null;
  }>({ items: null, benchmark: null });
  useEffect(() => {
    if (!planDbId) return;
    let cancelled = false;
    const variantIdx = isMultiSpace ? activeIdx : 0;
    fetch(`/api/design/plans/${planDbId}/materials?variant=${variantIdx}`)
      .then((r) => (r.ok ? r.json() : { items: [], benchmark: null }))
      .then(
        (data: { items: MaterialItem[]; benchmark: CostBenchmark | null }) => {
          if (cancelled) return;
          setBom({
            items: data.items ?? [],
            benchmark: data.benchmark ?? null,
          });
        }
      )
      .catch(() => {
        if (!cancelled) setBom({ items: [], benchmark: null });
      });
    return () => {
      cancelled = true;
    };
  }, [planDbId, activeIdx, isMultiSpace]);

  const goPrev = () =>
    setActiveProposal(
      proposals[(activeIdx - 1 + proposals.length) % proposals.length]
    );
  const goNext = () =>
    setActiveProposal(proposals[(activeIdx + 1) % proposals.length]);

  useEffect(() => {
    if (!isMultiSpace) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMultiSpace, activeIdx, proposals.length]);

  const swipeStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    if (!isMultiSpace) return;
    swipeStartX.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!isMultiSpace || swipeStartX.current == null) return;
    const dx = (e.changedTouches[0]?.clientX ?? 0) - swipeStartX.current;
    swipeStartX.current = null;
    if (Math.abs(dx) < 40) return;
    if (dx < 0) goNext();
    else goPrev();
  };

  const proceedToMatching = () => {
    const options = selectedOptionIds
      .map((id) => DESIGN_OPTIONS.find((o) => o.id === id))
      .filter((o): o is NonNullable<typeof o> => !!o);
    const cleanUserRefs = userReferences.filter((r) => !r.startsWith("blob:"));
    const cleanSpace = spaceImage.startsWith("blob:") ? undefined : spaceImage;
    savePlan({
      dbId: planDbId ?? undefined,
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

  if (proposals.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center text-muted-foreground">
        <Sparkles className="mx-auto mb-4 h-6 w-6 text-primary" />
        <p>No proposals yet. Generate a design first.</p>
        <Button className="mt-6" onClick={onRegenerate}>
          Back to compose
        </Button>
      </div>
    );
  }

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
            {isMultiSpace && (
              <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary">
                <Sparkles className="h-3 w-3" />
                {proposals.length} proposals · slide to compare
              </div>
            )}
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
        <div
          className="p-3 md:p-5 relative"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isMultiSpace ? `space-${activeIdx}` : "single"}
              initial={{ opacity: 0, x: isMultiSpace ? 24 : 0 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isMultiSpace ? -24 : 0 }}
              transition={{ duration: 0.25 }}
            >
              <BeforeAfter before={heroBefore} after={heroAfter} />
            </motion.div>
          </AnimatePresence>
          {isMultiSpace && (
            <>
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous proposal"
                className="absolute left-5 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-card/90 backdrop-blur border border-border shadow-md flex items-center justify-center cursor-pointer hover:bg-card transition"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next proposal"
                className="absolute right-5 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-card/90 backdrop-blur border border-border shadow-md flex items-center justify-center cursor-pointer hover:bg-card transition"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <div className="absolute top-7 left-1/2 -translate-x-1/2 z-10 rounded-full bg-foreground/75 text-background px-2.5 py-1 text-[10px] font-medium tracking-wider uppercase pointer-events-none">
                {labels[activeIdx] ?? `Proposal ${activeIdx + 1}`} ·{" "}
                {activeIdx + 1} / {proposals.length}
              </div>
            </>
          )}
        </div>

        {/* Proposals grid */}
        <div className="px-6 pb-6 md:px-8 md:pb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              {`${t("design.result.proposalCount")} · ${proposals.length}`}
            </span>
            <span className="text-[11px] text-muted-foreground hidden md:inline">
              {isMultiSpace
                ? "Tap a proposal, or swipe / arrow keys"
                : t("design.result.proposalHint")}
            </span>
          </div>
          <div
            className={cn(
              "grid gap-2",
              isMultiSpace
                ? "grid-cols-2 md:grid-cols-4 lg:grid-cols-5"
                : "grid-cols-2 md:grid-cols-5"
            )}
          >
            {proposals.map((src, i) => {
              const active = src === activeProposal;
              const variantLabel = labels[i] ?? `Proposal ${i + 1}`;
              return (
                <motion.button
                  type="button"
                  key={src + i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
                  onClick={() => setActiveProposal(src)}
                  className={cn(
                    "relative rounded-2xl overflow-hidden bg-muted cursor-pointer transition group",
                    isMultiSpace ? "aspect-[4/3]" : "aspect-[4/5]",
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
            {isMultiSpace ? (
              <span className="ml-2 normal-case tracking-normal text-foreground/70">
                · {labels[activeIdx] ?? `Proposal ${activeIdx + 1}`}
              </span>
            ) : null}
          </SectionLabel>
          <MaterialTable items={bom.items ?? undefined} />
        </div>
        <div className="space-y-6">
          <SectionLabel>{t("design.result.cost")}</SectionLabel>
          <CostBenchmarkChart benchmark={bom.benchmark ?? undefined} />
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
