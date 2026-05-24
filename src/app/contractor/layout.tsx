import { redirect } from "next/navigation";
import { requireContractor } from "@/lib/auth/require-contractor";
import type { ContractorIdentity } from "@/lib/auth/require-contractor";
import { ContractorTabs } from "@/components/contractor/contractor-tabs";

export const dynamic = "force-dynamic";

export default async function ContractorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let identity: ContractorIdentity;
  try {
    identity = await requireContractor();
  } catch {
    redirect("/");
  }

  return (
    <div className="min-h-[60vh]">
      <div className="border-b border-border bg-card/60">
        <div className="mx-auto max-w-6xl px-5 py-3 md:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="text-xs uppercase tracking-[0.2em] text-accent">
              Contractor portal
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {identity.companyName}
            </div>
          </div>
          <div className="mt-3">
            <ContractorTabs />
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
