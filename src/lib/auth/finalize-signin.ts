import type { User } from "@supabase/supabase-js";
import { createServiceClient } from "@/lib/supabase/server";
import { postSignInDestination } from "./route-policy";
import type { Locale, UserRole } from "@/lib/db/types";

export type FinalizeResult = {
  destination: string;
  locale: Locale;
  role: UserRole;
};

// Shared between the OAuth/magic-link callback and the password sign-in
// server action. Ensures a user_profiles row exists (defaulting to
// role='customer') and computes the post-sign-in destination based on
// whatever role the DB already holds for this user. Promotion to
// 'admin' or 'contractor' is operator work in Supabase Studio.
export async function finalizeSignIn(
  user: User,
  next: string | null | undefined,
): Promise<FinalizeResult> {
  const service = await createServiceClient();

  const { data: existing } = await service
    .from("user_profiles")
    .select("role, locale")
    .eq("id", user.id)
    .maybeSingle();

  let role: UserRole = (existing?.role as UserRole | undefined) ?? "customer";
  const locale: Locale = (existing?.locale as Locale | undefined) ?? "en";

  if (!existing) {
    await service.from("user_profiles").insert({
      id: user.id,
      role: "customer",
    });
    role = "customer";
  }

  return {
    destination: postSignInDestination(role, next),
    locale,
    role,
  };
}
