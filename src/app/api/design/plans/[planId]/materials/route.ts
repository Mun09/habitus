import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type Params = { planId: string };

export async function GET(
  request: Request,
  context: { params: Promise<Params> }
) {
  const { planId } = await context.params;
  const url = new URL(request.url);
  const variantIdx = Number(url.searchParams.get("variant") ?? "0") || 0;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // RLS gates the plan to the owner; the join below picks the variant
  // slice of the BOM snapshot and the per-base alternatives.
  const { data: rows, error } = await supabase
    .from("design_plan_materials")
    .select(
      `
        id, qty, unit_price, tier, variant_idx,
        material_catalog!inner (
          id, code, category, name, brand, unit, slot_key, style_key,
          material_alternatives ( name, tier, unit_price )
        )
      `
    )
    .eq("plan_id", planId)
    .eq("variant_idx", variantIdx);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  type Alt = { name: string; tier: string; unit_price: number };
  type Catalog = {
    id: string;
    code: string;
    category: string;
    name: string;
    brand: string | null;
    unit: string;
    slot_key: string;
    style_key: string;
    material_alternatives: Alt[];
  };
  type Row = {
    id: string;
    qty: number;
    unit_price: number;
    tier: string;
    variant_idx: number;
    material_catalog: Catalog | Catalog[] | null;
  };

  const items = ((rows ?? []) as unknown as Row[]).map((row) => {
    const catalog = Array.isArray(row.material_catalog)
      ? row.material_catalog[0]
      : row.material_catalog;
    if (!catalog) return null;
    return {
      id: row.id,
      category: catalog.category,
      name: catalog.name,
      brand: catalog.brand,
      tier: row.tier,
      unit: catalog.unit,
      qty: row.qty,
      unitPrice: row.unit_price,
      alternatives: (catalog.material_alternatives ?? []).map((a) => ({
        name: a.name,
        tier: a.tier,
        unitPrice: a.unit_price,
      })),
    };
  }).filter((x): x is NonNullable<typeof x> => x !== null);

  const ourQuote = items.reduce((acc, m) => acc + m.unitPrice * m.qty, 0);
  const benchmark = {
    ourQuote,
    marketAvg: Math.round((ourQuote * 1.36) / 10000) * 10000,
    lowballQuote: Math.round((ourQuote * 0.66) / 10000) * 10000,
    warning:
      "60% of lowball quotes silently downgrade material grade. Compare specified materials against site photos.",
  };

  return NextResponse.json({ items, benchmark });
}
