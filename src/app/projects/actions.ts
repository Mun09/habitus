"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type ReviewInput = {
  projectId: string;
  contractorId: string;
  rating: number;
  title: string;
  body: string;
  photos?: string[];
};

type ReviewResult = { ok: true } | { error: string };

export async function createReview(input: ReviewInput): Promise<ReviewResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in required" };

  if (input.rating < 1 || input.rating > 5) {
    return { error: "Rating must be between 1 and 5" };
  }

  const { error } = await supabase.from("reviews").insert({
    project_id: input.projectId,
    user_id: user.id,
    contractor_id: input.contractorId,
    rating: input.rating,
    title: input.title.trim() || null,
    body: input.body.trim() || null,
    photos: input.photos ?? [],
  });
  if (error) return { error: error.message };

  revalidatePath(`/projects/${input.projectId}`);
  return { ok: true };
}
