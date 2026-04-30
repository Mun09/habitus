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
    category: { ko: "벽", en: "Walls" },
    name: { ko: "친환경 페인트 (베이지)", en: "Low-VOC paint (beige)" },
    brand: "Benjamin Moore",
    tier: "premium",
    unit: { ko: "L", en: "L" },
    qty: 24,
    unitPrice: 28000,
    alternatives: [
      { name: { ko: "친환경 페인트 (보급)", en: "Eco paint (basic)" }, tier: "standard", unitPrice: 18000 },
      { name: { ko: "일반 수성 페인트", en: "Standard latex" }, tier: "basic", unitPrice: 9500 },
    ],
  },
  {
    id: "m2",
    category: { ko: "바닥", en: "Floor" },
    name: { ko: "원목마루 (오크)", en: "Engineered oak floor" },
    brand: "구정마루",
    tier: "premium",
    unit: { ko: "㎡", en: "m²" },
    qty: 78,
    unitPrice: 145000,
    alternatives: [
      { name: { ko: "강마루 (오크 패턴)", en: "Laminate oak" }, tier: "standard", unitPrice: 78000 },
      { name: { ko: "장판 (모노륨)", en: "Vinyl sheet" }, tier: "basic", unitPrice: 18000 },
    ],
  },
  {
    id: "m3",
    category: { ko: "조명", en: "Lighting" },
    name: { ko: "다운라이트 (LED 7W)", en: "LED downlight 7W" },
    brand: "Philips",
    tier: "standard",
    unit: { ko: "개", en: "ea" },
    qty: 22,
    unitPrice: 18000,
    alternatives: [
      { name: { ko: "디밍 LED 다운라이트", en: "Dimmable LED downlight" }, tier: "premium", unitPrice: 38000 },
      { name: { ko: "일반 LED", en: "Standard LED" }, tier: "basic", unitPrice: 7500 },
    ],
  },
  {
    id: "m4",
    category: { ko: "주방", en: "Kitchen" },
    name: { ko: "자작 합판 상부장 + 인조대리석", en: "Birch ply cabinets + quartz top" },
    tier: "premium",
    unit: { ko: "세트", en: "set" },
    qty: 1,
    unitPrice: 4800000,
    alternatives: [
      { name: { ko: "MDF + 라미네이트 상판", en: "MDF + laminate top" }, tier: "standard", unitPrice: 2900000 },
      { name: { ko: "PB + 인조 상판", en: "PB + faux top" }, tier: "basic", unitPrice: 1700000 },
    ],
  },
  {
    id: "m5",
    category: { ko: "마감", en: "Finishing" },
    name: { ko: "걸레받이 + 몰딩 패키지", en: "Skirting + molding package" },
    tier: "standard",
    unit: { ko: "세트", en: "set" },
    qty: 1,
    unitPrice: 1200000,
    alternatives: [
      { name: { ko: "히든 몰딩 패키지", en: "Hidden molding pkg" }, tier: "premium", unitPrice: 2400000 },
      { name: { ko: "기본 몰딩", en: "Basic molding" }, tier: "basic", unitPrice: 600000 },
    ],
  },
];

export const COST_BENCHMARK = {
  ourQuote: 18250000,
  marketAvg: 24800000,
  lowballQuote: 11900000,
  warning: {
    ko: "저가 견적은 자재를 한 단계 낮춰 채우는 경우가 60%에 달해요. 표시 자재와 실제 자재 사진을 반드시 비교하세요.",
    en: "60% of lowball quotes silently downgrade material grade. Compare specified materials against site photos.",
  },
};

export const CONTRACT_CHECKLIST: { ko: string; en: string }[] = [
  { ko: "선금은 총 공사비의 30%를 초과하지 않는다", en: "Down payment must not exceed 30% of total" },
  { ko: "공정별 검수 후 단계별 지급 (4회 분할)", en: "Stage-based payment in 4 parts after inspection" },
  { ko: "자재 변경 시 사전 서면 동의 필수", en: "Material substitution requires prior written consent" },
  { ko: "지연 시 일 0.1% 위약금 명시", en: "Delay penalty: 0.1% per day clearly specified" },
  { ko: "공사 중단 시 환불 산식 명시", en: "Refund formula in case of work suspension" },
  { ko: "하자보증 1년 이상 명시", en: "Defect warranty of 1+ year specified" },
  { ko: "시공자 업체명·사업자번호 정확 기재", en: "Exact contractor name and business number" },
  { ko: "현장 사진 일일 업데이트 의무", en: "Daily site photo updates obligation" },
  { ko: "폐기물 처리 비용 포함 여부", en: "Whether debris disposal is included" },
  { ko: "공사 인부 안전보험 가입 확인", en: "Worker safety insurance confirmation" },
  { ko: "이웃·관리실 사전 공지 책임 시공자", en: "Contractor responsible for notifying neighbors" },
  { ko: "분쟁 시 한국소비자원 또는 Gather 중재 가능", en: "Mediation via Consumer Agency or Gather" },
  { ko: "최종 검수 체크리스트 첨부", en: "Final inspection checklist attached" },
  { ko: "잔금은 최종 검수 통과 이후 지급", en: "Final payment only after final inspection passes" },
];
