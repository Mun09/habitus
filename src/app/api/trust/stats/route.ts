import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const revalidate = 300;

const REASONS = [
  "quote_fraud",
  "material_swap",
  "abandonment",
  "false_license",
  "abuse",
] as const;

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ban_records")
    .select("reason, created_at")
    .order("created_at", { ascending: true });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const monthly = new Map<string, number>();
  const reasonCounts: Record<string, number> = Object.fromEntries(
    REASONS.map((r) => [r, 0])
  );

  for (const row of data ?? []) {
    const month = String(row.created_at).slice(0, 7);
    monthly.set(month, (monthly.get(month) ?? 0) + 1);
    reasonCounts[row.reason] = (reasonCounts[row.reason] ?? 0) + 1;
  }

  return NextResponse.json({
    total: data?.length ?? 0,
    monthly: Array.from(monthly.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({ month, count })),
    byReason: REASONS.map((r) => ({ reason: r, count: reasonCounts[r] ?? 0 })),
  });
}
