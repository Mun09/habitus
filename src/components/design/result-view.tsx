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
import { cn } from "@/lib/utils";
import { BeforeAfter } from "./before-after";
import { MaterialTable } from "./material-table";
import { CostBenchmarkChart } from "./cost-benchmark-chart";
import { ContractChecklist } from "./contract-checklist";

const STYLE_LABELS: Record<string, { ko: string; en: string; summary: { ko: string; en: string } }> = {
  midcentury: {
    ko: "미드센추리 모던",
    en: "Mid-century Modern",
    summary: {
      ko: "따뜻한 우드톤, 곡선 가구, 자연광. 거실에 톤 다운된 테라코타와 오크 마루를 적용했어요.",
      en: "Warm woods, curved furniture, natural light. Living room in muted terracotta with oak flooring.",
    },
  },
  minimalist: {
    ko: "미니멀 화이트",
    en: "Minimalist White",
    summary: {
      ko: "정돈된 라인과 깨끗한 화이트톤. 친환경 자재로 알러지 친화적인 공간을 제안했어요.",
      en: "Clean lines, white tones, allergy-friendly eco materials.",
    },
  },
  industrial: {
    ko: "인더스트리얼",
    en: "Industrial",
    summary: {
      ko: "노출 콘크리트와 메탈 디테일을 살린 빈티지 무드. 카페 같은 거실을 만들어요.",
      en: "Exposed concrete and metal details — a cafe-like living space.",
    },
  },
  scandinavian: {
    ko: "스칸디나비안",
    en: "Scandinavian",
    summary: {
      ko: "밝은 톤과 자연 소재로 가족 친화적인 따뜻함을 표현했어요.",
      en: "Bright tones and natural materials — warm, family-friendly.",
    },
  },
};

type StyleKey = "midcentury" | "minimalist" | "industrial" | "scandinavian";

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
  const { t, pick } = useLocale();
  const router = useRouter();
  const { savePlan } = useDesignPlan();
  const style = STYLE_LABELS[styleKey];

  // AI proposals — user demo image first, then moodboard + completed gallery
  const proposals = Array.from(
    new Set([
      IMAGES.designDemo.after,
      ...IMAGES.moodboard[styleKey].slice(0, 4),
      ...IMAGES.projectCompleted.slice(0, 2),
    ])
  ).slice(0, 5);

  const [activeProposal, setActiveProposal] = useState(proposals[0]);
  const heroAfter = activeProposal;

  const proceedToMatching = () => {
    const options = selectedOptionIds
      .map((id) => DESIGN_OPTIONS.find((o) => o.id === id))
      .filter((o): o is NonNullable<typeof o> => !!o);
    // strip blob: refs that won't survive a reload
    const cleanUserRefs = userReferences.filter((r) => !r.startsWith("blob:"));
    const cleanSpace = spaceImage.startsWith("blob:") ? undefined : spaceImage;
    savePlan({
      styleKey,
      styleLabel: style,
      options,
      spaceImage: cleanSpace,
      heroProposal: activeProposal,
      proposals,
      userReferences: cleanUserRefs,
      aftercareUpgrade: false,
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
              {pick(style)}
            </h2>
            <p className="mt-3 text-sm text-foreground/80 leading-relaxed max-w-xl">
              {pick(style.summary)}
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
          <BeforeAfter before={spaceImage} after={heroAfter} />
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
                    alt=""
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
          <SectionLabel>{t("design.result.materials")}</SectionLabel>
          <MaterialTable />
        </div>
        <div className="space-y-6">
          <SectionLabel>{t("design.result.cost")}</SectionLabel>
          <CostBenchmarkChart />
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
            {pick({
              ko: "이 디자인에 맞는 시공자를 찾아드릴게요.",
              en: "Let's match a contractor who fits this design.",
            })}
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
