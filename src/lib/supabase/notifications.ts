import type { createServiceClient } from "@/lib/supabase/server";

type ServiceClient = Awaited<ReturnType<typeof createServiceClient>>;

export type NotificationKind =
  | "quote_received"
  | "project_update"
  | "pm_message"
  | "project_status"
  | "review_request";

export async function notifyProjectOwner(
  service: ServiceClient,
  args: {
    projectId: string;
    kind: NotificationKind;
    title: string;
    body?: string;
  }
) {
  const { data: project } = await service
    .from("projects")
    .select("user_id")
    .eq("id", args.projectId)
    .maybeSingle();
  if (!project?.user_id) return;
  await service.from("notifications").insert({
    user_id: project.user_id,
    project_id: args.projectId,
    kind: args.kind,
    title: args.title,
    body: args.body ?? null,
  });
}
