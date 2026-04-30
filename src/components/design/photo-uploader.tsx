"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-provider";
import { cn } from "@/lib/utils";

export type UploadedPhoto = {
  id: string;
  url: string;
  isFile: boolean;
};

export function PhotoUploader({
  photos,
  onChange,
  maxCount = 4,
  className,
  label,
}: {
  photos: UploadedPhoto[];
  onChange: (next: UploadedPhoto[]) => void;
  maxCount?: number;
  className?: string;
  label?: string;
}) {
  const { t } = useLocale();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  // revoke object URLs on unmount
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
        next.push({ id: `${file.name}-${Date.now()}-${Math.random()}`, url, isFile: true });
      });
      onChange(next);
    },
    [photos, onChange, maxCount]
  );

  const removeAt = (id: string) => {
    const removed = photos.find((p) => p.id === id);
    if (removed?.isFile) URL.revokeObjectURL(removed.url);
    onChange(photos.filter((p) => p.id !== id));
  };

  const isFull = photos.length >= maxCount;

  return (
    <div className={cn("space-y-3", className)}>
      {label && (
        <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </div>
      )}
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
          "rounded-3xl border-2 border-dashed bg-muted/30 p-8 text-center transition cursor-pointer",
          dragActive
            ? "border-primary bg-primary/5"
            : isFull
            ? "border-border opacity-60 cursor-not-allowed"
            : "border-border hover:border-primary hover:bg-muted/60"
        )}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-card border border-border flex items-center justify-center">
            <ImagePlus className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="text-sm font-medium">{t("design.upload.dropzone")}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {t("design.upload.formats")} · {photos.length}/{maxCount}
            </div>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {photos.map((p, i) => (
            <div
              key={p.id}
              className="relative aspect-square rounded-2xl overflow-hidden bg-muted group"
            >
              {p.isFile ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image src={p.url} alt="" fill sizes="200px" className="object-cover" />
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeAt(p.id);
                }}
                className="absolute top-2 right-2 h-7 w-7 rounded-full bg-foreground/70 text-background backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                aria-label={t("design.upload.remove")}
              >
                <X className="h-3.5 w-3.5" />
              </button>
              {i === 0 && (
                <div className="absolute bottom-2 left-2 text-[10px] uppercase tracking-wider rounded-full bg-card/90 px-2 py-0.5">
                  Main
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
