import { createBrowserClient } from "@supabase/ssr";

// Once `npm run types:gen` produces authoritative types from your live
// schema, swap to `createBrowserClient<Database>(...)` by re-importing
// Database from "@/lib/db/types".
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
