"use client";

import { useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Sparkles, Filter as FilterIcon } from "lucide-react";
import { ContractorCard } from "@/components/matching/contractor-card";
import { PlanSummaryBanner } from "@/components/matching/plan-summary";
import {
  DEFAULT_FILTERS,
  FilterSidebar,
  type Filters,
} from "@/components/matching/filter-sidebar";
import { CONTRACTORS } from "@/lib/mock/contractors";
import { useLocale } from "@/lib/i18n/locale-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function MatchingContent() {
  const { t, pick } = useLocale();
  const params = useSearchParams();
  const fromPlan = params.get("planId");
  const continueProject = params.get("continueProject");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const results = useMemo(() => {
    return CONTRACTORS.filter((c) => {
      if (filters.license === "licensed" && !c.licensed) return false;
      if (filters.license === "unlicensed" && c.licensed) return false;
      if (filters.region !== "all" && c.regionKey !== filters.region) return false;
      if (
        c.startingPrice < filters.budget[0] ||
        c.startingPrice > filters.budget[1]
      )
        return false;
      if (c.rating < filters.minRating) return false;
      if (
        filters.badges.length > 0 &&
        !filters.badges.every((b) => c.badges.includes(b))
      )
        return false;
      return true;
    });
  }, [filters]);

  return (
    <div className="mx-auto max-w-7xl px-5 md:px-8 py-10 md:py-14">
      <div className="mb-8 md:mb-10">
        <h1 className="serif text-3xl md:text-5xl font-medium leading-tight">
          {t("matching.title")}
        </h1>
        <p className="mt-3 text-muted-foreground max-w-xl">{t("matching.subtitle")}</p>

        {(fromPlan || continueProject) && (
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary">
            <Sparkles className="h-4 w-4" />
            {fromPlan ? t("matching.fromPlan") : t("matching.continueProject")}
          </div>
        )}
      </div>

      <div className="mb-8">
        <PlanSummaryBanner />
      </div>

      <div className="md:hidden mb-4">
        <Dialog open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <FilterIcon className="h-4 w-4" />
              {t("matching.filter.results")} ({results.length})
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{t("matching.filter.results")}</DialogTitle>
            </DialogHeader>
            <FilterSidebar filters={filters} setFilters={setFilters} className="border-0 shadow-none p-0" />
            <div className="mt-4">
              <Button className="w-full" onClick={() => setMobileFiltersOpen(false)}>
                {t("matching.filter.results")} ({results.length})
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-[260px_1fr] lg:grid-cols-[280px_1fr] gap-6 md:gap-8">
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          className="hidden md:block"
        />
        <div>
          <div className="hidden md:flex items-center justify-between mb-5">
            <div className="text-sm text-muted-foreground">
              {t("matching.filter.results")} · {results.length}
            </div>
            {filters.userLocation.address && (
              <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span>
                  {pick({ ko: "기준 위치", en: "From" })}:{" "}
                  <span className="text-foreground font-medium">
                    {filters.userLocation.address}
                  </span>
                </span>
              </div>
            )}
          </div>
          {results.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border p-16 text-center text-muted-foreground">
              {t("matching.empty")}
            </div>
          ) : (
            <motion.div
              layout
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              <AnimatePresence>
                {results.map((c, i) => (
                  <ContractorCard key={c.id} contractor={c} index={i} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MatchingPage() {
  return (
    <Suspense fallback={null}>
      <MatchingContent />
    </Suspense>
  );
}
