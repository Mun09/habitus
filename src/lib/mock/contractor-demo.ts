import { CONTRACTORS, type Contractor } from "./contractors";
import { IMAGES, PROJECT_W2_PHOTOS } from "./images";
import type { ProjectStage } from "./projects";

export type DemoQuoteStatus = "pending" | "responded" | "declined";

export type DemoQuoteRequest = {
  id: string;
  customerName: string;
  customerInitials: string;
  region: string;
  receivedAt: string; // ISO
  preferredStart: string; // ISO
  budgetMin: number;
  budgetMax: number;
  message: string;
  status: DemoQuoteStatus;
  attachedPlan?: {
    styleLabel: string;
    heroImage: string;
    optionCount: number;
    options: { label: string; value: string; swatch?: string }[];
  };
};

export type DemoActiveProject = {
  id: string;
  title: string;
  customerName: string;
  region: string;
  status: "in_progress" | "pending" | "completed";
  progress: number;
  currentStage: ProjectStage;
  startDate: string;
  expectedEnd: string;
  daysLeft: number;
  thumbnail: string;
  nextAction: string;
  unreadMessages: number;
};

export type DemoTodo = {
  id: string;
  type: "reply_needed" | "photo_upload_needed" | "quote_deadline" | "site_visit";
  label: string;
  count: number;
};

export type DemoActivity = {
  id: string;
  when: string;
  kind: "quote" | "message" | "update" | "review";
  text: string;
};

export type DemoMonthRevenue = {
  monthLabel: string; // e.g. "1월" / "Jan"
  revenue: number; // KRW
};

export type DemoReview = {
  id: string;
  customerName: string;
  rating: number;
  body: string;
  projectTitle: string;
  date: string;
};

export type DemoAnalytics = {
  monthlyRevenue: DemoMonthRevenue[];
  activeCount: number;
  completedCount: number;
  avgResponseHours: number;
  rating: number;
  reviewCount: number;
  ratingTrend: { month: string; rating: number }[];
  recentReviews: DemoReview[];
};

/**
 * Pick the contractor row best matching the signed-in identity. Falls
 * back to CONTRACTORS[0] (kim-warm) so the demo always has a profile to
 * preview.
 */
export function pickDemoContractor(contractorId: string | null | undefined): Contractor {
  if (!contractorId) return CONTRACTORS[0];
  return CONTRACTORS.find((c) => c.id === contractorId) ?? CONTRACTORS[0];
}

