import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { rowToContractor } from "@/lib/supabase/contractors";
import { rowToReview } from "@/lib/supabase/reviews";
import { ContractorDetailClient } from "@/components/matching/contractor-detail-client";

type Props = {
  params: Promise<{ contractorId: string }>;
};

async function loadContractorDetail(contractorId: string) {
  const supabase = await createClient();
  const { data: row } = await supabase
    .from("contractors")
    .select("*")
    .eq("id", contractorId)
    .maybeSingle();

  if (!row) return null;

  const contractor = rowToContractor(row);

  const [reviewsRes, comparisonRes] = await Promise.all([
    supabase
      .from("reviews")
      .select("*")
      .eq("contractor_id", contractorId)
      .order("created_at", { ascending: false }),
    supabase
      .from("contractors")
      .select("*")
      .eq("is_active", true)
      .neq("id", contractorId)
      .order("rating", { ascending: false })
      .limit(2),
  ]);

  const reviews = (reviewsRes.data ?? []).map(rowToReview);
  const comparison = (comparisonRes.data ?? []).map(rowToContractor);
  return { contractor, reviews, comparison };
}

export default async function ContractorDetailPage({ params }: Props) {
  const { contractorId } = await params;
  const data = await loadContractorDetail(contractorId);
  if (!data) notFound();
  return (
    <ContractorDetailClient
      contractor={data.contractor}
      reviews={data.reviews}
      comparison={data.comparison}
    />
  );
}
