import { requireContractor } from "@/lib/auth/require-contractor";
import { pickDemoContractor } from "@/lib/mock/contractor-demo";
import { ProfilePreviewClient } from "./profile-preview-client";

export const dynamic = "force-dynamic";

export default async function ContractorProfilePage() {
  const identity = await requireContractor();
  const contractor = pickDemoContractor(identity.contractorId);
  return <ProfilePreviewClient contractor={contractor} />;
}