export const DEMO_QUOTE_REQUESTS: DemoQuoteRequest[] = [
  {
    id: "dq-1",
    customerName: "민지",
    customerInitials: "MJ",
    region: "Mapo, Seoul",
    receivedAt: hoursAgo(2),
    preferredStart: daysFromNow(21),
    budgetMin: 25000000,
    budgetMax: 38000000,
    message:
      "33평 아파트 거실+주방 리모델링이요. AI로 따뜻한 우드톤 무드보드를 만들었는데, 톤은 살리되 수납을 더 늘리고 싶어요. 견적과 일정 부탁드려요.",
    status: "pending",
    attachedPlan: {
      styleLabel: "Warm wood · Mid-century",
      heroImage: IMAGES.scenarios.w2.ai.openLounge,
      optionCount: 7,
      options: [
        { label: "Floor", value: "Oak herringbone", swatch: "#b88c5a" },
        { label: "Wall", value: "Cream plaster", swatch: "#efe4d1" },
        { label: "Lighting", value: "Indirect + track" },
        { label: "Sofa", value: "Camel boucle", swatch: "#c98e57" },
      ],
    },
  },
  {
    id: "dq-2",
    customerName: "Daniel C.",
    customerInitials: "DC",
    region: "Seongdong, Seoul",
    receivedAt: hoursAgo(7),
    preferredStart: daysFromNow(45),
    budgetMin: 18000000,
    budgetMax: 24000000,
    message:
      "Studio rental, ~18평. Need a turnkey refresh: paint, lighting, kitchen counter. Tenant move-in is locked in 6 weeks out.",
    status: "pending",
    attachedPlan: {
      styleLabel: "Minimal scandi",
      heroImage: IMAGES.scenarios.w2.ai.studioEntry,
      optionCount: 5,
      options: [
        { label: "Wall", value: "Warm white", swatch: "#f6f1ea" },
        { label: "Counter", value: "Pale terrazzo", swatch: "#e6e2da" },
        { label: "Cabinet", value: "Matte oak", swatch: "#b29373" },
      ],
    },
  },
  {
    id: "dq-3",
    customerName: "박세훈",
    customerInitials: "SH",
    region: "Yongsan, Seoul",
    receivedAt: hoursAgo(26),
    preferredStart: daysFromNow(60),
    budgetMin: 42000000,
    budgetMax: 55000000,
    message:
      "신혼집 전체 리모델링 (42평). 벽 한 곳 철거 검토 중이에요. 현장 방문 가능 일정 알려주세요. 자재는 친환경 선호.",
    status: "pending",
  },
  {
    id: "dq-4",
    customerName: "Hana K.",
    customerInitials: "HK",
    region: "Seongnam, Gyeonggi",
    receivedAt: daysAgoIso(2),
    preferredStart: daysFromNow(30),
    budgetMin: 30000000,
    budgetMax: 36000000,
    message:
      "Already sent a quote, waiting for your finishing schedule. Two kids so weekday-only work would be ideal.",
    status: "responded",
    attachedPlan: {
      styleLabel: "Soft modern",
      heroImage: IMAGES.scenarios.w2.ai.tvLounge,
      optionCount: 6,
      options: [
        { label: "Floor", value: "Wide oak", swatch: "#c69b6d" },
        { label: "Wall", value: "Greige", swatch: "#d6cfc2" },
      ],
    },
  },
  {
    id: "dq-5",
    customerName: "이지원",
    customerInitials: "JW",
    region: "Bundang, Gyeonggi",
    receivedAt: daysAgoIso(4),
    preferredStart: daysFromNow(14),
    budgetMin: 8000000,
    budgetMax: 12000000,
    message:
      "원룸 도배 + 바닥 + 조명 교체만 해주실 수 있을까요? 예산이 작아서 정중히 사양하시면 이해해요.",
    status: "declined",
  },
];

export const DEMO_ACTIVE_PROJECTS: DemoActiveProject[] = [
  {
    id: "dp-1",
    title: "Mapo · Hayoung's family home",
    customerName: "김하영",
    region: "Mapo, Seoul",
    status: "in_progress",
    progress: 62,
    currentStage: "carpentry",
    startDate: daysAgoIso(18),
    expectedEnd: daysFromNow(11),
    daysLeft: 11,
    thumbnail: PROJECT_W2_PHOTOS.after[0],
    nextAction: "Post today's carpentry photos",
    unreadMessages: 2,
  },
  {
    id: "dp-2",
    title: "Yongsan · cafe-style studio",
    customerName: "Daniel Choi",
    region: "Yongsan, Seoul",
    status: "in_progress",
    progress: 28,
    currentStage: "plumbing",
    startDate: daysAgoIso(6),
    expectedEnd: daysFromNow(34),
    daysLeft: 34,
    thumbnail: PROJECT_W2_PHOTOS.after[1],
    nextAction: "Confirm sink position with customer",
    unreadMessages: 1,
  },
  {
    id: "dp-3",
    title: "Seongdong · 2nd unit refresh",
    customerName: "한지민",
    region: "Seongdong, Seoul",
    status: "in_progress",
    progress: 89,
    currentStage: "finishing",
    startDate: daysAgoIso(34),
    expectedEnd: daysFromNow(3),
    daysLeft: 3,
    thumbnail: PROJECT_W2_PHOTOS.after[2],
    nextAction: "Schedule walk-through",
    unreadMessages: 0,
  },
];

