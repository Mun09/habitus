import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { rowToProject } from "@/lib/supabase/projects";
import { rowToContractor } from "@/lib/supabase/contractors";
import { ProjectsClient } from "@/components/projects/projects-client";
import { EmptyProjectsState } from "@/components/projects/empty-state";

// The page reads cookies/session to scope projects to the current user,
// so it must never be cached as a single shared static asset.
export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?next=/projects");

  const { data: projectRows } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (!projectRows || projectRows.length === 0) {
    return <EmptyProjectsState />;
  }

  const contractorIds = Array.from(
    new Set(projectRows.map((p) => p.contractor_id).filter(Boolean))
  );
  const { data: contractorRows } = await supabase
    .from("contractors")
    .select("*")
    .in("id", contractorIds.length > 0 ? contractorIds : ["__none__"]);

  const projects = projectRows.map((row) => rowToProject(row, [], []));
  const contractors = (contractorRows ?? []).map(rowToContractor);
  return <ProjectsClient projects={projects} contractors={contractors} />;
}
