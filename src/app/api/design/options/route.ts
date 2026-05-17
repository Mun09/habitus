import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("design_options")
    .select("*")
    .order("category")
    .order("sort_order");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ items: data ?? [] });
}
