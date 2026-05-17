import { createClient } from "@/lib/supabase/server";
import {
  PROJECTS,
  type Project,
} from "@/lib/mock/projects";
import { CONTRACTORS, type Contractor } from "@/lib/mock/contractors";
import { rowToProject } from "@/lib/supabase/projects";
import { rowToContractor } from "@/lib/supabase/contractors";
import { ProjectsClient } from "@/components/projects/projects-client";

// The page reads cookies/session to scope projects to the current user,
// so it must never be cached as a single shared static asset.
export const dynamic = "force-dynamic";

function hasSupabaseEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

async function loadMyProjects(): Promise<{
  projects: Project[];
  contractors: Contractor[];
}> {
  // Without Supabase configured we show the W2-1 prototype walkthrough.
  if (!hasSupabaseEnv()) {
    return { projects: PROJECTS, contractors: CONTRACTORS };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { projects: [], contractors: [] };

    const { data: projectRows } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!projectRows || projectRows.length === 0) {
      // No real projects yet. Keep the prototype walkthrough so the user
      // has something tangible to click while exploring.
      return { projects: PROJECTS, contractors: CONTRACTORS };
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
    return { projects, contractors };
  } catch {
    return { projects: PROJECTS, contractors: CONTRACTORS };
  }
}

export default async function ProjectsPage() {
  const { projects, contractors } = await loadMyProjects();
  return <ProjectsClient projects={projects} contractors={contractors} />;
}
