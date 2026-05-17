import type { Badge, Contractor } from "@/lib/mock/contractors";

type ContractorRow = {
  id: string;
  name: string;
  company: string;
  licensed: boolean;
  license_number: string | null;
  business_number: string | null;
  region: string;
  region_key: Contractor["regionKey"];
  years_experience: number;
  completed_projects: number;
  rating: number | string;
  review_count: number;
  response_hours: number;
  starting_price: number;
  badges: string[];
  bio: string | null;
  profile_image: string | null;
  cover: string | null;
  portfolio: string[] | null;
  license_docs: string[] | null;
};

export function rowToContractor(row: ContractorRow): Contractor {
  return {
    id: row.id,
    name: row.name,
    company: row.company,
    licensed: row.licensed,
    licenseNumber: row.license_number ?? undefined,
    businessNumber: row.business_number ?? undefined,
    region: row.region,
    regionKey: row.region_key,
    yearsExperience: row.years_experience,
    completedProjects: row.completed_projects,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    responseHours: row.response_hours,
    startingPrice: row.starting_price,
    badges: (row.badges ?? []) as Badge[],
    bio: row.bio ?? "",
    profileImage: row.profile_image ?? "",
    cover: row.cover ?? "",
    portfolio: row.portfolio ?? [],
    licenseDocs: row.license_docs ?? [],
  };
}
