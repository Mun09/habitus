// Builds the natural-language prompt sent to OpenAI gpt-image-1 image.edit,
// derived from the option IDs the user picked in ComposeWizard.
//
// IDs are sourced verbatim from src/lib/mock/design-options.ts.

const STYLE_PROMPTS: Record<string, string> = {
  "style-random":
    "an eclectic interior blending warm minimalism with curated personality",
  "style-mc":
    "a mid-century modern interior with warm walnut and teak wood, organic curved silhouettes, and tactile fabric upholstery",
  "style-min":
    "a serene minimalist interior with crisp white walls, clean architectural lines, and only essential decor",
  "style-ind":
    "an industrial interior with exposed concrete surfaces, black steel framing, and refurbished vintage furniture",
  "style-sc":
    "a Scandinavian interior with bright neutral tones, light pine and ash wood, and cozy hygge-inspired textiles",
};

const TONE_PROMPTS: Record<string, string> = {
  "tone-warm-beige": "warm beige and sand color palette",
  "tone-natural-white": "natural white palette with soft cream highlights",
  "tone-cool-gray": "cool gray palette with subtle silver undertones",
  "tone-charcoal": "deep charcoal palette with matte black accents",
  "tone-terracotta": "terracotta accent palette with earthy clay tones",
  "tone-deep-green": "deep forest green palette with botanical accents",
};

const FLOORING_PROMPTS: Record<string, string> = {
  "floor-oak": "oak hardwood flooring with a satin matte finish",
  "floor-walnut": "rich walnut hardwood flooring with a dark stain",
  "floor-laminate-oak":
    "light oak laminate flooring with a clean wide-plank pattern",
  "floor-concrete":
    "polished concrete flooring with a soft sheen and subtle aggregate texture",
  "floor-white-tile":
    "large-format white porcelain tile flooring with minimal grout lines",
};

const WALL_PROMPTS: Record<string, string> = {
  "wall-paint-eco":
    "smooth low-VOC matte painted walls in a soft off-white shade",
  "wall-wood-panel":
    "vertical wood-paneled feature wall in warm walnut or oak veneer",
  "wall-tile-accent":
    "ceramic tile accent wall with a geometric pattern, focused on one wall only",
  "wall-natural-paper":
    "textured natural-fiber wallpaper with a subtle linen weave",
};

const FURNITURE_PROMPTS: Record<string, string> = {
  "furniture-chair":
    "add a curved-frame lounge chair upholstered in neutral fabric",
  "furniture-lamp":
    "add a warm-toned floor lamp casting soft ambient light",
};

const ALL_PROMPTS: Record<string, string> = {
  ...STYLE_PROMPTS,
  ...TONE_PROMPTS,
  ...FLOORING_PROMPTS,
  ...WALL_PROMPTS,
  ...FURNITURE_PROMPTS,
};

export function buildPrompt(selectedOptionIds: string[], styleKey: string): string {
  const styleId =
    selectedOptionIds.find((id) => id in STYLE_PROMPTS) ?? `style-${styleKey}`;
  const styleSentence = STYLE_PROMPTS[styleId] ?? STYLE_PROMPTS["style-random"];

  const toneParts = selectedOptionIds
    .filter((id) => id in TONE_PROMPTS)
    .map((id) => TONE_PROMPTS[id]);
  const flooringParts = selectedOptionIds
    .filter((id) => id in FLOORING_PROMPTS)
    .map((id) => FLOORING_PROMPTS[id]);
  const wallParts = selectedOptionIds
    .filter((id) => id in WALL_PROMPTS)
    .map((id) => WALL_PROMPTS[id]);
  const furnitureParts = selectedOptionIds
    .filter((id) => id in FURNITURE_PROMPTS)
    .map((id) => FURNITURE_PROMPTS[id]);

  const detailParts = [...toneParts, ...flooringParts, ...wallParts];
  const additions = furnitureParts.length ? furnitureParts.join("; ") : "";

  const lines: string[] = [];
  lines.push(
    `Redesign this interior space as a photorealistic professional render of ${styleSentence}.`
  );
  if (detailParts.length > 0) {
    lines.push(`Material and color direction: ${detailParts.join(", ")}.`);
  }
  if (additions) {
    lines.push(`Furniture additions: ${additions}.`);
  }
  lines.push(
    "Strictly preserve the original room layout, wall positions, windows, doors, and architectural features. Only restyle surfaces, furniture, and decor.",
  );
  lines.push(
    "Natural lighting, high quality, magazine-grade interior photography, sharp focus, balanced composition.",
  );

  return lines.join(" ");
}

export function getKnownOptionPrompt(id: string): string | undefined {
  return ALL_PROMPTS[id];
}

// 5 Random scenario variants, in the same order as
// material_catalog.style_key for the seeded 5 styles.
export const RANDOM_STYLE_VARIANTS = [
  "warm",
  "scandinavian",
  "vintage",
  "cafe",
  "natural",
] as const;

export type RandomStyleVariant = (typeof RANDOM_STYLE_VARIANTS)[number];

const VARIANT_STYLE_SENTENCE: Record<RandomStyleVariant, string> = {
  warm: "a warm minimalism interior with soft beige walls, light oak hardwood, hidden molding, and dimmable downlights",
  scandinavian:
    "a Nordic Scandinavian interior with snow-white walls, light birch laminate flooring, simple molding, and bright pendant lighting",
  vintage:
    "a modern vintage interior with deep forest matte walls, dark walnut flooring, brass-pendant lighting, and detailed crown molding",
  cafe: "a cozy home cafe interior with textured latte plaster walls, warm oak flooring, pendant wash lighting, and an open cafe-counter kitchen",
  natural:
    "a natural planterior interior with off-white clay-paint walls, light bamboo flooring, full-spectrum lighting, planter shelves, and natural wood trim",
};

export function buildPromptForVariant(
  variant: RandomStyleVariant,
  selectedOptionIds: string[]
): string {
  const styleSentence = VARIANT_STYLE_SENTENCE[variant];
  const furnitureParts = selectedOptionIds
    .filter((id) => id in FURNITURE_PROMPTS)
    .map((id) => FURNITURE_PROMPTS[id]);
  const lines: string[] = [
    `Redesign this interior space as a photorealistic professional render of ${styleSentence}.`,
  ];
  if (furnitureParts.length > 0) {
    lines.push(`Furniture additions: ${furnitureParts.join("; ")}.`);
  }
  lines.push(
    "Strictly preserve the original room layout, wall positions, windows, doors, and architectural features. Only restyle surfaces, furniture, and decor."
  );
  lines.push(
    "Natural lighting, high quality, magazine-grade interior photography, sharp focus, balanced composition."
  );
  return lines.join(" ");
}
