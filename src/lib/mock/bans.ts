import type { Bilingual } from "./contractors";

export type BanReason =
  | "quote_fraud"
  | "abandonment"
  | "material_swap"
  | "false_license"
  | "abuse";

export const BAN_REASON_LABELS: Record<BanReason, Bilingual> = {
  quote_fraud: { ko: "견적 사기 (추가 청구)", en: "Quote fraud (extra billing)" },
  abandonment: { ko: "공사 중단·잠수", en: "Abandonment" },
  material_swap: { ko: "자재 임의 변경", en: "Unauthorized material swap" },
  false_license: { ko: "면허 위조", en: "False license" },
  abuse: { ko: "고객·직원 폭언", en: "Verbal abuse" },
};

export const MONTHLY_BANS: { month: string; bans: number }[] = [
  { month: "2025-05", bans: 2 },
  { month: "2025-06", bans: 3 },
  { month: "2025-07", bans: 1 },
  { month: "2025-08", bans: 4 },
  { month: "2025-09", bans: 2 },
  { month: "2025-10", bans: 3 },
  { month: "2025-11", bans: 5 },
  { month: "2025-12", bans: 2 },
  { month: "2026-01", bans: 4 },
  { month: "2026-02", bans: 3 },
  { month: "2026-03", bans: 6 },
  { month: "2026-04", bans: 4 },
];

export const REASON_DISTRIBUTION: { reason: BanReason; count: number }[] = [
  { reason: "quote_fraud", count: 14 },
  { reason: "material_swap", count: 11 },
  { reason: "abandonment", count: 8 },
  { reason: "false_license", count: 4 },
  { reason: "abuse", count: 2 },
];

export const TRUST_LAYERS: { titleKo: string; titleEn: string; bodyKo: string; bodyEn: string }[] = [
  {
    titleKo: "검증된 시공자만",
    titleEn: "Vetted contractors only",
    bodyKo: "면허, 사업자등록, 하자보증보험까지 3중 검증을 통과한 시공자만 등록 가능합니다.",
    bodyEn: "Three-layer vetting: license, business registration, and warranty insurance.",
  },
  {
    titleKo: "AI 견적 가드",
    titleEn: "AI quote guard",
    bodyKo: "AI가 시장가 데이터베이스로 견적을 즉시 검증해, 부풀려진 견적을 사전에 잡아냅니다.",
    bodyEn: "AI cross-checks every quote against market data, flagging inflated estimates instantly.",
  },
  {
    titleKo: "단계별 에스크로",
    titleEn: "Stage-based escrow",
    bodyKo: "결제는 공정별 검수 후 단계별로 집행됩니다. 시공이 멈추면 잔금도 멈춥니다.",
    bodyEn: "Payments release stage-by-stage after inspection. If work stops, money stops.",
  },
  {
    titleKo: "분쟁 시 즉시 개입",
    titleEn: "Immediate dispute support",
    bodyKo: "이슈 신고 시 24시간 내 분쟁팀이 개입하고, 필요시 법률 지원까지 연결합니다.",
    bodyEn: "Reported issues escalate to our dispute team within 24h, with optional legal support.",
  },
];

export const TRUST_FAQ: { q: Bilingual; a: Bilingual }[] = [
  {
    q: {
      ko: "무면허 시공자도 안전한가요?",
      en: "Are unlicensed contractors safe?",
    },
    a: {
      ko: "Gather에 등록된 무면허 시공자는 최소 30건 이상의 검증 리뷰와 포트폴리오 검토를 통과한 우수 시공자입니다. 무면허이지만 추적 가능한 보증을 별도로 적용합니다.",
      en: "Unlicensed pros on Gather pass at least 30 verified reviews and portfolio review. They carry a separate Gather-backed warranty.",
    },
  },
  {
    q: { ko: "분쟁이 생기면 어떻게 처리되나요?", en: "How are disputes handled?" },
    a: {
      ko: "이슈 신고 시 24시간 내 전담 PM이 양측 입장을 정리합니다. 합의 불가 시 Gather 중재 + 한국소비자원/법률 지원까지 단계적으로 진행합니다.",
      en: "Within 24h a dedicated PM gathers both sides. If unresolved, we escalate to Gather mediation and consumer-agency / legal support.",
    },
  },
  {
    q: {
      ko: "결제는 안전한가요?",
      en: "Is payment safe?",
    },
    a: {
      ko: "선금은 30% 이내로 제한하고, 잔금은 단계별 검수 통과 후에만 시공자에게 입금됩니다.",
      en: "Down payment is capped at 30%; the rest releases only after stage inspections pass.",
    },
  },
];
