import type { User } from "@supabase/supabase-js";
import { createServiceClient } from "@/lib/supabase/server";
import { postSignInDestination } from "./route-policy";
import { contractorIdForEmail, isAdminEmail } from "./role-emails";
import type { Locale, UserRole } from "@/lib/db/types";

export type FinalizeResult = {
  destination: string;
  locale: Locale;
  role: UserRole;
};

// Shared between the OAuth/magic-link callback and the password sign-in
// server action. Ensures a user_profiles row exists, promotes the user
// to admin or contractor based on ADMIN_EMAILS / CONTRACTOR_EMAILS, and
// computes the post-sign-in destination based on role + the requested
// next path. Admin wins over contractor if an email is in both lists.
export async function finalizeSignIn(
  user: User,
  next: string | null | undefined,
): Promise<FinalizeResult> {
  const service = await createServiceClient();

  const shouldBeAdmin = isAdminEmail(user.email);
  const contractorSlug = shouldBeAdmin ? null : contractorIdForEmail(user.email);

  const { data: existing } = await service
    .from("user_profiles")
    .select("role, locale, contractor_id")
    .eq("id", user.id)
    .maybeSingle();

  let role: UserRole = (existing?.role as UserRole | undefined) ?? "customer";
  const locale: Locale = (existing?.locale as Locale | undefined) ?? "en";

  if (!existing) {
    const insertRole: UserRole = shouldBeAdmin
      ? "admin"
      : contractorSlug
      ? "contractor"
      : "customer";
    await service.from("user_profiles").insert({
      id: user.id,
      role: insertRole,
      contractor_id: contractorSlug,
    });
    role = insertRole;
  } else if (shouldBeAdmin && existing.role !== "admin") {
    await service
      .from("user_profiles")
      .update({ role: "admin" })
      .eq("id", user.id);
    role = "admin";
  } else if (
    contractorSlug &&
    (existing.role !== "contractor" ||
      existing.contractor_id !== contractorSlug)
  ) {
    await service
      .from("user_profiles")
      .update({ role: "contractor", contractor_id: contractorSlug })
      .eq("id", user.id);
    role = "contractor";
  }

  return {
    destination: postSignInDestination(role, next),
    locale,
    role,
  };
}
