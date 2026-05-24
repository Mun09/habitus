import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import { requireContractor } from "@/lib/auth/require-contractor";

export const dynamic = "force-dynamic";

type ProjectListRow = {
  id: string;
  title: string;
  status: string;
  progress: number;
  current_stage: string;
  user_id: string;
  created_at: string;
};

export default async function ContractorHomePage() {
  const identity = await requireContractor();
  const service = await createServiceClient();
  const { data } = await service
    .from("projects")
    .select("id, title, status, progress, current_stage, user_id, created_at")
    .eq("contractor_id", identity.contractorId)
    .order("created_at", { ascending: false });
  const projects = (data as ProjectListRow[] | null) ?? [];

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 md:px-8">
      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        {identity.companyName}
      </div>
      <h1 className="serif text-3xl font-medium leading-tight text-secondary md:text-5xl">
        My projects
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Open a project to post site updates, message the homeowner, or
        update progress.
      </p>

      <div className="mt-8 space-y-3">
        {projects.length === 0 ? (
          <div className="border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
            No assigned projects yet. New matches will appear here.
          </div>
        ) : (
          projects.map((p) => (
            <Link
              key={p.id}
              href={`/contractor/projects/${p.id}`}
              className="block border border-border bg-card p-5 hover:-translate-y-0.5 hover:shadow-[var(--shadow-warm)] transition"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="serif text-lg font-medium truncate">
                    {p.title}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {p.current_stage} · {p.status}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-medium">{p.progress}%</div>
                  <div className="text-[11px] text-muted-foreground">
                    {new Date(p.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
