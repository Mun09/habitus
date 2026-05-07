"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StageIndicator, type DesignStage } from "@/components/design/stage-indicator";
import { ComposeWizard } from "@/components/design/compose-wizard";
import { type UploadedPhoto } from "@/components/design/photo-uploader";
import { GeneratingState } from "@/components/design/generating-state";
import { ResultView } from "@/components/design/result-view";
import { useLocale } from "@/lib/i18n/locale-provider";
import {
  STYLE_RANDOM_ID,
  detectStyleFromOptions,
  getOptionImagesForGenerating,
} from "@/lib/mock/design-options";

export default function DesignPage() {
  const { t } = useLocale();
  const [stage, setStage] = useState<DesignStage>("compose");
  const [spacePhotos, setSpacePhotos] = useState<UploadedPhoto[]>([]);
  const [refUploaded, setRefUploaded] = useState<UploadedPhoto[]>([]);
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([
    STYLE_RANDOM_ID,
  ]);
  const [styleKey, setStyleKey] = useState<
    "midcentury" | "minimalist" | "industrial" | "scandinavian" | "random"
  >("random");

  const stageLabels: Record<DesignStage, string> = {
    compose: t("design.stage.compose"),
    generating: t("design.stage.generating"),
    result: t("design.stage.result"),
  };

  const optionImages = getOptionImagesForGenerating(selectedOptionIds);
  const userReferenceUrls = refUploaded.map((p) => p.url);
  const generatingInputs = [...userReferenceUrls, ...optionImages];

  const startGenerate = () => {
    setStyleKey(detectStyleFromOptions(selectedOptionIds));
    setStage("generating");
  };

  const reset = () => {
    setStage("compose");
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-6 md:px-8 md:py-8">
      <div className="mb-5 border-b border-border pb-5 md:flex md:items-end md:justify-between">
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Design Studio
          </div>
          <h1 className="serif text-3xl font-medium leading-tight text-secondary md:text-5xl">
            {t("design.title")}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
            {t("design.subtitle")}
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <StageIndicator current={stage} labels={stageLabels} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {stage === "compose" && (
          <motion.section
            key="compose"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <ComposeWizard
              spacePhotos={spacePhotos}
              setSpacePhotos={setSpacePhotos}
              refUploaded={refUploaded}
              setRefUploaded={setRefUploaded}
              selectedOptionIds={selectedOptionIds}
              setSelectedOptionIds={setSelectedOptionIds}
              onGenerate={startGenerate}
            />
          </motion.section>
        )}

        {stage === "generating" && (
          <motion.section
            key="generating"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <GeneratingState
              spaceImage={spacePhotos[0]?.url}
              referenceImages={generatingInputs}
              onDone={() => setStage("result")}
            />
          </motion.section>
        )}

        {stage === "result" && spacePhotos[0] && (
          <motion.section
            key="result"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <ResultView
              spaceImage={spacePhotos[0].url}
              spaceImages={spacePhotos.map((p) => p.url)}
              styleKey={styleKey}
              userReferences={userReferenceUrls}
              optionImages={optionImages}
              selectedOptionIds={selectedOptionIds}
              onRegenerate={reset}
            />
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
