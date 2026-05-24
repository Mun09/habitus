"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { LOCALE_COOKIE } from "@/lib/i18n/locale-provider";
import type { Locale } from "@/lib/i18n/dictionaries";
import type { Database } from "@/lib/db/types";

type ProfilePatch = {
  nickname?: string | null;
  phone?: string | null;
  region_key?: Database["public"]["Tables"]["user_profiles"]["Row"]["region_key"];
  address?: string | null;
};

export async function updateLocale(locale: Locale) {
  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase
      .from("user_profiles")
      .update({ locale })
      .eq("id", user.id);
  }

  revalidatePath("/", "layout");
  return { ok: true as const };
}

export async function updateProfile(patch: ProfilePatch) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, error: "Not signed in" };

  const { error } = await supabase
    .from("user_profiles")
    .update(patch)
    .eq("id", user.id);

  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/settings");
  return { ok: true as const };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  return { ok: true as const };
}
