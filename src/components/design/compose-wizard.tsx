"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ImagePlus,
  Layers,
  Palette,
  Wallpaper,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n/locale-provider";
import { IMAGES } from "@/lib/mock/images";
import {
  CATEGORIES,
  DESIGN_OPTIONS,
  type DesignOption,
  type OptionCategory,
} from "@/lib/mock/design-options";
import { cn } from "@/lib/utils";
import { PlanSummaryRail, type RowKey } from "./plan-summary-rail";
import type { UploadedPhoto } from "./photo-uploader";

const SAMPLE_SPACES: { id: string; url: string; label: { ko: string; en: string } }[] =
  [
    {
      id: "sample-demo",
      url: IMAGES.designDemo.before,
      label: { ko: "데모 거실", en: "Demo living" },
    },
    {
      id: "sample-kitchen",
      url: IMAGES.hero.matching,
      label: { ko: "좁은 주방", en: "Small kitchen" },
    },
    {
      id: "sample-bedroom",
      url: IMAGES.hero.aftercare,
      label: { ko: "침실", en: "Bedroom" },
    },
  ];

type StepKey = "space" | "style" | "materials" | "references";

const STEP_DEFS: {
  key: StepKey;
  rowKey: RowKey;
  label: { ko: string; en: string };
  hint: { ko: string; en: string };
  required: boolean;
}[] = [
  {
    key: "space",
    rowKey: "space",
    label: { ko: "공간", en: "Space" },
    hint: {
      ko: "현재 모습 1장을 올려주세요. 거실, 주방, 침실 어디든.",
      en: "Upload one photo of your current space — living, kitchen, bedroom.",
    },
    required: true,
  },
  {
    key: "style",
    rowKey: "style",
    label: { ko: "스타일", en: "Style" },
    hint: {
      ko: "전체 분위기를 결정합니다. 1개만 골라주세요.",
      en: "Pick the overall mood — exactly one.",
    },
    required: true,
  },
  {
    key: "materials",
    rowKey: "tone",
    label: { ko: "자재 · 톤", en: "Materials" },
    hint: {
      ko: "톤·바닥재·벽 마감을 자유롭게 선택. 비워두면 AI가 추천합니다.",
      en: "Pick tone, flooring, wall finish. Skip and AI will suggest.",
    },
    required: false,
  },
  {
    key: "references",
    rowKey: "references",
    label: { ko: "레퍼런스", en: "References" },
    hint: {
      ko: "원하는 분위기의 사진을 더 올리면 정확도가 올라갑니다 (선택).",
      en: "Add reference photos to improve accuracy (optional).",
    },
    required: false,
  },
];

const ROW_TO_STEP: Record<RowKey, StepKey> = {
  space: "space",
  style: "style",
  tone: "materials",
  flooring: "materials",
  wall: "materials",
  references: "references",
};

