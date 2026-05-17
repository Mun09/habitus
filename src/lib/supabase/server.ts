import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Note: once `supabase gen types typescript` produces a fresh schema for
// src/lib/db/types.ts, re-add the <Database> generic here and below.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component. Safe to ignore if middleware refreshes the session.
          }
        },
      },
    }
  );
}

export async function createServiceClient() {
  // Service role client. Bypasses RLS. Server-only.
  const { createClient } = await import("@supabase/supabase-js");
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
