import type { Bilingual } from "./contractors";

export type MaterialTier = "basic" | "standard" | "premium";

export type MaterialItem = {
  id: string;
  category: Bilingual;
  name: Bilingual;
  brand?: string;
  tier: MaterialTier;
  unit: Bilingual;
  qty: number;
  unitPrice: number;
  alternatives?: { name: Bilingual; tier: MaterialTier; unitPrice: number }[];
};

export const MATERIALS: MaterialItem[] = [
  {
    id: "m1",
    category: "Walls",
    name: "Low-VOC paint (beige)",
    brand: "Benjamin Moore",
    tier: "premium",
    unit: "L",
    qty: 24,
    unitPrice: 28000,
    alternatives: [
      { name: "Eco paint (basic)", tier: "standard", unitPrice: 18000 },
      { name: "Standard latex", tier: "basic", unitPrice: 9500 },
    ],
  },
  {
    id: "m2",
    category: "Floor",
    name: "Engineered oak floor",
    brand: "Gujung Maru",
    tier: "premium",
    unit: "m²",
    qty: 78,
    unitPrice: 145000,
    alternatives: [
      { name: "Laminate oak", tier: "standard", unitPrice: 78000 },
      { name: "Vinyl sheet", tier: "basic", unitPrice: 18000 },
    ],
  },
  {
    id: "m3",
    category: "Lighting",
    name: "LED downlight 7W",
    brand: "Philips",
    tier: "standard",
    unit: "ea",
    qty: 22,
    unitPrice: 18000,
    alternatives: [
      { name: "Dimmable LED downlight", tier: "premium", unitPrice: 38000 },
      { name: "Standard LED", tier: "basic", unitPrice: 7500 },
    ],
  },
  {
    id: "m4",
    category: "Kitchen",
    name: "Birch ply cabinets + quartz top",
    tier: "premium",
    unit: "set",
    qty: 1,
    unitPrice: 4800000,
    alternatives: [
      { name: "MDF + laminate top", tier: "standard", unitPrice: 2900000 },
      { name: "PB + faux top", tier: "basic", unitPrice: 1700000 },
    ],
  },
  {
    id: "m5",
    category: "Finishing",
    name: "Skirting + molding package",
    tier: "standard",
    unit: "set",
    qty: 1,
    unitPrice: 1200000,
    alternatives: [
      { name: "Hidden molding pkg", tier: "premium", unitPrice: 2400000 },
      { name: "Basic molding", tier: "basic", unitPrice: 600000 },
    ],
  },
];

export const COST_BENCHMARK = {
  ourQuote: 18250000,
  marketAvg: 24800000,
  lowballQuote: 11900000,
  warning:
    "60% of lowball quotes silently downgrade material grade. Compare specified materials against site photos.",
};

export type CostBenchmark = typeof COST_BENCHMARK;

// ─── Per-style material breakdowns ────────────────────────────
// Five Random scenario variants, in the same order as
// IMAGES.scenarios.random.styles in src/lib/mock/images.ts.
//
// Each entry derives from analyzing the visual delta between the
// W8 reference space and the AI-rendered style image:
//   • Surface treatment (wall paint vs. paneling vs. textured)
//   • Floor change (oak / walnut / laminate / bamboo)
//   • Lighting density and warmth
//   • Built-ins (kitchen, shelving, counter)
//   • Finishing trim level

