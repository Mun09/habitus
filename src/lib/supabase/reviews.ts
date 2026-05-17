import { IMAGES } from "@/lib/mock/images";
import type { Review } from "@/lib/mock/reviews";

type ReviewRow = {
  id: string;
  project_id: string | null;
  user_id: string | null;
  contractor_id: string;
  rating: number | string;
  title: string | null;
  body: string | null;
  photos: string[] | null;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
};

const PLACEHOLDER_AVATARS = IMAGES.reviewers;

function pickAvatar(seed: string): string {
  const hex = seed.replace(/[^0-9a-f]/gi, "").slice(-2) || "00";
  const idx = parseInt(hex, 16) % PLACEHOLDER_AVATARS.length;
  return PLACEHOLDER_AVATARS[idx];
}

export function rowToReview(row: ReviewRow): Review {
  // Seed reviews carry display_name/avatar_url directly. Real user reviews
  // mask the reviewer identity with a short stable handle so user_profiles
  // never leaks across users.
  let reviewerName: string;
  let reviewerImage: string;
  if (row.display_name) {
    reviewerName = row.display_name;
    reviewerImage = row.avatar_url ?? pickAvatar(row.id);
  } else if (row.user_id) {
    const shortId = row.user_id.replace(/-/g, "").slice(0, 6).toUpperCase();
    reviewerName = `Verified customer ${shortId}`;
    reviewerImage = pickAvatar(row.user_id);
  } else {
    reviewerName = "Verified customer";
    reviewerImage = pickAvatar(row.id);
  }
  return {
    id: row.id,
    contractorId: row.contractor_id,
    reviewerName,
    reviewerImage,
    rating: Number(row.rating),
    date: row.created_at.slice(0, 10),
    verified: true,
    title: row.title ?? "",
    body: row.body ?? "",
    photos: row.photos && row.photos.length > 0 ? row.photos : undefined,
  };
}
