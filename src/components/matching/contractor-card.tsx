"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/lib/i18n/locale-provider";
import { BADGE_LABELS, type Contractor } from "@/lib/mock/contractors";
import { VerificationBadge } from "./verification-badge";

export function ContractorCard({
  contractor,
  index = 0,
}: {
  contractor: Contractor;
  index?: number;
}) {
  const { t } = useLocale();
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.4), ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={`/matching/${contractor.id}`}
        className="group block h-full rounded-3xl overflow-hidden border border-border bg-card transition-all hover:shadow-[0_18px_40px_rgba(3,57,108,0.12)] hover:-translate-y-0.5"
      >
        <div className="relative aspect-[5/4] overflow-hidden">
          <Image
            src={contractor.cover}
            alt={contractor.company}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3">
            <VerificationBadge licensed={contractor.licensed} />
          </div>
          <div className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-card/95 backdrop-blur px-2.5 py-1 text-xs font-medium">
            <Star className="h-3 w-3 fill-primary text-primary" />
            {contractor.rating} · {contractor.reviewCount}
          </div>
        </div>
        <div className="p-5">
          <div className="serif text-lg font-medium leading-tight">
            {contractor.company}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {contractor.name} · {contractor.region}
          </div>
          <p className="mt-3 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {contractor.bio}
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {contractor.badges.slice(0, 2).map((b) => (
              <Badge key={b} variant="muted" className="text-[10px]">
                {BADGE_LABELS[b]}
              </Badge>
            ))}
            {contractor.badges.length > 2 && (
              <Badge variant="muted" className="text-[10px]">
                +{contractor.badges.length - 2}
              </Badge>
            )}
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {t("matching.startingPrice")}
              </div>
              <div className="text-sm font-semibold">
                {`$${Math.round(contractor.startingPrice / 1300).toLocaleString()}`}
              </div>
            </div>
            <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {`${contractor.responseHours}h reply`}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
