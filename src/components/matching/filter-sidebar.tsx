"use client";

import { useState } from "react";
import { Loader2, MapPin, Star } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n/locale-provider";
import { BADGE_LABELS, type Badge, REGIONS } from "@/lib/mock/contractors";
import { cn } from "@/lib/utils";

export type UserLocation = {
  address: string;
  coords?: { lat: number; lng: number };
};

export type Filters = {
  license: "all" | "licensed" | "unlicensed";
  region: "all" | string;
  budget: [number, number];
  minRating: 0 | 4 | 4.5;
  badges: Badge[];
  userLocation: UserLocation;
};

export const DEFAULT_FILTERS: Filters = {
  license: "all",
  region: "all",
  budget: [0, 50000000],
  minRating: 0,
  badges: [],
  userLocation: { address: "" },
};

const ALL_BADGES: Badge[] = [
  "transparent_pricing",
  "on_time_guarantee",
  "background_checked",
  "eco_materials",
  "premium_finishing",
];

export function FilterSidebar({
  filters,
  setFilters,
  className,
}: {
  filters: Filters;
  setFilters: (f: Filters) => void;
  className?: string;
}) {
  const { t } = useLocale();
  const [geoState, setGeoState] = useState<"idle" | "loading" | "error">("idle");

  const requestGeolocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoState("error");
      return;
    }
    setGeoState("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(5));
        const lng = Number(pos.coords.longitude.toFixed(5));
        setFilters({
          ...filters,
          userLocation: {
            address: filters.userLocation.address || `${lat}, ${lng}`,
            coords: { lat, lng },
          },
        });
        setGeoState("idle");
      },
      () => setGeoState("error"),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
    );
  };

  const toggleBadge = (b: Badge) => {
    setFilters({
      ...filters,
      badges: filters.badges.includes(b)
        ? filters.badges.filter((x) => x !== b)
        : [...filters.badges, b],
    });
  };

  const fmtBudget = (v: number) =>
    `$${Math.round(v / 1300).toLocaleString()}`;

  return (
    <aside
      className={cn(
        "h-fit space-y-6 border border-border bg-card p-5 shadow-[var(--shadow-warm)] md:p-6",
        className
      )}
    >
      {/* User location */}
      <FilterSection title="Your location">
        <div className="space-y-2">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              value={filters.userLocation.address}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  userLocation: {
                    ...filters.userLocation,
                    address: e.target.value,
                  },
                })
              }
              placeholder="e.g. Mapo-gu, Seoul"
              className="pl-9 h-10"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            type="button"
            onClick={requestGeolocation}
            disabled={geoState === "loading"}
          >
            {geoState === "loading" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <MapPin className="h-3.5 w-3.5" />
            )}
            Use current location
          </Button>
          {filters.userLocation.coords && (
            <p className="text-[11px] text-muted-foreground">
              Coords:{" "}
              {filters.userLocation.coords.lat.toFixed(4)},{" "}
              {filters.userLocation.coords.lng.toFixed(4)}
            </p>
          )}
          {geoState === "error" && (
            <p className="text-[11px] text-[color:var(--danger)]">
              Please check location permissions.
            </p>
          )}
        </div>
      </FilterSection>

      {/* License */}
      <FilterSection title={t("matching.filter.license")}>
        <div className="grid grid-cols-3 gap-1">
          {(["all", "licensed", "unlicensed"] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setFilters({ ...filters, license: opt })}
              className={cn(
                "cursor-pointer rounded-md border px-2 py-2 text-[11px] font-medium transition",
                filters.license === opt
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {opt === "all"
                ? t("matching.filter.licenseAll")
                : opt === "licensed"
                ? t("matching.filter.licensed")
                : t("matching.filter.unlicensed")}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Region */}
      <FilterSection title={t("matching.filter.region")}>
        <Select
          value={filters.region}
          onValueChange={(v) => setFilters({ ...filters, region: v })}
        >
          <SelectTrigger className="h-10 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("matching.filter.licenseAll")}</SelectItem>
            {REGIONS.map((r) => (
              <SelectItem key={r.key} value={r.key}>
                {r.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterSection>

      {/* Budget */}
      <FilterSection title={t("matching.filter.budget")}>
        <Slider
          value={filters.budget}
          onValueChange={(v) =>
            setFilters({ ...filters, budget: [v[0], v[1]] as [number, number] })
          }
          min={0}
          max={50000000}
          step={1000000}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>{fmtBudget(filters.budget[0])}</span>
          <span>{fmtBudget(filters.budget[1])}</span>
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection title={t("matching.filter.rating")}>
        <div className="flex gap-2">
          {[0, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => setFilters({ ...filters, minRating: r as 0 | 4 | 4.5 })}
              className={cn(
                "inline-flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-md border px-3 py-2 text-xs font-medium transition",
                filters.minRating === r
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-card border-border text-muted-foreground"
              )}
            >
              {r === 0 ? (
                t("matching.filter.licenseAll")
              ) : (
                <>
                  <Star className="h-3 w-3 fill-current" /> {r}+
                </>
              )}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Badges */}
      <FilterSection title={t("matching.filter.badges")}>
        <div className="space-y-2">
          {ALL_BADGES.map((b) => (
            <label
              key={b}
              className="flex items-center gap-3 cursor-pointer text-sm"
            >
              <Checkbox
                checked={filters.badges.includes(b)}
                onCheckedChange={() => toggleBadge(b)}
              />
              <span>{BADGE_LABELS[b]}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <Button
        variant="ghost"
        size="sm"
        className="w-full"
        onClick={() => setFilters(DEFAULT_FILTERS)}
      >
        {t("matching.filter.reset")}
      </Button>
    </aside>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-3">
        {title}
      </div>
      {children}
    </div>
  );
}
