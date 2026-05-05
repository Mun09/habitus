"use client";

import Image from "next/image";
import { ShieldCheck, Star } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-provider";
import type { Review } from "@/lib/mock/reviews";

export function ReviewCard({ review }: { review: Review }) {
  const { t } = useLocale();
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10 rounded-full overflow-hidden">
          <Image
            src={review.reviewerImage}
            alt={review.reviewerName}
            fill
            sizes="40px"
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium">{review.reviewerName}</div>
          <div className="text-xs text-muted-foreground">{review.date}</div>
        </div>
        {review.verified && (
          <span className="inline-flex items-center gap-1 text-xs text-[color:var(--success)]">
            <ShieldCheck className="h-3.5 w-3.5" />
            {t("matching.detail.verifiedReviews")}
          </span>
        )}
      </div>
      <div className="flex items-center gap-1 text-primary mt-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < review.rating ? "fill-primary" : "fill-muted text-muted"}`}
          />
        ))}
      </div>
      <h4 className="serif text-base font-medium mt-3">{review.title}</h4>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        {review.body}
      </p>
      {review.photos && review.photos.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {review.photos.map((p, i) => (
            <div
              key={i}
              className="relative aspect-square rounded-xl overflow-hidden bg-muted"
            >
              <Image
                src={p}
                alt=""
                fill
                sizes="160px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
