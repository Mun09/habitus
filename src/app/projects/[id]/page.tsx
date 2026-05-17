import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { rowToProject } from "@/lib/supabase/projects";
import { rowToContractor } from "@/lib/supabase/contractors";
import { TrackingClient } from "@/components/tracking/tracking-client";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function TrackingPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/sign-in?next=/projects/${id}`);

  const { data: row, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !row) notFound();

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

  const project = rowToProject(row, updatesRes.data ?? [], chatsRes.data ?? []);
  const contractor = contractorRes.data
    ? rowToContractor(contractorRes.data)
    : null;

  return <TrackingClient project={project} contractor={contractor} />;
}