const warmMinimalismMaterials: MaterialItem[] = [
  {
    id: "wm-walls",
    category: "Walls",
    name: "Low-VOC paint (warm beige)",
    brand: "Benjamin Moore",
    tier: "premium",
    unit: "L",
    qty: 22,
    unitPrice: 28000,
    alternatives: [
      { name: "Eco paint (basic)", tier: "standard", unitPrice: 18000 },
      { name: "Standard latex", tier: "basic", unitPrice: 9500 },
    ],
  },
  {
    id: "wm-floor",
    category: "Floor",
    name: "Engineered oak (light)",
    brand: "Gujung Maru",
    tier: "premium",
    unit: "m²",
    qty: 78,
    unitPrice: 145000,
    alternatives: [
      { name: "Laminate oak", tier: "standard", unitPrice: 78000 },
      { name: "Vinyl sheet", tier: "basic", unitPrice: 18000 },
    ],
  },
  {
    id: "wm-light",
    category: "Lighting",
    name: "Dimmable LED downlight 3000K",
    brand: "Philips Hue",
    tier: "premium",
    unit: "ea",
    qty: 14,
    unitPrice: 38000,
    alternatives: [
      { name: "Standard LED downlight", tier: "standard", unitPrice: 18000 },
      { name: "Generic LED", tier: "basic", unitPrice: 7500 },
    ],
  },
  {
    id: "wm-kitchen",
    category: "Kitchen",
    name: "Birch ply cabinets + quartz",
    tier: "premium",
    unit: "set",
    qty: 1,
    unitPrice: 5200000,
    alternatives: [
      { name: "MDF + laminate", tier: "standard", unitPrice: 3100000 },
      { name: "PB + faux top", tier: "basic", unitPrice: 1800000 },
    ],
  },
  {
    id: "wm-finish",
    category: "Finishing",
    name: "Hidden minimal molding",
    tier: "premium",
    unit: "set",
    qty: 1,
    unitPrice: 2400000,
    alternatives: [
      { name: "Standard molding", tier: "standard", unitPrice: 1200000 },
      { name: "Basic molding", tier: "basic", unitPrice: 600000 },
    ],
  },
];

const scandinavianMaterials: MaterialItem[] = [
  {
    id: "sc-walls",
    category: "Walls",
    name: "Low-VOC paint (snow white)",
    brand: "Dulux",
    tier: "standard",
    unit: "L",
    qty: 24,
    unitPrice: 18000,
    alternatives: [
      { name: "Premium low-VOC", tier: "premium", unitPrice: 28000 },
      { name: "Standard latex", tier: "basic", unitPrice: 9500 },
    ],
  },
  {
    id: "sc-floor",
    category: "Floor",
    name: "Laminate (light birch)",
    brand: "Donghwa Natural",
    tier: "standard",
    unit: "m²",
    qty: 78,
    unitPrice: 78000,
    alternatives: [
      { name: "Engineered oak", tier: "premium", unitPrice: 145000 },
      { name: "Vinyl sheet", tier: "basic", unitPrice: 18000 },
    ],
  },
  {
    id: "sc-light",
    category: "Lighting",
    name: "Pendant + downlight 4000K",
    brand: "IKEA",
    tier: "standard",
    unit: "ea",
    qty: 18,
    unitPrice: 22000,
    alternatives: [
      { name: "Designer pendant", tier: "premium", unitPrice: 65000 },
      { name: "Generic LED", tier: "basic", unitPrice: 7500 },
    ],
  },
  {
    id: "sc-kitchen",
    category: "Kitchen",
    name: "White doors + laminate top",
    brand: "Hanssem",
    tier: "standard",
    unit: "set",
    qty: 1,
    unitPrice: 2900000,
    alternatives: [
      { name: "Birch ply + quartz", tier: "premium", unitPrice: 4800000 },
      { name: "PB + faux top", tier: "basic", unitPrice: 1700000 },
    ],
  },
  {
    id: "sc-finish",
    category: "Finishing",
    name: "Simple molding + skirting",
    tier: "standard",
    unit: "set",
    qty: 1,
    unitPrice: 1100000,
    alternatives: [
      { name: "Hidden molding pkg", tier: "premium", unitPrice: 2400000 },
      { name: "Basic molding", tier: "basic", unitPrice: 600000 },
    ],
  },
];

