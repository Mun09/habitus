import type { User } from "@supabase/supabase-js";
import { createServiceClient } from "@/lib/supabase/server";
import { postSignInDestination } from "./route-policy";
import type { Locale, UserRole } from "@/lib/db/types";

function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export type FinalizeResult = {
  destination: string;
  locale: Locale;
  role: UserRole;
};

// Shared between the OAuth/magic-link callback and the password sign-in
// server action. Ensures a user_profiles row exists, promotes the user
// to admin if their email matches ADMIN_EMAILS, and computes the
// post-sign-in destination based on role + the requested next path.
export async function finalizeSignIn(
  user: User,
  next: string | null | undefined,
): Promise<FinalizeResult> {
  const service = await createServiceClient();

  const shouldBeAdmin = !!user.email &&
    adminEmails().includes(user.email.toLowerCase());

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
      role: shouldBeAdmin ? "admin" : "customer",
    });
    role = shouldBeAdmin ? "admin" : "customer";
  } else if (shouldBeAdmin && existing.role !== "admin") {
    await service
      .from("user_profiles")
      .update({ role: "admin" })
      .eq("id", user.id);
    role = "admin";
  }

  return {
    destination: postSignInDestination(role, next),
    locale,
    role,
  };
}
