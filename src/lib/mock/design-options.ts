import type { Bilingual } from "./contractors";
import { IMAGES } from "./images";

export type StyleKey = "midcentury" | "minimalist" | "industrial" | "scandinavian";

export type OptionCategory = "style" | "tone" | "flooring" | "wall";

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
  { key: "style", label: { ko: "스타일", en: "Style" } },
  { key: "tone", label: { ko: "컬러 톤", en: "Color tone" } },
  { key: "flooring", label: { ko: "바닥재", en: "Flooring" } },
  { key: "wall", label: { ko: "벽 · 마감", en: "Wall / finish" } },
];

export const DESIGN_OPTIONS: DesignOption[] = [
  // ── Style ─────────────────────────────────────────────────
  {
    id: "style-mc",
    category: "style",
    styleKey: "midcentury",
    name: { ko: "미드센추리 모던", en: "Mid-century Modern" },
    description: { ko: "따뜻한 우드, 곡선 가구", en: "Warm wood, curved forms" },
    image: IMAGES.moodboard.midcentury[0],
  },
  {
    id: "style-min",
    category: "style",
    styleKey: "minimalist",
    name: { ko: "미니멀 화이트", en: "Minimalist White" },
    description: { ko: "정돈된 라인, 미니멀 라이프", en: "Clean lines, white tones" },
    image: IMAGES.moodboard.minimalist[0],
  },
  {
    id: "style-ind",
    category: "style",
    styleKey: "industrial",
    name: { ko: "인더스트리얼", en: "Industrial" },
    description: { ko: "노출 콘크리트, 메탈 디테일", en: "Exposed concrete, metal" },
    image: IMAGES.moodboard.industrial[0],
  },
  {
    id: "style-sc",
    category: "style",
    styleKey: "scandinavian",
    name: { ko: "스칸디나비안", en: "Scandinavian" },
    description: { ko: "밝은 톤, 자연 소재", en: "Bright tones, natural" },
    image: IMAGES.moodboard.scandinavian[0],
  },

  // ── Tone (color swatches) ─────────────────────────────────
  {
    id: "tone-warm-beige",
    category: "tone",
    styleKey: "midcentury",
    name: { ko: "따뜻한 베이지", en: "Warm beige" },
    description: { ko: "포근하고 안정적", en: "Cozy and stable" },
    swatch: "#E6D7C0",
  },
  {
    id: "tone-natural-white",
    category: "tone",
    styleKey: "scandinavian",
    name: { ko: "내추럴 화이트", en: "Natural white" },
    description: { ko: "밝고 깨끗한 베이스", en: "Bright clean base" },
    swatch: "#F5F0E8",
  },
  {
    id: "tone-cool-gray",
    category: "tone",
    styleKey: "minimalist",
    name: { ko: "쿨 그레이", en: "Cool gray" },
    description: { ko: "차분하고 모던", en: "Calm and modern" },
    swatch: "#C5CAD0",
  },
  {
    id: "tone-charcoal",
    category: "tone",
    styleKey: "industrial",
    name: { ko: "차콜 · 블랙", en: "Charcoal" },
    description: { ko: "강렬하고 시크한 분위기", en: "Bold and sleek" },
    swatch: "#3A3633",
  },
  {
    id: "tone-terracotta",
    category: "tone",
    styleKey: "midcentury",
    name: { ko: "테라코타", en: "Terracotta" },
    description: { ko: "따뜻한 액센트 컬러", en: "Warm accent color" },
    swatch: "#C97B5A",
  },
  {
    id: "tone-deep-green",
    category: "tone",
    styleKey: "scandinavian",
    name: { ko: "딥 그린", en: "Deep green" },
    description: { ko: "차분한 자연 액센트", en: "Calm natural accent" },
    swatch: "#3F4A3C",
  },

  // ── Flooring ──────────────────────────────────────────────
  {
    id: "floor-oak",
    category: "flooring",
    styleKey: "midcentury",
    name: { ko: "오크 원목 마루", en: "Oak hardwood" },
    description: { ko: "프리미엄 · ㎡당 ₩145,000", en: "Premium · $109/m²" },
    image: IMAGES.moodboard.midcentury[1] ?? IMAGES.moodboard.midcentury[0],
  },
  {
    id: "floor-walnut",
    category: "flooring",
    styleKey: "industrial",
    name: { ko: "월넛 원목", en: "Walnut hardwood" },
    description: { ko: "프리미엄 · 깊은 톤", en: "Premium · deep tone" },
    image: IMAGES.moodboard.industrial[1] ?? IMAGES.moodboard.industrial[0],
  },
  {
    id: "floor-laminate-oak",
    category: "flooring",
    styleKey: "scandinavian",
    name: { ko: "강마루 (오크 패턴)", en: "Laminate (oak)" },
    description: { ko: "스탠다드 · ㎡당 ₩78,000", en: "Standard · $59/m²" },
    image: IMAGES.moodboard.scandinavian[1] ?? IMAGES.moodboard.scandinavian[0],
  },
  {
    id: "floor-concrete",
    category: "flooring",
    styleKey: "industrial",
    name: { ko: "노출 콘크리트", en: "Polished concrete" },
    description: { ko: "프리미엄 · 인더스트리얼 톤", en: "Premium · industrial" },
    image: IMAGES.moodboard.industrial[2] ?? IMAGES.moodboard.industrial[0],
  },
  {
    id: "floor-white-tile",
    category: "flooring",
    styleKey: "minimalist",
    name: { ko: "화이트 타일", en: "White tile" },
    description: { ko: "주방 · 욕실 추천", en: "Kitchen · bath" },
    image: IMAGES.moodboard.minimalist[1] ?? IMAGES.moodboard.minimalist[0],
  },

  // ── Wall ──────────────────────────────────────────────────
  {
    id: "wall-paint-eco",
    category: "wall",
    styleKey: "minimalist",
    name: { ko: "친환경 페인트", en: "Low-VOC paint" },
    description: { ko: "Benjamin Moore · 알러지 친화", en: "Benjamin Moore · safe" },
    image: IMAGES.moodboard.minimalist[2] ?? IMAGES.moodboard.minimalist[0],
  },
  {
    id: "wall-wood-panel",
    category: "wall",
    styleKey: "midcentury",
    name: { ko: "우드 패널", en: "Wood paneling" },
    description: { ko: "월넛 / 오크 선택 가능", en: "Walnut or oak" },
    image: IMAGES.moodboard.midcentury[2] ?? IMAGES.moodboard.midcentury[0],
  },
  {
    id: "wall-tile-accent",
    category: "wall",
    styleKey: "industrial",
    name: { ko: "타일 액센트 월", en: "Tile accent wall" },
    description: { ko: "주방 · 욕실 포인트", en: "Kitchen / bath accent" },
    image: IMAGES.moodboard.industrial[3] ?? IMAGES.moodboard.industrial[0],
  },
  {
    id: "wall-natural-paper",
    category: "wall",
    styleKey: "scandinavian",
    name: { ko: "내추럴 벽지", en: "Natural wallpaper" },
    description: { ko: "텍스처 패턴 · 침실 추천", en: "Textured · bedroom" },
    image: IMAGES.moodboard.scandinavian[2] ?? IMAGES.moodboard.scandinavian[0],
  },
];

export function detectStyleFromOptions(selectedIds: string[]): StyleKey {
  const counts: Record<StyleKey, number> = {
    midcentury: 0,
    minimalist: 0,
    industrial: 0,
    scandinavian: 0,
  };
  // explicit style picks weight more
  for (const id of selectedIds) {
    const opt = DESIGN_OPTIONS.find((o) => o.id === id);
    if (!opt) continue;
    counts[opt.styleKey] += opt.category === "style" ? 3 : 1;
  }
  let best: StyleKey = "midcentury";
  let max = -1;
  (Object.keys(counts) as StyleKey[]).forEach((k) => {
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
