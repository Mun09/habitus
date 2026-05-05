import type { Bilingual } from "./contractors";
import { IMAGES } from "./images";

export type StyleKey =
  | "midcentury"
  | "minimalist"
  | "industrial"
  | "scandinavian"
  | "random";

export type OptionCategory =
  | "style"
  | "tone"
  | "flooring"
  | "wall"
  | "furniture";

export type DesignOption = {
  id: string;
  category: OptionCategory;
  styleKey: StyleKey;
  name: Bilingual;
  description: Bilingual;
  image?: string;
  swatch?: string;
};

export const CATEGORIES: { key: OptionCategory; label: Bilingual }[] = [
  { key: "style", label: "Style" },
  { key: "tone", label: "Color tone" },
  { key: "flooring", label: "Flooring" },
  { key: "wall", label: "Wall / finish" },
  { key: "furniture", label: "Add furniture" },
];

export const STYLE_RANDOM_ID = "style-random";

export const DESIGN_OPTIONS: DesignOption[] = [
  // ── Style ─────────────────────────────────────────────────
  {
    id: STYLE_RANDOM_ID,
    category: "style",
    styleKey: "random",
    name: "Random (5 styles)",
    description: "AI proposes 5 styles at once",
    image: IMAGES.scenarios.random.styles[0],
  },
  {
    id: "style-mc",
    category: "style",
    styleKey: "midcentury",
    name: "Mid-century Modern",
    description: "Warm wood, curved forms",
    image: IMAGES.moodboard.midcentury[0],
  },
  {
    id: "style-min",
    category: "style",
    styleKey: "minimalist",
    name: "Minimalist White",
    description: "Clean lines, white tones",
    image: IMAGES.moodboard.minimalist[0],
  },
  {
    id: "style-ind",
    category: "style",
    styleKey: "industrial",
    name: "Industrial",
    description: "Exposed concrete, metal",
    image: IMAGES.moodboard.industrial[0],
  },
  {
    id: "style-sc",
    category: "style",
    styleKey: "scandinavian",
    name: "Scandinavian",
    description: "Bright tones, natural",
    image: IMAGES.moodboard.scandinavian[0],
  },

  // ── Tone (color swatches) ─────────────────────────────────
  {
    id: "tone-warm-beige",
    category: "tone",
    styleKey: "midcentury",
    name: "Warm beige",
    description: "Cozy and stable",
    swatch: "#E6D7C0",
  },
  {
    id: "tone-natural-white",
    category: "tone",
    styleKey: "scandinavian",
    name: "Natural white",
    description: "Bright clean base",
    swatch: "#F5F0E8",
  },
  {
    id: "tone-cool-gray",
    category: "tone",
    styleKey: "minimalist",
    name: "Cool gray",
    description: "Calm and modern",
    swatch: "#C5CAD0",
  },
  {
    id: "tone-charcoal",
    category: "tone",
    styleKey: "industrial",
    name: "Charcoal",
    description: "Bold and sleek",
    swatch: "#3A3633",
  },
  {
    id: "tone-terracotta",
    category: "tone",
    styleKey: "midcentury",
    name: "Terracotta",
    description: "Warm accent color",
    swatch: "#C97B5A",
  },
  {
    id: "tone-deep-green",
    category: "tone",
    styleKey: "scandinavian",
    name: "Deep green",
    description: "Calm natural accent",
    swatch: "#3F4A3C",
  },

  // ── Flooring ──────────────────────────────────────────────
  {
    id: "floor-oak",
    category: "flooring",
    styleKey: "midcentury",
    name: "Oak hardwood",
    description: "Premium · $109/m²",
    image:
      "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "floor-walnut",
    category: "flooring",
    styleKey: "industrial",
    name: "Walnut hardwood",
    description: "Premium · deep tone",
    image:
      "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "floor-laminate-oak",
    category: "flooring",
    styleKey: "scandinavian",
    name: "Laminate (oak)",
    description: "Standard · $59/m²",
    image:
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "floor-concrete",
    category: "flooring",
    styleKey: "industrial",
    name: "Polished concrete",
    description: "Premium · industrial",
    image:
      "https://images.unsplash.com/photo-1517414622240-71b45a5d8e36?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "floor-white-tile",
    category: "flooring",
    styleKey: "minimalist",
    name: "White tile",
    description: "Kitchen · bath",
    image:
      "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=800&q=80",
  },

  // ── Wall ──────────────────────────────────────────────────
  {
    id: "wall-paint-eco",
    category: "wall",
    styleKey: "minimalist",
    name: "Low-VOC paint",
    description: "Benjamin Moore · safe",
    image:
      "https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "wall-wood-panel",
    category: "wall",
    styleKey: "midcentury",
    name: "Wood paneling",
    description: "Walnut or oak",
    image:
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "wall-tile-accent",
    category: "wall",
    styleKey: "industrial",
    name: "Tile accent wall",
    description: "Kitchen / bath accent",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "wall-natural-paper",
    category: "wall",
    styleKey: "scandinavian",
    name: "Natural wallpaper",
    description: "Textured · bedroom",
    image:
      "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=800&q=80",
  },

  // ── Furniture (user-added pieces) ─────────────────────────
  {
    id: "furniture-chair",
    category: "furniture",
    styleKey: "random",
    name: "Lounge chair",
    description: "Curved wood frame · fabric seat",
    image: IMAGES.scenarios.random.furniture.chair,
  },
  {
    id: "furniture-lamp",
    category: "furniture",
    styleKey: "random",
    name: "Floor lamp",
    description: "Warm ambient light",
    image: IMAGES.scenarios.random.furniture.lamp,
  },
];

export function detectStyleFromOptions(selectedIds: string[]): StyleKey {
  // explicit Random pick short-circuits — produce 5 styles at once
  if (selectedIds.includes(STYLE_RANDOM_ID)) return "random";

  const counts: Record<Exclude<StyleKey, "random">, number> = {
    midcentury: 0,
    minimalist: 0,
    industrial: 0,
    scandinavian: 0,
  };
  // explicit style picks weight more
  for (const id of selectedIds) {
    const opt = DESIGN_OPTIONS.find((o) => o.id === id);
    if (!opt || opt.styleKey === "random") continue;
    counts[opt.styleKey] += opt.category === "style" ? 3 : 1;
  }
  let best: Exclude<StyleKey, "random"> = "midcentury";
  let max = -1;
  (Object.keys(counts) as Array<Exclude<StyleKey, "random">>).forEach((k) => {
    if (counts[k] > max) {
      max = counts[k];
      best = k;
    }
  });
  return best;
}

export function getOptionImagesForGenerating(selectedIds: string[]): string[] {
  return selectedIds
    .map((id) => DESIGN_OPTIONS.find((o) => o.id === id))
    .filter((o): o is DesignOption => !!o && !!o.image)
    .map((o) => o.image!);
}
