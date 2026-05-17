import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  CONTRACTORS,
  type Contractor,
} from "@/lib/mock/contractors";
import { REVIEWS, type Review } from "@/lib/mock/reviews";
import { rowToContractor } from "@/lib/supabase/contractors";
import { rowToReview } from "@/lib/supabase/reviews";
import { ContractorDetailClient } from "@/components/matching/contractor-detail-client";

type Props = {
  params: Promise<{ contractorId: string }>;
};

function hasSupabaseEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

function fallbackMock(contractorId: string): {
  contractor: Contractor;
  reviews: Review[];
} | null {
  const c = CONTRACTORS.find((x) => x.id === contractorId);
  if (!c) return null;
  return {
    contractor: c,
    reviews: REVIEWS.filter((r) => r.contractorId === contractorId),
  };
}

async function loadContractorDetail(contractorId: string) {
  if (!hasSupabaseEnv()) return fallbackMock(contractorId);

  try {
    const supabase = await createClient();
    const { data: row } = await supabase
      .from("contractors")
      .select("*")
      .eq("id", contractorId)
      .maybeSingle();

    if (!row) return fallbackMock(contractorId);

    const contractor = rowToContractor(row);

    const { data: reviewRows } = await supabase
      .from("reviews")
      .select("*")
      .eq("contractor_id", contractorId)
      .order("created_at", { ascending: false });

    // Until real reviews land in the DB, keep the prototype seed so the
    // tab never looks empty for a freshly-deployed instance.
    const reviews =
      reviewRows && reviewRows.length > 0
        ? reviewRows.map(rowToReview)
        : REVIEWS.filter((r) => r.contractorId === contractorId);

    return { contractor, reviews };
  } catch {
    return fallbackMock(contractorId);
  }
}

export default async function ContractorDetailPage({ params }: Props) {
  const { contractorId } = await params;
  const data = await loadContractorDetail(contractorId);
  if (!data) notFound();
  return (
    <ContractorDetailClient contractor={data.contractor} reviews={data.reviews} />
  );
}
