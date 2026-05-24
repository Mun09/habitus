import { redirect } from "next/navigation";
import { requireContractor } from "@/lib/auth/require-contractor";
import type { ContractorIdentity } from "@/lib/auth/require-contractor";

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
    // Middleware blocks signed-out users; this catches the role /
    // contractor_id mismatch case (signed in but not bound to a
    // contractor row). Send them to their actual home.
    redirect("/");
  }

  return (
    <div className="min-h-[60vh]">
      <div className="border-b border-border bg-card/60">
        <div className="mx-auto max-w-5xl px-5 py-3 md:px-8 flex items-center justify-between gap-4">
          <div className="text-xs uppercase tracking-[0.2em] text-accent">
            Contractor portal
          </div>
          <div className="text-xs text-muted-foreground truncate">
            {identity.companyName}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
