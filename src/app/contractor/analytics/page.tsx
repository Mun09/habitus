import { requireContractor } from "@/lib/auth/require-contractor";
import { DEMO_ANALYTICS } from "@/lib/mock/contractor-demo";
import { AnalyticsClient } from "./analytics-client";

export const dynamic = "force-dynamic";

export default async function ContractorAnalyticsPage() {
  await requireContractor();
  return <AnalyticsClient analytics={DEMO_ANALYTICS} isDemo />;
}
