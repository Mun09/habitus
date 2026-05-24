import { NextResponse, type NextRequest } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { postSignInDestination } from "@/lib/auth/route-policy";
import { LOCALE_COOKIE } from "@/lib/i18n/locale-provider";
import type { Locale, UserRole } from "@/lib/db/types";

function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (!code) {
    return NextResponse.redirect(`${origin}/sign-in?error=auth_callback`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.session) {
    return NextResponse.redirect(`${origin}/sign-in?error=auth_callback`);
  }

  const user = data.session.user;
  const service = await createServiceClient();

  // Make sure a user_profiles row exists. Insert with default role
  // 'customer'; if ADMIN_EMAILS lists this email, promote to admin.
  // Service client is used so RLS doesn't block the bootstrap row.
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

  const destination = postSignInDestination(role, next);
  const response = NextResponse.redirect(`${origin}${destination}`);

  // Mirror the user's saved locale into the cookie so the first
  // server render after sign-in already speaks the right language.
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  return response;
}