export const DEMO_TODOS: DemoTodo[] = [
  { id: "t-1", type: "reply_needed", label: "replies waiting", count: 3 },
  { id: "t-2", type: "photo_upload_needed", label: "sites need today's photos", count: 2 },
  { id: "t-3", type: "quote_deadline", label: "quote deadlines this week", count: 3 },
  { id: "t-4", type: "site_visit", label: "site visits scheduled", count: 1 },
];

export const DEMO_ACTIVITY: DemoActivity[] = [
  {
    id: "a-1",
    when: hoursAgoLabel(2),
    kind: "quote",
    text: "New quote request from 민지 (Mapo, 33평)",
  },
  {
    id: "a-2",
    when: hoursAgoLabel(5),
    kind: "message",
    text: "Daniel C. replied on Yongsan cafe-style studio",
  },
  {
    id: "a-3",
    when: hoursAgoLabel(20),
    kind: "update",
    text: "Mapo project carpentry update posted",
  },
  {
    id: "a-4",
    when: "Yesterday",
    kind: "review",
    text: "한지민 left a 5-star review — Seongdong unit",
  },
  {
    id: "a-5",
    when: "2 days ago",
    kind: "quote",
    text: "You sent a quote to Hana K. (₩32M)",
  },
];

export const DEMO_ANALYTICS: DemoAnalytics = {
  monthlyRevenue: [
    { monthLabel: "Jun", revenue: 18000000 },
    { monthLabel: "Jul", revenue: 22000000 },
    { monthLabel: "Aug", revenue: 16000000 },
    { monthLabel: "Sep", revenue: 28000000 },
    { monthLabel: "Oct", revenue: 31000000 },
    { monthLabel: "Nov", revenue: 24000000 },
    { monthLabel: "Dec", revenue: 19000000 },
    { monthLabel: "Jan", revenue: 26000000 },
    { monthLabel: "Feb", revenue: 33000000 },
    { monthLabel: "Mar", revenue: 38000000 },
    { monthLabel: "Apr", revenue: 41000000 },
    { monthLabel: "May", revenue: 47000000 },
  ],
  activeCount: 3,
  completedCount: 24,
  avgResponseHours: 2.4,
  rating: 4.9,
  reviewCount: 87,
  ratingTrend: [
    { month: "Dec", rating: 4.7 },
    { month: "Jan", rating: 4.8 },
    { month: "Feb", rating: 4.8 },
    { month: "Mar", rating: 4.9 },
    { month: "Apr", rating: 4.9 },
    { month: "May", rating: 4.9 },
  ],
  recentReviews: [
    {
      id: "r-1",
      customerName: "한지민",
      rating: 5,
      body: "약속한 일정보다 이틀 빨리 마무리해주셨어요. 자재 변경할 때도 사진과 함께 충분히 설명해주셔서 안심했어요.",
      projectTitle: "Seongdong · 2nd unit refresh",
      date: daysAgoIso(3),
    },
    {
      id: "r-2",
      customerName: "Daniel Choi",
      rating: 5,
      body: "Honest pricing and on-time updates every single day. The team flagged a moisture issue early instead of hiding it.",
      projectTitle: "Yongsan · cafe studio (prev)",
      date: daysAgoIso(27),
    },
    {
      id: "r-3",
      customerName: "김하영",
      rating: 4,
      body: "전체적으로 만족합니다. 마감 한 두 군데 추가 보완 요청 드렸고 바로 와주셨어요.",
      projectTitle: "Mapo · family home (phase 1)",
      date: daysAgoIso(48),
    },
  ],
};

// ---------- helpers ----------
function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 3600_000).toISOString();
}
function daysAgoIso(d: number): string {
  return new Date(Date.now() - d * 86400_000).toISOString();
}
function daysFromNow(d: number): string {
  return new Date(Date.now() + d * 86400_000).toISOString();
}
function hoursAgoLabel(h: number): string {
  if (h < 1) return "Just now";
  if (h === 1) return "1 hour ago";
  return `${h} hours ago`;
}
