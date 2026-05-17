"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type CreateQuoteInput = {
  contractorId: string;
  designPlanId: string | null;
  message: string;
  preferredStart: string | null;
  attachPlan: boolean;
};

type CreateQuoteResult = { projectId: string } | { error: string };

export async function createQuoteRequest(
  input: CreateQuoteInput
): Promise<CreateQuoteResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in required" };

  if (!input.contractorId) return { error: "Missing contractor" };

  const { data: quote, error: quoteError } = await supabase
    .from("quote_requests")
    .insert({
      user_id: user.id,
      contractor_id: input.contractorId,
      design_plan_id: input.designPlanId,
      message: input.message || null,
      preferred_start: input.preferredStart,
      attach_plan: input.attachPlan,
    })
    .select()
    .single();

  if (quoteError || !quote) {
    return { error: quoteError?.message ?? "Failed to save quote request" };
  }

  const { data: contractor } = await supabase
    .from("contractors")
    .select("company")
    .eq("id", input.contractorId)
    .single();

  const title = contractor?.company
    ? `${contractor.company} renovation`
    : "Renovation project";

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .insert({
      user_id: user.id,
      contractor_id: input.contractorId,
      quote_request_id: quote.id,
      title,
      status: "pending",
      pm_name: "박매니저",
      pm_role: "Project Manager",
      pm_response_hours: 2,
    })
    .select()
    .single();

  if (projectError || !project) {
    return { error: projectError?.message ?? "Failed to open project" };
  }

  revalidatePath("/projects");
  return { projectId: project.id };
}
