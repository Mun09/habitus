"use client";

import Image from "next/image";
import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function PortfolioGallery({ images }: { images: string[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setOpenIdx(i)}
            className={cn(
              "relative overflow-hidden rounded-2xl bg-muted cursor-pointer",
              i === 0 ? "aspect-[4/3] md:col-span-2 md:row-span-2" : "aspect-[4/3]"
            )}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="(min-width: 768px) 30vw, 50vw"
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          </button>
        ))}
      </div>
      {openIdx !== null && (
        <div
          className="fixed inset-0 z-50 bg-foreground/85 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setOpenIdx(null)}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpenIdx(null);
            }}
            className="absolute top-5 right-5 p-2 rounded-full bg-card/90 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpenIdx((openIdx + images.length - 1) % images.length);
            }}
            className="absolute left-4 md:left-10 p-3 rounded-full bg-card/90 cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div
            className="relative w-full max-w-4xl aspect-[4/3]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image src={images[openIdx]} alt="" fill className="object-contain" sizes="80vw" />
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpenIdx((openIdx + 1) % images.length);
            }}
            className="absolute right-4 md:right-10 p-3 rounded-full bg-card/90 cursor-pointer"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </>
  );
}
