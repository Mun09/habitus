import { createClient } from "@/lib/supabase/server";
import { CONTRACTORS, type Contractor } from "@/lib/mock/contractors";
import { rowToContractor } from "@/lib/supabase/contractors";
import { MatchingClient } from "@/components/matching/matching-client";

type Props = {
  searchParams: Promise<{
    planId?: string;
    continueProject?: string;
  }>;
};

async function loadContractors(): Promise<Contractor[]> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    // No Supabase configured. Fall back to mock so local dev still works.
    return CONTRACTORS;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("contractors")
      .select("*")
      .eq("is_active", true)
      .order("rating", { ascending: false });

    if (error || !data || data.length === 0) return CONTRACTORS;
    return data.map(rowToContractor);
  } catch {
    return CONTRACTORS;
  }
}

export default async function MatchingPage({ searchParams }: Props) {
  const sp = await searchParams;
  const contractors = await loadContractors();
  return (
    <MatchingClient
      contractors={contractors}
      fromPlan={sp.planId ?? null}
      continueProject={sp.continueProject ?? null}
    />
  );
}
