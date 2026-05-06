"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/lib/i18n/locale-provider";

const isFileUrl = (src: string) =>
  src.startsWith("blob:") || src.startsWith("data:");

export function BeforeAfter({
  before,
  after,
}: {
  before: string;
  after: string;
}) {
  const { t } = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const [pos, setPos] = useState(50);

  // reset position when proposal changes
  useEffect(() => {
    setPos(50);
  }, [after]);

  const updateFromClientX = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, x)));
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragging.current = true;
    ref.current?.setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    e.preventDefault();
    updateFromClientX(e.clientX);
  };

  const stopDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    if (ref.current?.hasPointerCapture(e.pointerId)) {
      ref.current.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopDrag}
      onPointerCancel={stopDrag}
      onDragStart={(e) => e.preventDefault()}
      className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden bg-muted select-none touch-none cursor-ew-resize"
      style={{ WebkitUserSelect: "none" }}
    >
      {/* After (full bleed). pointer-events: none so wrapper handles drag */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src={after}
          alt=""
          fill
          sizes="100vw"
          className="object-cover select-none"
          draggable={false}
          priority
        />
      </div>
      <span className="absolute top-3 right-3 z-30 rounded-full bg-card/95 backdrop-blur px-3 py-1 text-xs font-medium pointer-events-none">
        {t("design.result.after")}
      </span>

      {/* Before clipped */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        {isFileUrl(before) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={before}
            alt=""
            className="w-full h-full object-cover select-none"
            draggable={false}
          />
        ) : (
          <Image
            src={before}
            alt=""
            fill
            sizes="100vw"
            className="object-cover select-none"
            draggable={false}
          />
        )}
        <span className="absolute top-3 left-3 z-20 rounded-full bg-card/95 backdrop-blur px-3 py-1 text-xs font-medium">
          {t("design.result.before")}
        </span>
      </div>

      {/* Slider line + handle */}
      <div
        className="absolute inset-y-0 z-30 w-px bg-card/80 pointer-events-none"
        style={{ left: `${pos}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-12 w-12 rounded-full bg-card border-2 border-primary shadow-[0_4px_14px_rgba(15,30,44,0.25)] flex items-center justify-center">
          <span className="text-sm tracking-widest text-primary font-medium">
            ‹›
          </span>
        </div>
      </div>

      {/* hint */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 rounded-full bg-card/85 backdrop-blur px-3 py-1 text-[10px] text-muted-foreground pointer-events-none">
        {t("design.result.compareHint")}
      </div>
    </div>
  );
}
