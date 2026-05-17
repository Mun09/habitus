"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Sparkles, Filter as FilterIcon } from "lucide-react";
import { ContractorCard } from "@/components/matching/contractor-card";
import { PlanSummaryBanner } from "@/components/matching/plan-summary";
import {
  DEFAULT_FILTERS,
  FilterSidebar,
  type Filters,
} from "@/components/matching/filter-sidebar";
import type { Contractor } from "@/lib/mock/contractors";
import { useLocale } from "@/lib/i18n/locale-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SortKey = "rating" | "price" | "years";
type RegionKey = "seoul" | "gyeonggi" | "busan" | "incheon";

export function MatchingClient({
  contractors,
  fromPlan,
  continueProject,
  serverFilters,
}: {
  contractors: Contractor[];
  fromPlan: string | null;
  continueProject: string | null;
  serverFilters?: {
    region: RegionKey | null;
    maxPrice: number | null;
    minRating: number | null;
    sort: SortKey;
  };
}) {
  const { t } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Hydrate the client-side filter state from server-decoded URL params so
  // a shared link lands with the same filters checked.
  const initialFilters: Filters = useMemo(() => {
    const base: Filters = { ...DEFAULT_FILTERS };
    if (serverFilters?.region) base.region = serverFilters.region;
    if (serverFilters?.minRating != null) {
      const r = serverFilters.minRating;
      base.minRating = (r >= 4.5 ? 4.5 : r >= 4 ? 4 : 0) as Filters["minRating"];
    }
    if (serverFilters?.maxPrice != null) {
      base.budget = [base.budget[0], serverFilters.maxPrice];
    }
    return base;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sort, setSort] = useState<SortKey>(serverFilters?.sort ?? "rating");

  // Push the server-meaningful subset of filters (region, sort) to the URL
  // so the page re-runs its server query when the user changes them.
  useEffect(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (filters.region && filters.region !== "all")
      params.set("region", filters.region);
    else params.delete("region");
    if (filters.minRating > 0) params.set("minRating", String(filters.minRating));
    else params.delete("minRating");
    if (sort !== "rating") params.set("sort", sort);
    else params.delete("sort");
    const next = params.toString();
    const current = searchParams.toString();
    if (next !== current) {
      router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.region, filters.minRating, sort]);

  const results = useMemo(() => {
    return contractors.filter((c) => {
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
  }, [contractors, filters]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-10">
      <div className="mb-6 border-b border-border pb-6 md:mb-8">
        <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Contractor Desk
        </div>
        <h1 className="serif text-3xl font-medium leading-tight text-secondary md:text-5xl">
          {t("matching.title")}
        </h1>
        <p className="mt-3 max-w-xl leading-6 text-muted-foreground">
          {t("matching.subtitle")}
        </p>

        {(fromPlan || continueProject) && (
          <div className="mt-5 inline-flex items-center gap-2 border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary">
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
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              className="border-0 shadow-none p-0"
            />
            <div className="mt-4">
              <Button
                className="w-full"
                onClick={() => setMobileFiltersOpen(false)}
              >
                {t("matching.filter.results")} ({results.length})
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-[260px_1fr] md:gap-8 lg:grid-cols-[280px_1fr]">
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          className="hidden md:block"
        />
        <div>
          <div className="mb-5 hidden items-center justify-between border-b border-border pb-3 md:flex">
            <div className="text-sm text-muted-foreground">
              {t("matching.filter.results")} / {results.length}
            </div>
            <div className="flex items-center gap-4">
              {filters.userLocation.address && (
                <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>
                    From:{" "}
                    <span className="text-foreground font-medium">
                      {filters.userLocation.address}
                    </span>
                  </span>
                </div>
              )}
              <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                <SelectTrigger className="h-8 w-[160px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Sort: highest rated</SelectItem>
                  <SelectItem value="price">Sort: lowest price</SelectItem>
                  <SelectItem value="years">Sort: most experience</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {results.length === 0 ? (
            <div className="border border-dashed border-border bg-card p-16 text-center text-muted-foreground">
              {t("matching.empty")}
            </div>
          ) : (
            <motion.div
              layout
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
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
