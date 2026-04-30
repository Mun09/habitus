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
  detectStyleFromOptions,
  getOptionImagesForGenerating,
} from "@/lib/mock/design-options";

export default function DesignPage() {
  const { t } = useLocale();
  const [stage, setStage] = useState<DesignStage>("compose");
  const [spacePhotos, setSpacePhotos] = useState<UploadedPhoto[]>([]);
  const [refUploaded, setRefUploaded] = useState<UploadedPhoto[]>([]);
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [styleKey, setStyleKey] = useState<
    "midcentury" | "minimalist" | "industrial" | "scandinavian"
  >("midcentury");

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
    <div className="mx-auto max-w-6xl px-5 md:px-8 py-6 md:py-8">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="serif text-2xl md:text-3xl font-medium leading-tight">
            {t("design.title")}
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1 max-w-2xl">
            {t("design.subtitle")}
          </p>
        </div>
        <StageIndicator current={stage} labels={stageLabels} />
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
