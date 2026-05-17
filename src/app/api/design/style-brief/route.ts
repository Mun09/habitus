import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const input = (url.searchParams.get("input") ?? "").toLowerCase();
  const styleParam = url.searchParams.get("style");

  const supabase = await createClient();
  const { data, error } = await supabase.from("style_briefs").select("*");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const briefs = data ?? [];

  if (styleParam) {
    const match = briefs.find((b) => b.style_key === styleParam);
    return NextResponse.json({ brief: match ?? briefs[0] ?? null });
  }

  if (input) {
    for (const brief of briefs) {
      if (
        (brief.match_terms ?? []).some((term: string) =>
          input.includes(term.toLowerCase())
        )
      ) {
        return NextResponse.json({ brief });
      }
    }
  }

  return NextResponse.json({ brief: briefs[0] ?? null });
}
