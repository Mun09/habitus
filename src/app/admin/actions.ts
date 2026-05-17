"use server";

import { revalidatePath } from "next/cache";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { notifyProjectOwner } from "@/lib/supabase/notifications";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) {
    throw new Error("Unauthorized");
  }
  const allowed = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (!allowed.includes(user.email.toLowerCase())) {
    throw new Error("Forbidden");
  }
  return user;
}

export type AdminResult = { ok: true } | { error: string };

export async function addProjectUpdate(input: {
  projectId: string;
  stage: string;
  author: string;
  title: string;
  body: string;
  photos: string[];
}): Promise<AdminResult> {
  try {
    await requireAdmin();
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unauthorized" };
  }

  const service = await createServiceClient();
  const { error } = await service.from("project_updates").insert({
    project_id: input.projectId,
    stage: input.stage || null,
    author: input.author || "PM",
    title: input.title,
    body: input.body || null,
    photos: input.photos,
  });
  if (error) return { error: error.message };

  await notifyProjectOwner(service, {
    projectId: input.projectId,
    kind: "project_update",
    title: input.title,
    body: input.body || null ? input.body : undefined,
  });

  revalidatePath(`/projects/${input.projectId}`);
  revalidatePath(`/admin/projects/${input.projectId}`);
  return { ok: true };
}

export async function sendPmMessage(
  projectId: string,
  body: string
): Promise<AdminResult> {
  try {
    await requireAdmin();
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unauthorized" };
  }

  if (!body.trim()) return { error: "Empty message" };
  const service = await createServiceClient();
  const trimmed = body.trim();
  const { error } = await service.from("chat_messages").insert({
    project_id: projectId,
    sender_type: "pm",
    body: trimmed,
  });
  if (error) return { error: error.message };

  await notifyProjectOwner(service, {
    projectId,
    kind: "pm_message",
    title: "New message from your PM",
    body: trimmed.length > 80 ? `${trimmed.slice(0, 77)}…` : trimmed,
  });

  return { ok: true };
}

export async function updateProjectProgress(input: {
  projectId: string;
  progress: number;
  currentStage: string;
  status?: string;
}): Promise<AdminResult> {
  try {
    await requireAdmin();
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unauthorized" };
  }

  const service = await createServiceClient();
  const patch: Record<string, unknown> = {
    progress: Math.min(100, Math.max(0, input.progress)),
    current_stage: input.currentStage,
  };
  if (input.status) patch.status = input.status;

  const { error } = await service
    .from("projects")
    .update(patch)
    .eq("id", input.projectId);
  if (error) return { error: error.message };

  if (input.status === "completed") {
    await notifyProjectOwner(service, {
      projectId: input.projectId,
      kind: "review_request",
      title: "Project completed",
      body: "Leave a review to help future homeowners pick the right contractor.",
    });
  } else if (input.status) {
    await notifyProjectOwner(service, {
      projectId: input.projectId,
      kind: "project_status",
      title: `Project status: ${input.status}`,
    });
  }

  revalidatePath(`/projects/${input.projectId}`);
  revalidatePath(`/admin/projects/${input.projectId}`);
  return { ok: true };
}
