"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function MoodBoard({
  images,
  styleLabel,
}: {
  images: string[];
  styleLabel: string;
}) {
  return (
    <div className="rounded-3xl border border-border bg-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="serif text-base font-medium">{styleLabel}</div>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
          mood board
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1 p-1">
        {images.slice(0, 6).map((src, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className={`relative ${
              i === 0
                ? "col-span-2 row-span-2 aspect-square"
                : "aspect-square"
            } overflow-hidden`}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="(min-width: 768px) 25vw, 50vw"
              className="object-cover"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
