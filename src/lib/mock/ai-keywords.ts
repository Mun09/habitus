import type { Bilingual } from "./contractors";
import { IMAGES } from "./images";

export type DesignBrief = {
  styleKey: "midcentury" | "minimalist" | "industrial" | "scandinavian";
  styleLabel: Bilingual;
  moodImages: string[];
  intro: Bilingual;
};

const KEYWORD_MAP: { match: string[]; brief: DesignBrief }[] = [
  {
    match: ["mid", "century", "wood"],
    brief: {
      styleKey: "midcentury",
      styleLabel: "Mid-century Modern",
      moodImages: IMAGES.moodboard.midcentury,
      intro: "I picked Mid-century Modern: warm woods, curved furniture, plenty of natural light.",
    },
  },
  {
    match: ["minimal", "white", "simple"],
    brief: {
      styleKey: "minimalist",
      styleLabel: "Minimalist White",
      moodImages: IMAGES.moodboard.minimalist,
      intro: "I curated a minimalist setup: clean whites, restrained lines, calm space.",
    },
  },
  {
    match: ["industrial", "concrete", "vintage"],
    brief: {
      styleKey: "industrial",
      styleLabel: "Industrial",
      moodImages: IMAGES.moodboard.industrial,
      intro: "Exposed concrete and metal details — an industrial mood board for you.",
    },
  },
  {
    match: ["skandi", "scandinavian", "natural", "nordic"],
    brief: {
      styleKey: "scandinavian",
      styleLabel: "Scandinavian",
      moodImages: IMAGES.moodboard.scandinavian,
      intro: "Bright tones and natural materials — Scandinavian, distilled.",
    },
  },
];

const DEFAULT_BRIEF = KEYWORD_MAP[0].brief;

export function detectBrief(input: string): DesignBrief {
  const lower = input.toLowerCase();
  for (const { match, brief } of KEYWORD_MAP) {
    if (match.some((m) => lower.includes(m.toLowerCase()))) return brief;
  }
  return DEFAULT_BRIEF;
}

export const AI_QUICK_REPLIES: { tKey: string; text: Bilingual }[] = [
  {
    tKey: "tracking.chat.aiQuick.schedule",
    text: "Currently in painting. Completion on May 12, on schedule.",
  },
  {
    tKey: "tracking.chat.aiQuick.cost",
    text: "No additional costs so far. The optional extra lights would add ~₩320,000 if approved.",
  },
  {
    tKey: "tracking.chat.aiQuick.material",
    text: "Birch ply and low-VOC paint installed as specified. See update #2 for photo evidence.",
  },
  {
    tKey: "tracking.chat.aiQuick.next",
    text: "Second paint coat → finishing. Skirting on Apr 30, cleanup & inspection on May 5.",
  },
];
