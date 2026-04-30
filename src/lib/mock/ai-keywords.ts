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
    match: ["미드", "mid", "센추리", "century", "우드", "wood"],
    brief: {
      styleKey: "midcentury",
      styleLabel: { ko: "미드센추리 모던", en: "Mid-century Modern" },
      moodImages: IMAGES.moodboard.midcentury,
      intro: {
        ko: "따뜻한 우드톤, 곡선 가구, 자연광이 특징인 미드센추리 모던 스타일로 잡았어요.",
        en: "I picked Mid-century Modern: warm woods, curved furniture, plenty of natural light.",
      },
    },
  },
  {
    match: ["미니멀", "minimal", "화이트", "white", "심플", "simple"],
    brief: {
      styleKey: "minimalist",
      styleLabel: { ko: "미니멀 화이트", en: "Minimalist White" },
      moodImages: IMAGES.moodboard.minimalist,
      intro: {
        ko: "깨끗한 화이트 톤과 정돈된 라인의 미니멀 스타일을 구성했어요.",
        en: "I curated a minimalist setup: clean whites, restrained lines, calm space.",
      },
    },
  },
  {
    match: ["인더스트리", "industrial", "콘크리트", "concrete", "빈티지", "vintage"],
    brief: {
      styleKey: "industrial",
      styleLabel: { ko: "인더스트리얼", en: "Industrial" },
      moodImages: IMAGES.moodboard.industrial,
      intro: {
        ko: "노출 콘크리트와 메탈 디테일이 어우러진 인더스트리얼 무드를 모았어요.",
        en: "Exposed concrete and metal details — an industrial mood board for you.",
      },
    },
  },
  {
    match: ["스칸디", "skandi", "scandinavian", "북유럽", "natural"],
    brief: {
      styleKey: "scandinavian",
      styleLabel: { ko: "스칸디나비안", en: "Scandinavian" },
      moodImages: IMAGES.moodboard.scandinavian,
      intro: {
        ko: "밝은 톤과 자연 소재가 어우러진 스칸디나비안 무드입니다.",
        en: "Bright tones and natural materials — Scandinavian, distilled.",
      },
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
    text: {
      ko: "현재 도장 단계입니다. 5월 12일 완공 예정이며, 일정 지연 없이 진행 중이에요.",
      en: "Currently in painting. Completion on May 12, on schedule.",
    },
  },
  {
    tKey: "tracking.chat.aiQuick.cost",
    text: {
      ko: "현재까지 견적 대비 추가 비용 0원입니다. 다만 조명 추가 옵션 검토 시 약 ₩320,000 변동 가능성이 있어요.",
      en: "No additional costs so far. The optional extra lights would add ~₩320,000 if approved.",
    },
  },
  {
    tKey: "tracking.chat.aiQuick.material",
    text: {
      ko: "약속된 자작 합판, 친환경 페인트 모두 시방대로 들어갔습니다. 자재 사진도 업데이트 #2에서 확인 가능해요.",
      en: "Birch ply and low-VOC paint installed as specified. See update #2 for photo evidence.",
    },
  },
  {
    tKey: "tracking.chat.aiQuick.next",
    text: {
      ko: "도장 2차 → 마감 단계로 넘어가요. 4월 30일에 걸레받이 설치, 5월 5일에 청소·검수 진행 예정입니다.",
      en: "Second paint coat → finishing. Skirting on Apr 30, cleanup & inspection on May 5.",
    },
  },
];
