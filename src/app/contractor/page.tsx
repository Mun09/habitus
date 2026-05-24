import { createServiceClient } from "@/lib/supabase/server";
import { requireContractor } from "@/lib/auth/require-contractor";
import {
  DEMO_ACTIVE_PROJECTS,
  DEMO_ACTIVITY,
  DEMO_ANALYTICS,
  DEMO_QUOTE_REQUESTS,
  DEMO_TODOS,
  type DemoActiveProject,
} from "@/lib/mock/contractor-demo";
import { DashboardClient } from "./dashboard-client";

export const dynamic = "force-dynamic";

type ProjectRow = {
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

  const rows = (data as ProjectRow[] | null) ?? [];
  const isDemo = rows.length === 0;

  const realProjects: DemoActiveProject[] = rows.map((p) => ({
    id: p.id,
    title: p.title,
    customerName: "—",
    region: "—",
    status:
      p.status === "in_progress" || p.status === "completed" || p.status === "pending"
        ? p.status
        : "in_progress",
    progress: p.progress ?? 0,
    currentStage: (p.current_stage as DemoActiveProject["currentStage"]) ?? "demolition",
    startDate: p.created_at,
    expectedEnd: p.created_at,
    daysLeft: 0,
    thumbnail: "",
    nextAction: "",
    unreadMessages: 0,
  }));

  return (
    <DashboardClient
      isDemo={isDemo}
      companyName={identity.companyName}
      activeProjects={isDemo ? DEMO_ACTIVE_PROJECTS : realProjects}
      todos={DEMO_TODOS}
      activity={DEMO_ACTIVITY}
      pendingQuotes={isDemo ? DEMO_QUOTE_REQUESTS.filter((q) => q.status === "pending").length : 0}
      monthlyRevenue={DEMO_ANALYTICS.monthlyRevenue[DEMO_ANALYTICS.monthlyRevenue.length - 1]?.revenue ?? 0}
      avgResponseHours={DEMO_ANALYTICS.avgResponseHours}
    />
  );
}
