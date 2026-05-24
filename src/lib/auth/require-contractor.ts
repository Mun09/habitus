import type { User } from "@supabase/supabase-js";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export type ContractorIdentity = {
  user: User;
  contractorId: string;
  companyName: string;
};

// Server-only. Resolves the signed-in user and asserts they have a
// contractor role + a linked contractor_id. Throws with a stable
// message so callers can map to 401/403 cleanly. Admin is NOT accepted
// here: the helper assumes a single contractor identity, and admins
// have none. Admin "view as contractor X" is a follow-up.
export async function requireContractor(): Promise<ContractorIdentity> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const service = await createServiceClient();
  const { data: profile } = await service
    .from("user_profiles")
    .select("role, contractor_id")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "contractor" || !profile.contractor_id) {
    throw new Error("Forbidden");
  }

  const { data: contractor } = await service
    .from("contractors")
    .select("company")
    .eq("id", profile.contractor_id)
    .maybeSingle();

  return {
    user,
    contractorId: profile.contractor_id,
    companyName: contractor?.company ?? profile.contractor_id,
  };
}