export function ComposeWizard({
  spacePhotos,
  setSpacePhotos,
  refUploaded,
  setRefUploaded,
  selectedOptionIds,
  setSelectedOptionIds,
  onGenerate,
}: {
  spacePhotos: UploadedPhoto[];
  setSpacePhotos: (next: UploadedPhoto[]) => void;
  refUploaded: UploadedPhoto[];
  setRefUploaded: (next: UploadedPhoto[]) => void;
  selectedOptionIds: string[];
  setSelectedOptionIds: (next: string[]) => void;
  onGenerate: () => void;
}) {
  const { pick } = useLocale();
  const [stepIdx, setStepIdx] = useState(0);
  const step = STEP_DEFS[stepIdx];

  const styleSelected = selectedOptionIds.some((id) => {
    const o = DESIGN_OPTIONS.find((d) => d.id === id);
    return o?.category === "style";
  });
  const canGenerate = spacePhotos.length > 0 && styleSelected;

  const jumpToRow = (row: RowKey) => {
    const target = ROW_TO_STEP[row];
    const idx = STEP_DEFS.findIndex((s) => s.key === target);
    if (idx >= 0) setStepIdx(idx);
  };

  const goNext = () => setStepIdx(Math.min(stepIdx + 1, STEP_DEFS.length - 1));
  const goPrev = () => setStepIdx(Math.max(stepIdx - 1, 0));

  return (
    <div className="grid lg:grid-cols-[260px_1fr] gap-5">
      <PlanSummaryRail
        spacePhotos={spacePhotos}
        selectedOptionIds={selectedOptionIds}
        refUploaded={refUploaded}
        activeStep={step.rowKey}
        onJump={jumpToRow}
        onGenerate={onGenerate}
        canGenerate={canGenerate}
      />

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {/* Step tabs */}
        <div className="flex border-b border-border bg-muted/30">
          {STEP_DEFS.map((s, i) => {
            const isActive = i === stepIdx;
            const isDone = isStepDone(s.key, {
              spacePhotos,
              selectedOptionIds,
              refUploaded,
            });
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => setStepIdx(i)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 px-2 py-2.5 text-xs font-medium transition cursor-pointer relative",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span
                  className={cn(
                    "h-4 w-4 rounded-full inline-flex items-center justify-center text-[9px] flex-shrink-0",
                    isDone
                      ? "bg-primary text-primary-foreground"
                      : isActive
                      ? "bg-primary/15 text-primary border border-primary/40"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {isDone ? <Check className="h-2.5 w-2.5" /> : i + 1}
                </span>
                <span className="hidden sm:inline truncate">
                  {pick(s.label)}
                </span>
                {isActive && (
                  <motion.span
                    layoutId="step-underline"
                    className="absolute inset-x-3 -bottom-px h-[2px] bg-primary"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Step header */}
        <div className="px-5 md:px-6 pt-5 pb-3 border-b border-border">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {pick({ ko: `단계 ${stepIdx + 1} / ${STEP_DEFS.length}`, en: `Step ${stepIdx + 1} / ${STEP_DEFS.length}` })}
                {step.required && (
                  <span className="ml-2 text-[color:var(--danger)]">
                    {pick({ ko: "필수", en: "Required" })}
                  </span>
                )}
              </div>
              <h3 className="serif text-xl md:text-2xl font-medium leading-tight mt-0.5">
                {pick(step.label)}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-xl">
                {pick(step.hint)}
              </p>
            </div>
          </div>
        </div>

        {/* Step body */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step.key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="px-5 md:px-6 py-5"
          >
            {step.key === "space" && (
              <SpaceStep
                photos={spacePhotos}
                onChange={setSpacePhotos}
              />
            )}
            {step.key === "style" && (
              <StyleStep
                selectedIds={selectedOptionIds}
                onSelectedChange={setSelectedOptionIds}
              />
            )}
            {step.key === "materials" && (
              <MaterialsStep
                selectedIds={selectedOptionIds}
                onSelectedChange={setSelectedOptionIds}
              />
            )}
            {step.key === "references" && (
              <ReferencesStep
                photos={refUploaded}
                onChange={setRefUploaded}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Step footer */}
        <div className="px-5 md:px-6 py-3 border-t border-border bg-muted/20 flex items-center justify-between gap-2">
          <Button variant="ghost" size="sm" onClick={goPrev} disabled={stepIdx === 0}>
            <ArrowLeft className="h-3.5 w-3.5" />
            {pick({ ko: "이전", en: "Back" })}
          </Button>
          {stepIdx < STEP_DEFS.length - 1 ? (
            <Button size="sm" onClick={goNext}>
              {step.required && !isStepDone(step.key, { spacePhotos, selectedOptionIds, refUploaded })
                ? pick({ ko: "선택 필요", en: "Pick required" })
                : pick({ ko: "다음", en: "Next" })}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          ) : (
            <Button size="sm" onClick={onGenerate} disabled={!canGenerate}>
              {pick({ ko: "생성하기", en: "Generate" })}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function isStepDone(
  key: StepKey,
  state: {
    spacePhotos: UploadedPhoto[];
    selectedOptionIds: string[];
    refUploaded: UploadedPhoto[];
  }
) {
  if (key === "space") return state.spacePhotos.length > 0;
  if (key === "style") {
    return state.selectedOptionIds.some((id) => {
      const o = DESIGN_OPTIONS.find((d) => d.id === id);
      return o?.category === "style";
    });
  }
  if (key === "materials") {
    return state.selectedOptionIds.some((id) => {
      const o = DESIGN_OPTIONS.find((d) => d.id === id);
      return o?.category === "tone" || o?.category === "flooring" || o?.category === "wall";
    });
  }
  return state.refUploaded.length > 0;
}

// ─── Space step ──────────────────────────────────────────────
function SpaceStep({
  photos,
  onChange,
}: {
  photos: UploadedPhoto[];
  onChange: (next: UploadedPhoto[]) => void;
}) {
  const { t, pick } = useLocale();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    return () => {
      photos.forEach((p) => {
        if (p.isFile) URL.revokeObjectURL(p.url);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const acceptFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files[0] == null) return;
      const file = files[0];
      if (!file.type.startsWith("image/")) return;
      photos.forEach((p) => {
        if (p.isFile) URL.revokeObjectURL(p.url);
      });
      const url = URL.createObjectURL(file);
      onChange([
        { id: `${file.name}-${Date.now()}`, url, isFile: true },
      ]);
    },
    [photos, onChange]
  );

  const removeAll = () => {
    photos.forEach((p) => {
      if (p.isFile) URL.revokeObjectURL(p.url);
    });
    onChange([]);
  };

  const current = photos[0];

  return (
    <div className="space-y-4">
      {current ? (
        <div className="flex items-start gap-4">
          <div className="relative aspect-[4/3] w-48 rounded-xl overflow-hidden bg-muted flex-shrink-0">
            {current.isFile ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={current.url}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <Image
                src={current.url}
                alt=""
                fill
                sizes="200px"
                className="object-cover"
              />
            )}
          </div>
          <div className="space-y-2 text-sm">
            <div className="font-medium">
              {pick({ ko: "선택된 공간", en: "Selected space" })}
            </div>
            <p className="text-xs text-muted-foreground">
              {pick({
                ko: "다른 사진으로 바꾸려면 아래 샘플을 누르거나 새로 업로드하세요.",
                en: "Pick a sample below or upload a new photo to replace it.",
              })}
            </p>
            <Button variant="ghost" size="sm" onClick={removeAll}>
              <X className="h-3 w-3" /> {pick({ ko: "비우기", en: "Clear" })}
            </Button>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            acceptFiles(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "rounded-2xl border-2 border-dashed bg-muted/30 px-6 py-7 text-center cursor-pointer transition flex items-center gap-4",
            dragActive
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-muted/60"
          )}
        >
          <div className="h-10 w-10 rounded-xl bg-card border border-border flex items-center justify-center flex-shrink-0">
            <ImagePlus className="h-4 w-4 text-primary" />
          </div>
          <div className="text-left">
            <div className="text-sm font-medium">
              {t("design.upload.dropzone")}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {t("design.upload.formats")}
            </div>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => acceptFiles(e.target.files)}
          />
        </div>
      )}

      <div className="rounded-xl bg-muted/40 border border-border px-3 py-3">
        <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground mb-2">
          {t("design.upload.demoNote")}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {SAMPLE_SPACES.map((s) => {
            const used = photos.some((p) => p.id === s.id);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  if (used) {
                    onChange([]);
                  } else {
                    photos.forEach((p) => {
                      if (p.isFile) URL.revokeObjectURL(p.url);
                    });
                    onChange([{ id: s.id, url: s.url, isFile: false }]);
                  }
                }}
                className={cn(
                  "relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer transition group",
                  used
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-card"
                    : "hover:opacity-90"
                )}
              >
                <Image
                  src={s.url}
                  alt={pick(s.label)}
                  fill
                  sizes="160px"
                  className="object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/85 to-transparent px-1.5 py-1">
                  <span className="text-[10px] text-background font-medium leading-none">
                    {pick(s.label)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Style step (single-select) ──────────────────────────────
function StyleStep({
  selectedIds,
  onSelectedChange,
}: {
  selectedIds: string[];
  onSelectedChange: (next: string[]) => void;
}) {
  const { pick } = useLocale();
  const styleOptions = DESIGN_OPTIONS.filter((o) => o.category === "style");
  const currentStyle = styleOptions.find((s) => selectedIds.includes(s.id));

  const pickStyle = (id: string) => {
    const otherStyleIds = styleOptions
      .filter((o) => o.id !== id)
      .map((o) => o.id);
    const next = selectedIds.filter((x) => !otherStyleIds.includes(x));
    if (!next.includes(id)) next.push(id);
    onSelectedChange(next);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {styleOptions.map((o) => {
        const isSel = currentStyle?.id === o.id;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => pickStyle(o.id)}
            className={cn(
              "group rounded-xl border bg-card overflow-hidden text-left cursor-pointer transition relative",
              isSel
                ? "border-primary shadow-[0_0_0_2px_rgba(201,123,90,0.18)]"
                : "border-border hover:border-primary/40"
            )}
          >
            <div className="relative aspect-[4/3] bg-muted">
              {o.image && (
                <Image
                  src={o.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 22vw, 50vw"
                  className="object-cover"
                />
              )}
              <span
                className={cn(
                  "absolute top-2 right-2 h-5 w-5 rounded-full flex items-center justify-center transition border-2",
                  isSel
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card/90 text-transparent border-border group-hover:border-primary/40"
                )}
              >
                {isSel && <Check className="h-3 w-3" />}
              </span>
            </div>
            <div className="px-3 py-2">
              <div className="text-[13px] font-medium leading-tight">
                {pick(o.name)}
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                {pick(o.description)}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─── Materials step (tone + flooring + wall) ─────────────────
function MaterialsStep({
  selectedIds,
  onSelectedChange,
}: {
  selectedIds: string[];
  onSelectedChange: (next: string[]) => void;
}) {
  const { pick } = useLocale();

  const toggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectedChange(selectedIds.filter((x) => x !== id));
    } else {
      onSelectedChange([...selectedIds, id]);
    }
  };

  const sections: {
    key: OptionCategory;
    icon: typeof Palette;
    items: DesignOption[];
  }[] = [
    {
      key: "tone",
      icon: Palette,
      items: DESIGN_OPTIONS.filter((o) => o.category === "tone"),
    },
    {
      key: "flooring",
      icon: Layers,
      items: DESIGN_OPTIONS.filter((o) => o.category === "flooring"),
    },
    {
      key: "wall",
      icon: Wallpaper,
      items: DESIGN_OPTIONS.filter((o) => o.category === "wall"),
    },
  ];

  return (
    <div className="space-y-5">
      {sections.map((sec) => {
        const Icon = sec.icon;
        const label = pick(
          CATEGORIES.find((c) => c.key === sec.key)!.label
        );
        const selectedCount = sec.items.filter((i) =>
          selectedIds.includes(i.id)
        ).length;
        return (
          <section key={sec.key}>
            <div className="flex items-center justify-between mb-2.5">
              <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                <Icon className="h-3.5 w-3.5" />
                {label}
              </div>
              {selectedCount > 0 && (
                <span className="text-[10px] text-primary font-medium">
                  {selectedCount} {pick({ ko: "선택", en: "picked" })}
                </span>
              )}
            </div>
            {sec.key === "tone" ? (
              <div className="flex flex-wrap gap-2">
                {sec.items.map((o) => {
                  const isSel = selectedIds.includes(o.id);
                  return (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => toggle(o.id)}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full pl-1.5 pr-3 py-1.5 border text-xs cursor-pointer transition",
                        isSel
                          ? "border-primary bg-primary/8 text-foreground"
                          : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/40"
                      )}
                    >
                      <span
                        className="h-5 w-5 rounded-full border border-border"
                        style={{ background: o.swatch }}
                      />
                      <span className="font-medium">{pick(o.name)}</span>
                      {isSel && <Check className="h-3 w-3 text-primary" />}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                {sec.items.map((o) => {
                  const isSel = selectedIds.includes(o.id);
                  return (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => toggle(o.id)}
                      className={cn(
                        "group rounded-lg border bg-card overflow-hidden text-left cursor-pointer transition flex items-center gap-2.5 p-1.5",
                        isSel
                          ? "border-primary shadow-[0_0_0_2px_rgba(201,123,90,0.15)]"
                          : "border-border hover:border-primary/40"
                      )}
                    >
                      <div className="relative h-12 w-16 rounded bg-muted overflow-hidden flex-shrink-0">
                        {o.image && (
                          <Image
                            src={o.image}
                            alt=""
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[12px] font-medium leading-tight truncate">
                          {pick(o.name)}
                        </div>
                        <div className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                          {pick(o.description)}
                        </div>
                      </div>
                      {isSel && (
                        <Check className="h-3.5 w-3.5 text-primary flex-shrink-0 mr-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

// ─── References step (multi photo upload) ────────────────────
function ReferencesStep({
  photos,
  onChange,
}: {
  photos: UploadedPhoto[];
  onChange: (next: UploadedPhoto[]) => void;
}) {
  const { t, pick } = useLocale();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const maxCount = 4;

  useEffect(() => {
    return () => {
      photos.forEach((p) => {
        if (p.isFile) URL.revokeObjectURL(p.url);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const acceptFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const next = [...photos];
      Array.from(files).forEach((file) => {
        if (next.length >= maxCount) return;
        if (!file.type.startsWith("image/")) return;
        const url = URL.createObjectURL(file);
        next.push({
          id: `${file.name}-${Date.now()}-${Math.random()}`,
          url,
          isFile: true,
        });
      });
      onChange(next);
    },
    [photos, onChange]
  );

  const removeAt = (id: string) => {
    const removed = photos.find((p) => p.id === id);
    if (removed?.isFile) URL.revokeObjectURL(removed.url);
    onChange(photos.filter((p) => p.id !== id));
  };

  const isFull = photos.length >= maxCount;

  return (
    <div className="space-y-3">
      <div
        onDragEnter={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          acceptFiles(e.dataTransfer.files);
        }}
        onClick={() => !isFull && inputRef.current?.click()}
        className={cn(
          "rounded-xl border-2 border-dashed px-4 py-4 text-center transition cursor-pointer flex items-center gap-3",
          dragActive
            ? "border-primary bg-primary/5"
            : isFull
            ? "border-border opacity-60 cursor-not-allowed"
            : "border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/60"
        )}
      >
        <div className="h-9 w-9 rounded-lg bg-card border border-border flex items-center justify-center flex-shrink-0">
          <ImagePlus className="h-4 w-4 text-primary" />
        </div>
        <div className="text-left flex-1 min-w-0">
          <div className="text-sm font-medium">
            {t("design.upload.dropzone")}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {t("design.upload.formats")} · {photos.length}/{maxCount}
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => acceptFiles(e.target.files)}
        />
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {photos.map((p) => (
            <div
              key={p.id}
              className="relative aspect-square rounded-lg overflow-hidden bg-muted group"
            >
              {p.isFile ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <Image
                  src={p.url}
                  alt=""
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeAt(p.id);
                }}
                className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-foreground/70 text-background backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                aria-label={t("design.upload.remove")}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-[11px] text-muted-foreground">
        {pick({
          ko: "비워두고 진행해도 괜찮아요. 추가할수록 AI가 더 정확하게 반영합니다.",
          en: "It's OK to leave this empty — more refs improve accuracy.",
        })}
      </p>
    </div>
  );
}