const modernVintageMaterials: MaterialItem[] = [
  {
    id: "mv-walls",
    category: "Walls",
    name: "Deep matte paint (forest)",
    brand: "Farrow & Ball",
    tier: "premium",
    unit: "L",
    qty: 26,
    unitPrice: 42000,
    alternatives: [
      { name: "Premium low-VOC", tier: "standard", unitPrice: 28000 },
      { name: "Standard latex", tier: "basic", unitPrice: 9500 },
    ],
  },
  {
    id: "mv-floor",
    category: "Floor",
    name: "Engineered walnut (dark)",
    brand: "Gujung Maru",
    tier: "premium",
    unit: "m²",
    qty: 78,
    unitPrice: 168000,
    alternatives: [
      { name: "Laminate walnut", tier: "standard", unitPrice: 88000 },
      { name: "Vinyl dark", tier: "basic", unitPrice: 22000 },
    ],
  },
  {
    id: "mv-light",
    category: "Lighting",
    name: "Brass pendants + dimming 2700K",
    brand: "Mid-century Modern",
    tier: "premium",
    unit: "ea",
    qty: 16,
    unitPrice: 58000,
    alternatives: [
      { name: "Metal pendant", tier: "standard", unitPrice: 32000 },
      { name: "Generic LED", tier: "basic", unitPrice: 7500 },
    ],
  },
  {
    id: "mv-kitchen",
    category: "Kitchen",
    name: "Walnut veneer + brass pulls",
    tier: "premium",
    unit: "set",
    qty: 1,
    unitPrice: 6400000,
    alternatives: [
      { name: "MDF + laminate", tier: "standard", unitPrice: 3200000 },
      { name: "PB + faux top", tier: "basic", unitPrice: 1800000 },
    ],
  },
  {
    id: "mv-finish",
    category: "Finishing",
    name: "Detailed crown molding",
    tier: "premium",
    unit: "set",
    qty: 1,
    unitPrice: 2800000,
    alternatives: [
      { name: "Standard molding", tier: "standard", unitPrice: 1200000 },
      { name: "Basic molding", tier: "basic", unitPrice: 600000 },
    ],
  },
];

const homeCafeMaterials: MaterialItem[] = [
  {
    id: "hc-walls",
    category: "Walls",
    name: "Textured plaster (latte)",
    brand: "Rakeli",
    tier: "premium",
    unit: "L",
    qty: 24,
    unitPrice: 32000,
    alternatives: [
      { name: "Low-VOC paint", tier: "standard", unitPrice: 18000 },
      { name: "Standard latex", tier: "basic", unitPrice: 9500 },
    ],
  },
  {
    id: "hc-floor",
    category: "Floor",
    name: "Engineered oak (warm)",
    brand: "Gujung Maru",
    tier: "premium",
    unit: "m²",
    qty: 78,
    unitPrice: 152000,
    alternatives: [
      { name: "Laminate oak", tier: "standard", unitPrice: 78000 },
      { name: "Vinyl sheet", tier: "basic", unitPrice: 18000 },
    ],
  },
  {
    id: "hc-light",
    category: "Lighting",
    name: "Pendant + wash light 2700K",
    brand: "Modular",
    tier: "premium",
    unit: "ea",
    qty: 18,
    unitPrice: 42000,
    alternatives: [
      { name: "Standard LED downlight", tier: "standard", unitPrice: 18000 },
      { name: "Generic LED", tier: "basic", unitPrice: 7500 },
    ],
  },
  {
    id: "hc-kitchen",
    category: "Kitchen",
    name: "Open shelving + cafe counter",
    tier: "standard",
    unit: "set",
    qty: 1,
    unitPrice: 3600000,
    alternatives: [
      { name: "Full birch ply kitchen", tier: "premium", unitPrice: 5400000 },
      { name: "PB + faux top", tier: "basic", unitPrice: 1800000 },
    ],
  },
  {
    id: "hc-finish",
    category: "Finishing",
    name: "Chair rail + detail trim",
    tier: "standard",
    unit: "set",
    qty: 1,
    unitPrice: 1900000,
    alternatives: [
      { name: "Hidden molding pkg", tier: "premium", unitPrice: 2400000 },
      { name: "Basic molding", tier: "basic", unitPrice: 600000 },
    ],
  },
];

