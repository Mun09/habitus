"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, Clock, Hammer, Star } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { VerificationBadge } from "@/components/matching/verification-badge";
import { PortfolioGallery } from "@/components/matching/portfolio-gallery";
import { ReviewCard } from "@/components/matching/review-card";
import { QuoteComparison } from "@/components/matching/quote-comparison";
import { RequestDialog } from "@/components/matching/request-dialog";
import { BADGE_LABELS, type Contractor } from "@/lib/mock/contractors";
import type { Review } from "@/lib/mock/reviews";
import { useLocale } from "@/lib/i18n/locale-provider";

export function ContractorDetailClient({
  contractor,
  reviews,
}: {
  contractor: Contractor;
  reviews: Review[];
}) {
  const { t } = useLocale();

  const ratingDist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating) === star).length,
  }));

  return (
    <div className="pb-32">
      {/* Hero */}
      <div className="relative h-[44vh] md:h-[56vh] overflow-hidden">
        <Image
          src={contractor.cover}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute top-5 left-5">
          <Link
            href="/matching"
            className="inline-flex items-center gap-1.5 rounded-full bg-card/85 backdrop-blur px-3 py-1.5 text-xs font-medium hover:bg-card"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t("nav.matching")}
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 md:px-8 -mt-32 md:-mt-44 relative">
        <div className="rounded-3xl border border-border bg-card p-6 md:p-10">
          <div className="flex flex-col md:flex-row gap-6 md:items-end">
            <div className="relative h-24 w-24 md:h-32 md:w-32 rounded-3xl overflow-hidden border-4 border-card shadow flex-shrink-0">
              <Image
                src={contractor.profileImage}
                alt={contractor.name}
                fill
                sizes="128px"
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <VerificationBadge licensed={contractor.licensed} />
                {contractor.badges.map((b) => (
                  <Badge key={b} variant="muted" className="text-xs">
                    <BadgeCheck className="h-3 w-3" />
                    {BADGE_LABELS[b]}
                  </Badge>
                ))}
              </div>
              <h1 className="serif text-3xl md:text-4xl font-medium">
                {contractor.company}
              </h1>
              <div className="text-sm text-muted-foreground mt-1">
                {contractor.name} · {contractor.region}
              </div>
            </div>
          </div>

          <p className="mt-6 text-base text-foreground/80 leading-relaxed max-w-2xl">
            {contractor.bio}
          </p>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Stat
              icon={<Star className="h-4 w-4 fill-primary text-primary" />}
              label={t("matching.detail.verifiedReviews")}
              value={`${contractor.rating} · ${contractor.reviewCount}`}
            />
            <Stat
              icon={<Hammer className="h-4 w-4 text-primary" />}
              label={t("matching.detail.completedProjects")}
              value={`${contractor.completedProjects}+`}
            />
            <Stat
              icon={<Clock className="h-4 w-4 text-primary" />}
              label={t("matching.detail.responseTime")}
              value={`${contractor.responseHours}h`}
            />
            <Stat
              label={t("matching.detail.years")}
              value={`${contractor.yearsExperience}y`}
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="portfolio" className="mt-10">
          <TabsList className="overflow-x-auto no-scrollbar max-w-full">
            <TabsTrigger value="portfolio">
              {t("matching.detail.tabs.portfolio")}
            </TabsTrigger>
            <TabsTrigger value="reviews">{t("matching.detail.tabs.reviews")}</TabsTrigger>
            <TabsTrigger value="quote">{t("matching.detail.tabs.quote")}</TabsTrigger>
            <TabsTrigger value="license">{t("matching.detail.tabs.license")}</TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="mt-6">
            <PortfolioGallery images={contractor.portfolio} />
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="grid md:grid-cols-[260px_1fr] gap-6">
              <div className="rounded-2xl border border-border bg-card p-5 h-fit">
                <div className="serif text-4xl font-medium text-primary">
                  {contractor.rating}
                </div>
                <div className="text-xs text-muted-foreground">
                  {contractor.reviewCount} reviews
                </div>
                <div className="mt-4 space-y-1.5">
                  {ratingDist.map(({ star, count }) => (
                    <div key={star} className="flex items-center gap-2 text-xs">
                      <span className="w-3 text-muted-foreground">{star}</span>
                      <Star className="h-3 w-3 fill-primary text-primary" />
                      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{
                            width: `${
                              (count / Math.max(reviews.length, 1)) * 100
                            }%`,
                          }}
                        />
                      </div>
                      <span className="w-4 text-right text-muted-foreground">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    No reviews yet.
                  </div>
                ) : (
                  reviews.map((r) => <ReviewCard key={r.id} review={r} />)
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="quote" className="mt-6">
            <QuoteComparison current={contractor} />
          </TabsContent>

          <TabsContent value="license" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-3xl border border-border bg-card p-6 space-y-4">
                {contractor.licensed ? (
                  <>
                    <Field
                      label={t("matching.detail.licenseNumber")}
                      value={contractor.licenseNumber ?? ""}
                    />
                    <Field
                      label={t("matching.detail.businessNumber")}
                      value={contractor.businessNumber ?? ""}
                    />
                  </>
                ) : (
                  <div className="text-sm text-muted-foreground leading-relaxed">
                    Unlicensed but cleared through Habitus&apos;s vetting:
                    portfolio review, {contractor.reviewCount} verified reviews,
                    and identity check.
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {(contractor.licensed
                  ? contractor.licenseDocs.slice(0, 4)
                  : contractor.portfolio.slice(0, 4)
                ).map((src, i) => (
                  <div
                    key={i}
                    className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-muted"
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="200px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-30 border-t border-border bg-card/95 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-5 md:px-8 py-4 flex items-center justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {t("matching.startingPrice")}
            </div>
            <div className="text-lg md:text-xl font-semibold serif">
              {`$${Math.round(contractor.startingPrice / 1300).toLocaleString()}`}
            </div>
          </div>
          <RequestDialog contractor={contractor} />
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-muted/40 p-4">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1.5">
        {icon}
        {label}
      </div>
      <div className="serif text-xl font-medium mt-1">{value}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="text-sm font-medium mt-1">{value}</div>
    </div>
  );
}
