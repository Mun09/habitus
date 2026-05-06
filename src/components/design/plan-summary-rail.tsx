"use client";

import Image from "next/image";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n/locale-provider";
import {
  CATEGORIES,
  DESIGN_OPTIONS,
  type OptionCategory,
} from "@/lib/mock/design-options";
import { cn } from "@/lib/utils";
import type { UploadedPhoto } from "./photo-uploader";

type RowKey = OptionCategory | "space" | "references";

export function PlanSummaryRail({
  spacePhotos,
  selectedOptionIds,
  refUploaded,
  activeStep,
  onJump,
  onGenerate,
  canGenerate,
}: {
  spacePhotos: UploadedPhoto[];
  selectedOptionIds: string[];
  refUploaded: UploadedPhoto[];
  activeStep: RowKey;
  onJump: (key: RowKey) => void;
  onGenerate: () => void;
  canGenerate: boolean;
}) {
  const { t } = useLocale();

  const findOpts = (cat: OptionCategory) =>
    selectedOptionIds
      .map((id) => DESIGN_OPTIONS.find((o) => o.id === id))
      .filter((o): o is NonNullable<typeof o> => !!o && o.category === cat);

  const styleOpts = findOpts("style");
  const toneOpts = findOpts("tone");
  const floorOpts = findOpts("flooring");
  const wallOpts = findOpts("wall");
  const furnitureOpts = findOpts("furniture");

  const catLabel = (key: OptionCategory) =>
    CATEGORIES.find((c) => c.key === key)!.label;

  const rowDef: {
    key: RowKey;
    label: string;
    required: boolean;
    done: boolean;
  }[] = [
    {
      key: "space",
      label: "Space",
      required: true,
      done: spacePhotos.length > 0,
    },
    {
      key: "style",
      label: catLabel("style"),
      required: true,
      done: styleOpts.length > 0,
    },
    {
      key: "tone",
      label: catLabel("tone"),
      required: false,
      done: toneOpts.length > 0,
    },
    {
      key: "flooring",
      label: catLabel("flooring"),
      required: false,
      done: floorOpts.length > 0,
    },
    {
      key: "wall",
      label: catLabel("wall"),
      required: false,
      done: wallOpts.length > 0,
    },
    {
      key: "furniture",
      label: catLabel("furniture"),
      required: false,
      done: furnitureOpts.length > 0,
    },
  ];

  return (
    <aside className="lg:sticky lg:top-4 self-start space-y-3">
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-muted/30">
          <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Your design summary
          </div>
        </div>
        <ul className="divide-y divide-border">
          {rowDef.map((row) => {
            const isActive = activeStep === row.key;
            return (
              <li key={row.key}>
                <button
                  type="button"
                  onClick={() => onJump(row.key)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 text-left transition cursor-pointer",
                    isActive
                      ? "bg-primary/5"
                      : "hover:bg-muted/40"
                  )}
                >
                  <span
                    className={cn(
                      "h-5 w-5 rounded-full inline-flex items-center justify-center text-[10px] flex-shrink-0",
                      row.done
                        ? "bg-primary text-primary-foreground"
                        : isActive
                        ? "bg-primary/15 text-primary border border-primary/40"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {row.done ? (
                      <Check className="h-2.5 w-2.5" />
                    ) : row.required ? (
                      "!"
                    ) : (
                      ""
                    )}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[11px] uppercase tracking-wider text-muted-foreground">
                      {row.label}
                      {row.required && (
                        <span className="text-[color:var(--danger)] ml-1">*</span>
                      )}
                    </span>
                    <span className="block text-xs font-medium text-foreground truncate mt-0.5">
                      {row.key === "space" ? (
                        spacePhotos.length > 0 ? (
                          spacePhotos.length === 1
                            ? "1 space selected"
                            : `${spacePhotos.length} spaces selected`
                        ) : (
                          <span className="text-muted-foreground/70 font-normal">
                            Not selected
                          </span>
                        )
                      ) : row.key === "references" ? (
                        refUploaded.length > 0 ? (
                          `${refUploaded.length} photos`
                        ) : (
                          <span className="text-muted-foreground/70 font-normal">
                            None
                          </span>
                        )
                      ) : row.key === "style" ? (
                        styleOpts[0] ? (
                          styleOpts[0].name
                        ) : (
                          <span className="text-muted-foreground/70 font-normal">
                            Not selected
                          </span>
                        )
                      ) : row.key === "tone" ? (
                        toneOpts.length > 0 ? (
                          <span className="inline-flex items-center gap-1.5">
                            <span className="inline-flex gap-0.5">
                              {toneOpts.slice(0, 4).map((o) => (
                                <span
                                  key={o.id}
                                  className="h-3 w-3 rounded-full border border-border"
                                  style={{ background: o.swatch }}
                                />
                              ))}
                            </span>
                            {toneOpts.length}
                          </span>
                        ) : (
                          <span className="text-muted-foreground/70 font-normal">
                            None
                          </span>
                        )
                      ) : row.key === "flooring" ? (
                        floorOpts.length > 0 ? (
                          floorOpts.length === 1 ? (
                            floorOpts[0].name
                          ) : (
                            `${floorOpts.length} picks`
                          )
                        ) : (
                          <span className="text-muted-foreground/70 font-normal">
                            None
                          </span>
                        )
                      ) : row.key === "wall" ? (
                        wallOpts.length > 0 ? (
                          wallOpts.length === 1 ? (
                            wallOpts[0].name
                          ) : (
                            `${wallOpts.length} picks`
                          )
                        ) : (
                          <span className="text-muted-foreground/70 font-normal">
                            None
                          </span>
                        )
                      ) : furnitureOpts.length > 0 ? (
                        furnitureOpts.length === 1 ? (
                          furnitureOpts[0].name
                        ) : (
                          `${furnitureOpts.length} picks`
                        )
                      ) : (
                        <span className="text-muted-foreground/70 font-normal">
                          None
                        </span>
                      )}
                    </span>
                  </span>
                  {spacePhotos.length > 0 && row.key === "space" && (
                    <span className="relative h-9 w-9 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      {spacePhotos[0].isFile ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={spacePhotos[0].url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Image
                          src={spacePhotos[0].url}
                          alt=""
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      )}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <Button
        size="lg"
        className="w-full"
        disabled={!canGenerate}
        onClick={onGenerate}
      >
        <Sparkles className="h-4 w-4" />
        {t("design.reference.next")}
        <ArrowRight className="h-4 w-4" />
      </Button>
      {!canGenerate && (
        <p className="text-[11px] text-muted-foreground px-1">
          Pick a space photo and a style to generate.
        </p>
      )}
    </aside>
  );
}

export type { RowKey };
