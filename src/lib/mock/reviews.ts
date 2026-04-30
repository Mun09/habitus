import type { Bilingual } from "./contractors";
import { IMAGES } from "./images";

export type Review = {
  id: string;
  contractorId: string;
  reviewerName: Bilingual;
  reviewerImage: string;
  rating: number;
  date: string;
  verified: boolean;
  title: Bilingual;
  body: Bilingual;
  photos?: string[];
};

const r = (
  id: string,
  contractorId: string,
  rating: number,
  date: string,
  reviewerIdx: number,
  title: Bilingual,
  body: Bilingual,
  photoIdxs?: number[]
): Review => ({
  id,
  contractorId,
  reviewerName: REVIEWER_NAMES[reviewerIdx % REVIEWER_NAMES.length],
  reviewerImage: IMAGES.reviewers[reviewerIdx % IMAGES.reviewers.length],
  rating,
  date,
  verified: true,
  title,
  body,
  photos: photoIdxs?.map((i) => IMAGES.projectCompleted[i % IMAGES.projectCompleted.length]),
});

const REVIEWER_NAMES: Bilingual[] = [
  { ko: "김민지", en: "Minji K." },
  { ko: "박서준", en: "Seojun P." },
  { ko: "이하늘", en: "Haneul L." },
  { ko: "최가은", en: "Gaeun C." },
  { ko: "정도현", en: "Dohyeon J." },
  { ko: "한예진", en: "Yejin H." },
];

export const REVIEWS: Review[] = [
  r(
    "rv-1",
    "kim-warm",
    5,
    "2026-03-12",
    0,
    { ko: "예산도 일정도 정확히 지켰어요", en: "On budget, on schedule" },
    {
      ko: "처음 견적부터 마무리까지 추가비용 0원이었습니다. 사진 업데이트 매일 보내주셔서 안심됐어요.",
      en: "Zero surprise costs from quote to handover. Daily photo updates kept me at ease.",
    },
    [0, 1]
  ),
  r(
    "rv-2",
    "kim-warm",
    5,
    "2026-02-21",
    1,
    { ko: "거실이 잡지 같아요", en: "My living room looks like a magazine" },
    {
      ko: "채광을 잘 살리는 디자인 감각이 정말 뛰어나세요. 작은 평수가 두 배로 넓어 보입니다.",
      en: "Phenomenal eye for natural light. The small space feels twice as large now.",
    },
    [2]
  ),
  r(
    "rv-3",
    "kim-warm",
    4,
    "2026-01-08",
    2,
    { ko: "마감이 깔끔합니다", en: "Crisp finishing" },
    {
      ko: "후속 처리도 빠르게 해주셨어요. 일정이 약간 길어졌지만 결과물 만족.",
      en: "Quick follow-up support. Slight delay, but the result is excellent.",
    }
  ),
  r(
    "rv-4",
    "lee-haus",
    5,
    "2026-03-02",
    3,
    { ko: "친환경 자재 정말 꼼꼼히", en: "Truly eco materials" },
    {
      ko: "아이가 알러지가 있어서 자재가 중요했는데, 친환경 인증서까지 받아 보여주셨어요.",
      en: "My child has allergies — they shared every eco-certification.",
    },
    [3, 4]
  ),
  r(
    "rv-5",
    "lee-haus",
    5,
    "2026-02-14",
    4,
    { ko: "응답이 1시간 이내", en: "Replies within an hour" },
    {
      ko: "퇴근 후 메시지 보내도 늦어도 다음 날 아침에는 답이 와요. 신뢰감 ↑",
      en: "Even after-hours messages get a same-day reply. Trust earned.",
    }
  ),
  r(
    "rv-6",
    "park-rough",
    5,
    "2026-03-19",
    5,
    { ko: "노출 콘크리트 마감이 일품", en: "Exposed concrete finish is art" },
    {
      ko: "카페 시공 경험이 풍부해서인지 디테일 처리가 다릅니다.",
      en: "Years of cafe work shows — the details are on another level.",
    },
    [5]
  ),
  r(
    "rv-7",
    "park-rough",
    4,
    "2026-02-04",
    0,
    { ko: "초반 소통이 약간 어려워요", en: "Communication slow at first" },
    {
      ko: "막상 시작되면 아주 빠르고 정확합니다. 다만 견적 단계 답변이 느린 편.",
      en: "Once kicked off, fast and precise. Just a slow quote phase.",
    }
  ),
  r(
    "rv-8",
    "han-skandi",
    5,
    "2026-03-25",
    1,
    { ko: "가족 친화 디자인의 정석", en: "Family-friendly done right" },
    {
      ko: "아이들 안전까지 고려한 모서리 처리, 너무 감사해요.",
      en: "Even the corner softening for the kids — incredibly thoughtful.",
    },
    [0, 4]
  ),
  r(
    "rv-9",
    "han-skandi",
    5,
    "2026-01-29",
    2,
    { ko: "스칸디 톤 완벽", en: "Scandinavian tone, perfect" },
    {
      ko: "참고 이미지 없이도 제 취향을 정확히 잡아주셨어요.",
      en: "Got my taste right without me even sharing references.",
    }
  ),
  r(
    "rv-10",
    "jung-classic",
    5,
    "2026-03-08",
    3,
    { ko: "큰 평수 신뢰", en: "Trust at scale" },
    {
      ko: "70평 작업이라 걱정했는데 진행 관리가 완벽했습니다.",
      en: "230m² felt risky, but the project management was flawless.",
    },
    [1, 2]
  ),
  r(
    "rv-11",
    "jung-classic",
    4,
    "2026-02-11",
    4,
    { ko: "고급 자재 선택지 풍부", en: "Premium material options" },
    {
      ko: "원하는 톤을 5가지 옵션으로 비교해 주셔서 결정이 쉬웠습니다.",
      en: "Five tone options laid side-by-side. Easy decision.",
    }
  ),
  r(
    "rv-12",
    "min-craft",
    5,
    "2026-03-15",
    5,
    { ko: "원룸인데 대접받았어요", en: "Treated like a big project" },
    {
      ko: "9평 원룸도 정성껏 해주셔서 감동. 무면허지만 검증 시공자라 안심됐어요.",
      en: "30m² studio treated with the same care as a full home. Verified — peace of mind.",
    },
    [3]
  ),
  r(
    "rv-13",
    "min-craft",
    4,
    "2026-02-22",
    0,
    { ko: "가성비 최고", en: "Best value" },
    {
      ko: "다른 견적의 70% 가격으로 비슷한 마감 품질을 받았습니다.",
      en: "70% of competing quotes for comparable finishing quality.",
    }
  ),
  r(
    "rv-14",
    "oh-natural",
    5,
    "2026-03-21",
    1,
    { ko: "원목 가구도 같이", en: "Wood furniture included" },
    {
      ko: "맞춤 원목 책장까지 만들어 주셨어요. 다른 데서는 못 받을 디테일.",
      en: "Even built a custom oak shelf. A detail no one else offered.",
    },
    [4, 5]
  ),
  r(
    "rv-15",
    "seo-bold",
    5,
    "2026-03-30",
    2,
    { ko: "신혼집 컬러 완벽", en: "Newlywed color tone, perfect" },
    {
      ko: "테라코타 + 오프화이트 조합 너무 만족합니다.",
      en: "Terracotta + off-white combo — couldn't be happier.",
    },
    [0]
  ),
];
