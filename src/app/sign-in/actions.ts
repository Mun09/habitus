"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { finalizeSignIn } from "@/lib/auth/finalize-signin";
import { LOCALE_COOKIE } from "@/lib/i18n/cookie";

type Input = {
  email: string;
  password: string;
  next?: string | null;
};

export async function passwordSignIn(input: Input) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (error || !data.user) {
    return { ok: false as const, error: error?.message ?? "Sign in failed" };
  }

  const { destination, locale } = await finalizeSignIn(data.user, input.next);
  const jar = await cookies();
  jar.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  redirect(destination);
}

export async function passwordSignUp(input: Input) {
  if (input.password.length < 6) {
    return { ok: false as const, error: "Password must be at least 6 characters." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
  });

  if (error) {
    return { ok: false as const, error: error.message };
  }

  // With local Supabase (enable_confirmations=false) the user is
  // already authenticated. With cloud Supabase confirmations are on by
  // default, so data.session is null until the user clicks the email.
  if (!data.session) {
    return {
      ok: true as const,
      needsConfirmation: true as const,
    };
  }

  const { destination, locale } = await finalizeSignIn(data.user!, input.next);
  const jar = await cookies();
  jar.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  redirect(destination);
}
