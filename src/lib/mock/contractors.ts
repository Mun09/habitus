import { IMAGES } from "./images";

export type Bilingual = string;

export type Badge =
  | "transparent_pricing"
  | "on_time_guarantee"
  | "background_checked"
  | "eco_materials"
  | "premium_finishing";

export type Contractor = {
  id: string;
  name: Bilingual;
  company: Bilingual;
  licensed: boolean;
  licenseNumber?: string;
  businessNumber?: string;
  region: Bilingual;
  regionKey: "seoul" | "gyeonggi" | "busan" | "incheon";
  yearsExperience: number;
  completedProjects: number;
  rating: number;
  reviewCount: number;
  responseHours: number;
  startingPrice: number;
  badges: Badge[];
  bio: Bilingual;
  profileImage: string;
  cover: string;
  portfolio: string[];
  licenseDocs: string[];
};

export const BADGE_LABELS: Record<Badge, Bilingual> = {
  transparent_pricing: "Transparent Pricing",
  on_time_guarantee: "On-Time Guarantee",
  background_checked: "Background Checked",
  eco_materials: "Eco Materials",
  premium_finishing: "Premium Finishing",
};

export const REGIONS: { key: Contractor["regionKey"]; label: Bilingual }[] = [
  { key: "seoul", label: "Seoul" },
  { key: "gyeonggi", label: "Gyeonggi" },
  { key: "busan", label: "Busan" },
  { key: "incheon", label: "Incheon" },
];

