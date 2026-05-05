import type { Bilingual } from "./contractors";

export type BanReason =
  | "quote_fraud"
  | "abandonment"
  | "material_swap"
  | "false_license"
  | "abuse";

export const BAN_REASON_LABELS: Record<BanReason, Bilingual> = {
  quote_fraud: "Quote fraud (extra billing)",
  abandonment: "Abandonment",
  material_swap: "Unauthorized material swap",
  false_license: "False license",
  abuse: "Verbal abuse",
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

export const TRUST_LAYERS: { title: string; body: string }[] = [
  {
    title: "Vetted contractors only",
    body: "Two-layer vetting: license check and business registration.",
  },
  {
    title: "AI quote guard",
    body: "AI cross-checks every quote against market data, flagging inflated estimates instantly.",
  },
  {
    title: "Stage-based escrow",
    body: "Payments release stage-by-stage after inspection. If work stops, money stops.",
  },
  {
    title: "Immediate dispute support",
    body: "Reported issues escalate to our dispute team within 24h, with optional legal support.",
  },
];

export const TRUST_FAQ: { q: Bilingual; a: Bilingual }[] = [
  {
    q: "Are unlicensed contractors safe?",
    a: "Unlicensed pros on Habitus pass at least 30 verified reviews and a portfolio review before they appear in matching.",
  },
  {
    q: "How are disputes handled?",
    a: "Within 24h a dedicated PM gathers both sides. If unresolved, we escalate to Habitus mediation and consumer-agency / legal support.",
  },
  {
    q: "Is payment safe?",
    a: "Down payment is capped at 30%; the rest releases only after stage inspections pass.",
  },
];
