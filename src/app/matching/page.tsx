import { createClient } from "@/lib/supabase/server";
import { rowToContractor } from "@/lib/supabase/contractors";
import { MatchingClient } from "@/components/matching/matching-client";

type Props = {
  searchParams: Promise<{
    planId?: string;
    continueProject?: string;
    region?: string;
    maxPrice?: string;
    minRating?: string;
    sort?: string;
  }>;
};

const ALLOWED_REGIONS = ["seoul", "gyeonggi", "busan", "incheon"] as const;
type RegionKey = (typeof ALLOWED_REGIONS)[number];

export type ContractorFilters = {
  region: RegionKey | null;
  maxPrice: number | null;
  minRating: number | null;
  sort: "rating" | "price" | "years";
};

function parseFilters(sp: {
  region?: string;
  maxPrice?: string;
  minRating?: string;
  sort?: string;
}): ContractorFilters {
  const region = ALLOWED_REGIONS.includes(sp.region as RegionKey)
    ? (sp.region as RegionKey)
    : null;
  const maxPrice = sp.maxPrice ? Number(sp.maxPrice) : null;
  const minRating = sp.minRating ? Number(sp.minRating) : null;
  const sort: ContractorFilters["sort"] =
    sp.sort === "price" || sp.sort === "years" ? sp.sort : "rating";
  return {
    region,
    maxPrice: Number.isFinite(maxPrice) && (maxPrice ?? 0) > 0 ? maxPrice : null,
    minRating:
      Number.isFinite(minRating) && (minRating ?? 0) > 0 ? minRating : null,
    sort,
  };
}

async function loadContractors(filters: ContractorFilters) {
  const supabase = await createClient();
  let q = supabase.from("contractors").select("*").eq("is_active", true);

  if (filters.region) q = q.eq("region_key", filters.region);
  if (filters.maxPrice !== null) q = q.lte("starting_price", filters.maxPrice);
  if (filters.minRating !== null) q = q.gte("rating", filters.minRating);

  if (filters.sort === "price") q = q.order("starting_price", { ascending: true });
  else if (filters.sort === "years")
    q = q.order("years_experience", { ascending: false });
  else q = q.order("rating", { ascending: false });

  const { data } = await q;
  return (data ?? []).map(rowToContractor);
}

export default async function MatchingPage({ searchParams }: Props) {
  const sp = await searchParams;
  const filters = parseFilters(sp);
  const contractors = await loadContractors(filters);
  return (
    <MatchingClient
      contractors={contractors}
      fromPlan={sp.planId ?? null}
      continueProject={sp.continueProject ?? null}
      serverFilters={filters}
    />
  );
}
