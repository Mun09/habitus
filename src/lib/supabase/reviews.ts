import { IMAGES } from "@/lib/mock/images";
import type { Review } from "@/lib/mock/reviews";

type ReviewRow = {
  id: string;
  project_id: string;
  user_id: string;
  contractor_id: string;
  rating: number | string;
  title: string | null;
  body: string | null;
  photos: string[] | null;
  created_at: string;
};

const PLACEHOLDER_AVATARS = IMAGES.reviewers;

function pickAvatar(userId: string): string {
  const hex = userId.replace(/[^0-9a-f]/gi, "").slice(-2) || "00";
  const idx = parseInt(hex, 16) % PLACEHOLDER_AVATARS.length;
  return PLACEHOLDER_AVATARS[idx];
}

export function rowToReview(row: ReviewRow): Review {
  // Reviewer identity is intentionally masked on the public contractor
  // detail page. We surface a short stable handle and a deterministic
  // placeholder avatar so the UI looks consistent without exposing
  // user_profiles to other users.
  const shortId = row.user_id.replace(/-/g, "").slice(0, 6).toUpperCase();
  return {
    id: row.id,
    contractorId: row.contractor_id,
    reviewerName: `Verified customer ${shortId}`,
    reviewerImage: pickAvatar(row.user_id),
    rating: Number(row.rating),
    date: row.created_at.slice(0, 10),
    verified: true,
    title: row.title ?? "",
    body: row.body ?? "",
    photos: row.photos && row.photos.length > 0 ? row.photos : undefined,
  };
}
