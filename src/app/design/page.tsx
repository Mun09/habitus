"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
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
  type StyleKey,
} from "@/lib/mock/design-options";
import { IMAGES } from "@/lib/mock/images";
import { useUser } from "@/lib/supabase/user-provider";
import { createClient } from "@/lib/supabase/client";
import { uploadSpacePhoto, isBlobUrl } from "@/lib/supabase/storage";

export default function DesignPage() {
  const { t } = useLocale();
  const { user } = useUser();
  const [stage, setStage] = useState<DesignStage>("compose");
  const [spacePhotos, setSpacePhotos] = useState<UploadedPhoto[]>([]);
  const [refUploaded, setRefUploaded] = useState<UploadedPhoto[]>([]);
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([
    STYLE_RANDOM_ID,
  ]);
  const [styleKey, setStyleKey] = useState<StyleKey>("random");
  const [generatedUrls, setGeneratedUrls] = useState<string[]>([]);
  const [persistedSpaceUrl, setPersistedSpaceUrl] = useState<string | null>(null);
  const [planDbId, setPlanDbId] = useState<string | null>(null);

  const stageLabels: Record<DesignStage, string> = {
    compose: t("design.stage.compose"),
    generating: t("design.stage.generating"),
    result: t("design.stage.result"),
  };

  const optionImages = getOptionImagesForGenerating(selectedOptionIds);
  const userReferenceUrls = refUploaded.map((p) => p.url);
  const generatingInputs = [...userReferenceUrls, ...optionImages];

  const startGenerate = async () => {
    if (!user) {
      toast.error("Sign in first.");
      return;
    }
    const firstPhoto = spacePhotos[0];
    if (!firstPhoto) {
      toast.error("Add a space photo before generating.");
      return;
    }

    const detected = detectStyleFromOptions(selectedOptionIds);
    setStyleKey(detected);
    setGeneratedUrls([]);
    setStage("generating");

    try {
      // 1. Upload (or pass through) the first space photo to Supabase Storage.
      const spaceUrl = isBlobUrl(firstPhoto.url)
        ? await uploadSpacePhoto(firstPhoto.url, user.id)
        : firstPhoto.url;
      setPersistedSpaceUrl(spaceUrl);

      // 2. Create a design_plans row so the API call has a target to update.
      const supabase = createClient();
      const { data: plan, error: insertError } = await supabase
        .from("design_plans")
        .insert({
          user_id: user.id,
          style_key: detected,
          style_label: detected,
          selected_option_ids: selectedOptionIds,
          space_image_url: spaceUrl,
          user_reference_urls: userReferenceUrls.filter((u) => !isBlobUrl(u)),
          status: "generating",
        })
        .select()
        .single();
      if (insertError || !plan) {
        throw new Error(insertError?.message ?? "Failed to create plan");
      }
      setPlanDbId(plan.id);

      // 3. Hit the API route which calls OpenAI gpt-image-1 and stores output.
      const res = await fetch("/api/design/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: plan.id,
          spaceImageUrl: spaceUrl,
          selectedOptionIds,
          styleKey: detected,
        }),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(errBody.error ?? "Generation failed");
      }
      const { urls } = (await res.json()) as { urls: string[] };
      setGeneratedUrls(urls);
      setStage("result");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Generation failed";
      toast.error(msg);
      setStage("compose");
    }
  };

  const reset = () => {
    setStage("compose");
    setGeneratedUrls([]);
    setPersistedSpaceUrl(null);
    setPlanDbId(null);
  };

  const jumpToStage = (next: DesignStage) => {
    if (next === "result") {
      setStyleKey(detectStyleFromOptions(selectedOptionIds));
    }
    setStage(next);
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
          <StageIndicator
            current={stage}
            labels={stageLabels}
            onSelect={jumpToStage}
          />
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
              spaceImage={spacePhotos[0]?.url ?? IMAGES.scenarios.w2.studioEntry}
              referenceImages={generatingInputs}
              onDone={() => {
                // No-op: the design page itself transitions to "result"
                // once the API call resolves. GeneratingState only handles
                // the visual loading sequence.
              }}
            />
          </motion.section>
        )}

        {stage === "result" && (
          <motion.section
            key="result"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <ResultView
              spaceImage={
                persistedSpaceUrl ??
                spacePhotos[0]?.url ??
                IMAGES.scenarios.w2.studioEntry
              }
              spaceImages={
                spacePhotos.length > 0
                  ? spacePhotos.map((p) => p.url)
                  : [IMAGES.scenarios.w2.studioEntry]
              }
              styleKey={styleKey}
              userReferences={userReferenceUrls}
              optionImages={optionImages}
              selectedOptionIds={selectedOptionIds}
              generatedUrls={generatedUrls}
              planDbId={planDbId}
              onRegenerate={reset}
            />
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