const naturalPlanteriorMaterials: MaterialItem[] = [
  {
    id: "np-walls",
    category: "Walls",
    name: "Clay paint (off-white)",
    brand: "Earthborn",
    tier: "premium",
    unit: "L",
    qty: 24,
    unitPrice: 26000,
    alternatives: [
      { name: "Low-VOC paint", tier: "standard", unitPrice: 18000 },
      { name: "Standard latex", tier: "basic", unitPrice: 9500 },
    ],
  },
  {
    id: "np-floor",
    category: "Floor",
    name: "Bamboo flooring (light)",
    brand: "Eco Maru",
    tier: "standard",
    unit: "m²",
    qty: 78,
    unitPrice: 95000,
    alternatives: [
      { name: "Engineered oak", tier: "premium", unitPrice: 145000 },
      { name: "Vinyl wood", tier: "basic", unitPrice: 20000 },
    ],
  },
  {
    id: "np-light",
    category: "Lighting",
    name: "Full-spectrum LED + grow spot",
    brand: "Sansi",
    tier: "standard",
    unit: "ea",
    qty: 22,
    unitPrice: 24000,
    alternatives: [
      { name: "Dimmable designer LED", tier: "premium", unitPrice: 42000 },
      { name: "Generic LED", tier: "basic", unitPrice: 7500 },
    ],
  },
  {
    id: "np-kitchen",
    category: "Kitchen",
    name: "Natural wood + herb garden",
    tier: "standard",
    unit: "set",
    qty: 1,
    unitPrice: 3300000,
    alternatives: [
      { name: "Birch ply + quartz", tier: "premium", unitPrice: 4800000 },
      { name: "PB + faux top", tier: "basic", unitPrice: 1700000 },
    ],
  },
  {
    id: "np-finish",
    category: "Finishing",
    name: "Natural wood trim + planter shelf",
    tier: "standard",
    unit: "set",
    qty: 1,
    unitPrice: 1500000,
    alternatives: [
      { name: "Hidden molding pkg", tier: "premium", unitPrice: 2400000 },
      { name: "Basic molding", tier: "basic", unitPrice: 600000 },
    ],
  },
];

// Order matches IMAGES.scenarios.random.styles:
// [warm, scandinavian, vintage, cafe, natural]
export const RANDOM_STYLE_MATERIALS: MaterialItem[][] = [
  warmMinimalismMaterials,
  scandinavianMaterials,
  modernVintageMaterials,
  homeCafeMaterials,
  naturalPlanteriorMaterials,
];

export function totalCost(items: MaterialItem[]): number {
  return items.reduce((acc, m) => acc + m.unitPrice * m.qty, 0);
}

// Cost benchmarks per Random variant — derived from each style's
// Habitus quote, with market avg ~36% above and lowball ~34% below.
export const RANDOM_STYLE_BENCHMARKS: CostBenchmark[] =
  RANDOM_STYLE_MATERIALS.map((items) => {
    const ourQuote = totalCost(items);
    return {
      ourQuote,
      marketAvg: Math.round((ourQuote * 1.36) / 10000) * 10000,
      lowballQuote: Math.round((ourQuote * 0.66) / 10000) * 10000,
      warning: COST_BENCHMARK.warning,
    };
  });

export const CONTRACT_CHECKLIST: string[] = [
  "Down payment must not exceed 30% of total",
  "Stage-based payment in 4 parts after inspection",
  "Material substitution requires prior written consent",
  "Delay penalty: 0.1% per day clearly specified",
  "Refund formula in case of work suspension",
  "Exact contractor name and business number",
  "Daily site photo updates obligation",
  "Whether debris disposal is included",
  "Worker safety insurance confirmation",
  "Contractor responsible for notifying neighbors",
  "Mediation via Consumer Agency or Habitus",
  "Final inspection checklist attached",
  "Final payment only after final inspection passes",
];