export const CONTRACTORS: Contractor[] = [
  {
    id: "kim-warm",
    name: "Doyun Kim",
    company: "Warm Atelier",
    licensed: true,
    licenseNumber: "Interior Design Lic. 2018-1142",
    businessNumber: "214-87-09382",
    region: "Mapo, Seoul",
    regionKey: "seoul",
    yearsExperience: 9,
    completedProjects: 142,
    rating: 4.9,
    reviewCount: 87,
    responseHours: 2,
    startingPrice: 18000000,
    badges: ["transparent_pricing", "on_time_guarantee", "premium_finishing"],
    bio: "Mid-century modern specialist focused on warm wood tones and natural light, especially in smaller homes.",
    profileImage: IMAGES.contractors.profiles[0],
    cover: IMAGES.contractors.portfolios[0][0],
    portfolio: IMAGES.contractors.portfolios[0],
    licenseDocs: IMAGES.contractors.licenses,
  },
  {
    id: "lee-haus",
    name: "Seoyun Lee",
    company: "Haus Labo",
    licensed: true,
    licenseNumber: "Interior Design Lic. 2020-2231",
    businessNumber: "318-22-44102",
    region: "Seongdong, Seoul",
    regionKey: "seoul",
    yearsExperience: 7,
    completedProjects: 96,
    rating: 4.8,
    reviewCount: 64,
    responseHours: 1,
    startingPrice: 22000000,
    badges: ["transparent_pricing", "background_checked", "eco_materials"],
    bio: "Minimal white-toned spaces with eco-friendly materials. Trusted by families with allergies.",
    profileImage: IMAGES.contractors.profiles[1],
    cover: IMAGES.contractors.portfolios[1][0],
    portfolio: IMAGES.contractors.portfolios[1],
    licenseDocs: IMAGES.contractors.licenses,
  },
  {
    id: "park-rough",
    name: "Junghoon Park",
    company: "Rough Studio",
    licensed: true,
    licenseNumber: "Interior Design Lic. 2017-0813",
    businessNumber: "104-55-71299",
    region: "Yongsan, Seoul",
    regionKey: "seoul",
    yearsExperience: 11,
    completedProjects: 178,
    rating: 4.7,
    reviewCount: 110,
    responseHours: 3,
    startingPrice: 25000000,
    badges: ["on_time_guarantee", "background_checked", "premium_finishing"],
    bio: "Industrial and vintage moods with exposed concrete. Strong cafe & office portfolio.",
    profileImage: IMAGES.contractors.profiles[2],
    cover: IMAGES.contractors.portfolios[2][0],
    portfolio: IMAGES.contractors.portfolios[2],
    licenseDocs: IMAGES.contractors.licenses,
  },
  {
    id: "han-skandi",
    name: "Sua Han",
    company: "Skandi Home",
    licensed: true,
    licenseNumber: "Interior Design Lic. 2019-1771",
    businessNumber: "411-02-99182",
    region: "Seongnam, Gyeonggi",
    regionKey: "gyeonggi",
    yearsExperience: 8,
    completedProjects: 121,
    rating: 4.9,
    reviewCount: 92,
    responseHours: 2,
    startingPrice: 19000000,
    badges: ["transparent_pricing", "eco_materials", "on_time_guarantee"],
    bio: "Scandinavian minimalism with natural materials. Specializes in family-friendly living rooms.",
    profileImage: IMAGES.contractors.profiles[3],
    cover: IMAGES.contractors.portfolios[3][0],
    portfolio: IMAGES.contractors.portfolios[3],
    licenseDocs: IMAGES.contractors.licenses,
  },
  {
    id: "jung-classic",
    name: "Yujin Jung",
    company: "Classic Mood",
    licensed: true,
    licenseNumber: "Interior Design Lic. 2016-0392",
    businessNumber: "220-87-00321",
    region: "Gangnam, Seoul",
    regionKey: "seoul",
    yearsExperience: 13,
    completedProjects: 201,
    rating: 4.8,
    reviewCount: 134,
    responseHours: 2,
    startingPrice: 32000000,
    badges: ["transparent_pricing", "premium_finishing", "background_checked"],
    bio: "Classic-modern mix. Strong with premium materials and large-scale homes.",
    profileImage: IMAGES.contractors.profiles[4],
    cover: IMAGES.contractors.portfolios[4][0],
    portfolio: IMAGES.contractors.portfolios[4],
    licenseDocs: IMAGES.contractors.licenses,
  },
  // Unlicensed Verified
  {
    id: "min-craft",
    name: "Jaeho Min",
    company: "Craft Room",
    licensed: false,
    region: "Eunpyeong, Seoul",
    regionKey: "seoul",
    yearsExperience: 6,
    completedProjects: 58,
    rating: 4.7,
    reviewCount: 41,
    responseHours: 4,
    startingPrice: 12000000,
    badges: ["transparent_pricing", "eco_materials"],
    bio: "Small studio & 1-bed expert. Verified unlicensed pro with 41 verified reviews and a fair-price track record.",
    profileImage: IMAGES.contractors.profiles[5],
    cover: IMAGES.contractors.portfolios[5][0],
    portfolio: IMAGES.contractors.portfolios[5],
    licenseDocs: [],
  },
  {
    id: "oh-natural",
    name: "Haneul Oh",
    company: "Natural Core",
    licensed: false,
    region: "Goyang, Gyeonggi",
    regionKey: "gyeonggi",
    yearsExperience: 5,
    completedProjects: 47,
    rating: 4.8,
    reviewCount: 36,
    responseHours: 3,
    startingPrice: 11000000,
    badges: ["eco_materials", "transparent_pricing"],
    bio: "Former furniture maker. Natural-material finishes for compact homes at honest prices.",
    profileImage: IMAGES.contractors.profiles[6],
    cover: IMAGES.contractors.portfolios[6][0],
    portfolio: IMAGES.contractors.portfolios[6],
    licenseDocs: [],
  },
  {
    id: "seo-bold",
    name: "Jian Seo",
    company: "Bold Concept",
    licensed: false,
    region: "Haeundae, Busan",
    regionKey: "busan",
    yearsExperience: 7,
    completedProjects: 72,
    rating: 4.6,
    reviewCount: 53,
    responseHours: 5,
    startingPrice: 14000000,
    badges: ["transparent_pricing", "background_checked"],
    bio: "Bold colors and patterns. Popular among Busan-area newlyweds and young professionals.",
    profileImage: IMAGES.contractors.profiles[7],
    cover: IMAGES.contractors.portfolios[7][0],
    portfolio: IMAGES.contractors.portfolios[7],
    licenseDocs: [],
  },
];
