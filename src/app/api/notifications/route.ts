import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(30);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ items: data ?? [] });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: { id?: string; markAllRead?: boolean };
  try {
    body = (await request.json()) as { id?: string; markAllRead?: boolean };
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  if (body.markAllRead) {
    await supabase
      .from("notifications")
      .update({ unread: false })
      .eq("user_id", user.id)
      .eq("unread", true);
    return NextResponse.json({ ok: true });
  }
  if (body.id) {
    await supabase
      .from("notifications")
      .update({ unread: false })
      .eq("user_id", user.id)
      .eq("id", body.id);
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "Nothing to do" }, { status: 400 });
}
