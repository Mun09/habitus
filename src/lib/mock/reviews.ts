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

const REVIEWER_NAMES: Bilingual[] = [
  "Minji K.",
  "Seojun P.",
  "Haneul L.",
  "Gaeun C.",
  "Dohyeon J.",
  "Yejin H.",
];

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

export const REVIEWS: Review[] = [
  r(
    "rv-1",
    "kim-warm",
    5,
    "2026-03-12",
    0,
    "On budget, on schedule",
    "Zero surprise costs from quote to handover. Daily photo updates kept me at ease.",
    [0, 1]
  ),
  r(
    "rv-2",
    "kim-warm",
    5,
    "2026-02-21",
    1,
    "My living room looks like a magazine",
    "Phenomenal eye for natural light. The small space feels twice as large now.",
    [2]
  ),
  r(
    "rv-3",
    "kim-warm",
    4,
    "2026-01-08",
    2,
    "Crisp finishing",
    "Quick follow-up support. Slight delay, but the result is excellent."
  ),
  r(
    "rv-4",
    "lee-haus",
    5,
    "2026-03-02",
    3,
    "Truly eco materials",
    "My child has allergies — they shared every eco-certification.",
    [3, 4]
  ),
  r(
    "rv-5",
    "lee-haus",
    5,
    "2026-02-14",
    4,
    "Replies within an hour",
    "Even after-hours messages get a same-day reply. Trust earned."
  ),
  r(
    "rv-6",
    "park-rough",
    5,
    "2026-03-19",
    5,
    "Exposed concrete finish is art",
    "Years of cafe work shows — the details are on another level.",
    [5]
  ),
  r(
    "rv-7",
    "park-rough",
    4,
    "2026-02-04",
    0,
    "Communication slow at first",
    "Once kicked off, fast and precise. Just a slow quote phase."
  ),
  r(
    "rv-8",
    "han-skandi",
    5,
    "2026-03-25",
    1,
    "Family-friendly done right",
    "Even the corner softening for the kids — incredibly thoughtful.",
    [0, 4]
  ),
  r(
    "rv-9",
    "han-skandi",
    5,
    "2026-01-29",
    2,
    "Scandinavian tone, perfect",
    "Got my taste right without me even sharing references."
  ),
  r(
    "rv-10",
    "jung-classic",
    5,
    "2026-03-08",
    3,
    "Trust at scale",
    "230m² felt risky, but the project management was flawless.",
    [1, 2]
  ),
  r(
    "rv-11",
    "jung-classic",
    4,
    "2026-02-11",
    4,
    "Premium material options",
    "Five tone options laid side-by-side. Easy decision."
  ),
  r(
    "rv-12",
    "min-craft",
    5,
    "2026-03-15",
    5,
    "Treated like a big project",
    "30m² studio treated with the same care as a full home. Verified — peace of mind.",
    [3]
  ),
  r(
    "rv-13",
    "min-craft",
    4,
    "2026-02-22",
    0,
    "Best value",
    "70% of competing quotes for comparable finishing quality."
  ),
  r(
    "rv-14",
    "oh-natural",
    5,
    "2026-03-21",
    1,
    "Wood furniture included",
    "Even built a custom oak shelf. A detail no one else offered.",
    [4, 5]
  ),
  r(
    "rv-15",
    "seo-bold",
    5,
    "2026-03-30",
    2,
    "Newlywed color tone, perfect",
    "Terracotta + off-white combo — couldn't be happier.",
    [0]
  ),
];
