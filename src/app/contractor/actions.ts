"use server";

import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";
import { notifyProjectOwner } from "@/lib/supabase/notifications";
import { requireContractor } from "@/lib/auth/require-contractor";

const STAGES = [
  "demolition",
  "plumbing",
  "electrical",
  "carpentry",
  "painting",
  "finishing",
] as const;

const STATUSES = ["pending", "in_progress", "completed", "cancelled"] as const;

type Stage = (typeof STAGES)[number];
type Status = (typeof STATUSES)[number];

export type ContractorResult = { ok: true } | { error: string };

// Assert the project belongs to the calling contractor. Defense-in-
// depth on top of the RLS policies in 011_contractor_link.sql.
async function assertOwnsProject(
  contractorId: string,
  projectId: string,
): Promise<{ ok: true } | { error: string }> {
  const service = await createServiceClient();
  const { data } = await service
    .from("projects")
    .select("contractor_id")
    .eq("id", projectId)
    .maybeSingle();
  if (!data) return { error: "Project not found" };
  if (data.contractor_id !== contractorId) return { error: "Forbidden" };
  return { ok: true };
}

export async function addProjectUpdate(input: {
  projectId: string;
  stage: string;
  author: string;
  title: string;
  body: string;
  photos: string[];
}): Promise<ContractorResult> {
  let identity;
  try {
    identity = await requireContractor();
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unauthorized" };
  }

  const guard = await assertOwnsProject(identity.contractorId, input.projectId);
  if ("error" in guard) return guard;

  const service = await createServiceClient();
  const { error } = await service.from("project_updates").insert({
    project_id: input.projectId,
    stage: input.stage || null,
    author: input.author || identity.companyName,
    title: input.title,
    body: input.body || null,
    photos: input.photos,
  });
  if (error) return { error: error.message };

  await notifyProjectOwner(service, {
    projectId: input.projectId,
    kind: "project_update",
    title: input.title,
    body: input.body || undefined,
  });

  revalidatePath(`/projects/${input.projectId}`);
  revalidatePath(`/contractor/projects/${input.projectId}`);
  return { ok: true };
}

export async function sendContractorMessage(
  projectId: string,
  body: string,
): Promise<ContractorResult> {
  let identity;
  try {
    identity = await requireContractor();
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unauthorized" };
  }

  const trimmed = body.trim();
  if (!trimmed) return { error: "Empty message" };

  const guard = await assertOwnsProject(identity.contractorId, projectId);
  if ("error" in guard) return guard;

  const service = await createServiceClient();
  const { error } = await service.from("chat_messages").insert({
    project_id: projectId,
    sender_type: "pm",
    body: trimmed,
  });
  if (error) return { error: error.message };

  await notifyProjectOwner(service, {
    projectId,
    kind: "pm_message",
    title: `New message from ${identity.companyName}`,
    body: trimmed.length > 80 ? `${trimmed.slice(0, 77)}…` : trimmed,
  });

  revalidatePath(`/contractor/projects/${projectId}`);
  return { ok: true };
}

export async function updateProjectProgress(input: {
  projectId: string;
  progress: number;
  currentStage: string;
  status?: string;
}): Promise<ContractorResult> {
  let identity;
  try {
    identity = await requireContractor();
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unauthorized" };
  }

  if (!STAGES.includes(input.currentStage as Stage)) {
    return { error: `Invalid stage: ${input.currentStage}` };
  }
  if (input.status && !STATUSES.includes(input.status as Status)) {
    return { error: `Invalid status: ${input.status}` };
  }

  const guard = await assertOwnsProject(identity.contractorId, input.projectId);
  if ("error" in guard) return guard;

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
  revalidatePath(`/contractor/projects/${input.projectId}`);
  return { ok: true };
}
