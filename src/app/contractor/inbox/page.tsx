import { createServiceClient } from "@/lib/supabase/server";
import { requireContractor } from "@/lib/auth/require-contractor";
import { DEMO_QUOTE_REQUESTS } from "@/lib/mock/contractor-demo";
import { InboxClient } from "./inbox-client";

export const dynamic = "force-dynamic";

export default async function ContractorInboxPage() {
  const identity = await requireContractor();
  const service = await createServiceClient();
  const { data } = await service
    .from("quote_requests")
    .select("id, status")
    .eq("contractor_id", identity.contractorId)
    .limit(1);

  const isDemo = !data || data.length === 0;
  return <InboxClient isDemo={isDemo} initial={DEMO_QUOTE_REQUESTS} />;
}
