import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { rowToProject } from "@/lib/supabase/projects";
import { rowToContractor } from "@/lib/supabase/contractors";
import { getProject, type Project } from "@/lib/mock/projects";
import { CONTRACTORS, type Contractor } from "@/lib/mock/contractors";
import { TrackingClient } from "@/components/tracking/tracking-client";

type Props = {
  params: Promise<{ id: string }>;
};

function hasSupabaseEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

async function loadProject(id: string): Promise<{
  project: Project;
  contractor: Contractor | null;
} | null> {
  // Mock fallback for the prototype project id and any time Supabase
  // is not configured locally.
  const mock = getProject(id);
  if (mock) {
    const c = CONTRACTORS.find((x) => x.id === mock.contractorId) ?? null;
    return { project: mock, contractor: c };
  }

  if (!hasSupabaseEnv()) return null;

  const supabase = await createClient();
  const { data: row, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !row) return null;

  const [updatesRes, chatsRes, contractorRes] = await Promise.all([
    supabase
      .from("project_updates")
      .select("*")
      .eq("project_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("chat_messages")
      .select("*")
      .eq("project_id", id)
      .order("created_at", { ascending: true }),
    supabase
      .from("contractors")
      .select("*")
      .eq("id", row.contractor_id)
      .maybeSingle(),
  ]);

  const project = rowToProject(
    row,
    updatesRes.data ?? [],
    chatsRes.data ?? []
  );
  const contractor = contractorRes.data
    ? rowToContractor(contractorRes.data)
    : null;

  return { project, contractor };
}

export default async function TrackingPage({ params }: Props) {
  const { id } = await params;
  const data = await loadProject(id);
  if (!data) notFound();
  return <TrackingClient project={data.project} contractor={data.contractor} />;
}
