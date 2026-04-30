import { IMAGES } from "./images";

export type Bilingual = { ko: string; en: string };

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
  warrantyInsurance?: Bilingual;
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
  transparent_pricing: { ko: "투명 가격", en: "Transparent Pricing" },
  on_time_guarantee: { ko: "정시 보증", en: "On-Time Guarantee" },
  background_checked: { ko: "신원 검증", en: "Background Checked" },
  eco_materials: { ko: "친환경 자재", en: "Eco Materials" },
  premium_finishing: { ko: "프리미엄 마감", en: "Premium Finishing" },
};

export const REGIONS: { key: Contractor["regionKey"]; label: Bilingual }[] = [
  { key: "seoul", label: { ko: "서울", en: "Seoul" } },
  { key: "gyeonggi", label: { ko: "경기", en: "Gyeonggi" } },
  { key: "busan", label: { ko: "부산", en: "Busan" } },
  { key: "incheon", label: { ko: "인천", en: "Incheon" } },
];

export const CONTRACTORS: Contractor[] = [
  {
    id: "kim-warm",
    name: { ko: "김도윤", en: "Doyun Kim" },
    company: { ko: "웜 아뜰리에", en: "Warm Atelier" },
    licensed: true,
    licenseNumber: "건축실내디자인 제 2018-1142호",
    businessNumber: "214-87-09382",
    warrantyInsurance: {
      ko: "DB손해보험 하자보증보험 (2년, 1억원)",
      en: "DB Insurance Defect Warranty (2yr, ₩100M)",
    },
    region: { ko: "서울 마포구", en: "Mapo, Seoul" },
    regionKey: "seoul",
    yearsExperience: 9,
    completedProjects: 142,
    rating: 4.9,
    reviewCount: 87,
    responseHours: 2,
    startingPrice: 18000000,
    badges: ["transparent_pricing", "on_time_guarantee", "premium_finishing"],
    bio: {
      ko: "따뜻한 우드톤과 자연광을 살린 미드센추리 모던 전문. 작은 평수의 비례감을 살리는 데 강합니다.",
      en: "Mid-century modern specialist focused on warm wood tones and natural light, especially in smaller homes.",
    },
    profileImage: IMAGES.contractors.profiles[0],
    cover: IMAGES.contractors.portfolios[0][0],
    portfolio: IMAGES.contractors.portfolios[0],
    licenseDocs: IMAGES.contractors.licenses,
  },
  {
    id: "lee-haus",
    name: { ko: "이서윤", en: "Seoyun Lee" },
    company: { ko: "하우스 라보", en: "Haus Labo" },
    licensed: true,
    licenseNumber: "건축실내디자인 제 2020-2231호",
    businessNumber: "318-22-44102",
    warrantyInsurance: {
      ko: "삼성화재 하자보증보험 (2년)",
      en: "Samsung Fire Defect Warranty (2yr)",
    },
    region: { ko: "서울 성동구", en: "Seongdong, Seoul" },
    regionKey: "seoul",
    yearsExperience: 7,
    completedProjects: 96,
    rating: 4.8,
    reviewCount: 64,
    responseHours: 1,
    startingPrice: 22000000,
    badges: ["transparent_pricing", "background_checked", "eco_materials"],
    bio: {
      ko: "미니멀 화이트 톤과 친환경 자재 전문. 알러지 가족, 신혼부부 작업이 많습니다.",
      en: "Minimal white-toned spaces with eco-friendly materials. Trusted by families with allergies.",
    },
    profileImage: IMAGES.contractors.profiles[1],
    cover: IMAGES.contractors.portfolios[1][0],
    portfolio: IMAGES.contractors.portfolios[1],
    licenseDocs: IMAGES.contractors.licenses,
  },
  {
    id: "park-rough",
    name: { ko: "박정훈", en: "Junghoon Park" },
    company: { ko: "러프 스튜디오", en: "Rough Studio" },
    licensed: true,
    licenseNumber: "건축실내디자인 제 2017-0813호",
    businessNumber: "104-55-71299",
    warrantyInsurance: {
      ko: "현대해상 하자보증보험 (2년)",
      en: "Hyundai Marine Defect Warranty (2yr)",
    },
    region: { ko: "서울 용산구", en: "Yongsan, Seoul" },
    regionKey: "seoul",
    yearsExperience: 11,
    completedProjects: 178,
    rating: 4.7,
    reviewCount: 110,
    responseHours: 3,
    startingPrice: 25000000,
    badges: ["on_time_guarantee", "background_checked", "premium_finishing"],
    bio: {
      ko: "인더스트리얼 / 빈티지 무드와 노출 콘크리트 마감. 카페·오피스 인테리어 경험 풍부.",
      en: "Industrial and vintage moods with exposed concrete. Strong cafe & office portfolio.",
    },
    profileImage: IMAGES.contractors.profiles[2],
    cover: IMAGES.contractors.portfolios[2][0],
    portfolio: IMAGES.contractors.portfolios[2],
    licenseDocs: IMAGES.contractors.licenses,
  },
  {
    id: "han-skandi",
    name: { ko: "한수아", en: "Sua Han" },
    company: { ko: "스칸디 홈", en: "Skandi Home" },
    licensed: true,
    licenseNumber: "건축실내디자인 제 2019-1771호",
    businessNumber: "411-02-99182",
    warrantyInsurance: {
      ko: "KB손해보험 하자보증보험 (2년)",
      en: "KB Insurance Defect Warranty (2yr)",
    },
    region: { ko: "경기 성남시", en: "Seongnam, Gyeonggi" },
    regionKey: "gyeonggi",
    yearsExperience: 8,
    completedProjects: 121,
    rating: 4.9,
    reviewCount: 92,
    responseHours: 2,
    startingPrice: 19000000,
    badges: ["transparent_pricing", "eco_materials", "on_time_guarantee"],
    bio: {
      ko: "스칸디나비안 미니멀 + 자연 소재. 가족 친화적인 따뜻한 거실을 잘 만듭니다.",
      en: "Scandinavian minimalism with natural materials. Specializes in family-friendly living rooms.",
    },
    profileImage: IMAGES.contractors.profiles[3],
    cover: IMAGES.contractors.portfolios[3][0],
    portfolio: IMAGES.contractors.portfolios[3],
    licenseDocs: IMAGES.contractors.licenses,
  },
  {
    id: "jung-classic",
    name: { ko: "정유진", en: "Yujin Jung" },
    company: { ko: "클래식 무드", en: "Classic Mood" },
    licensed: true,
    licenseNumber: "건축실내디자인 제 2016-0392호",
    businessNumber: "220-87-00321",
    warrantyInsurance: {
      ko: "메리츠 하자보증보험 (2년)",
      en: "Meritz Defect Warranty (2yr)",
    },
    region: { ko: "서울 강남구", en: "Gangnam, Seoul" },
    regionKey: "seoul",
    yearsExperience: 13,
    completedProjects: 201,
    rating: 4.8,
    reviewCount: 134,
    responseHours: 2,
    startingPrice: 32000000,
    badges: ["transparent_pricing", "premium_finishing", "background_checked"],
    bio: {
      ko: "클래식 + 모던 믹스. 고급 자재 활용에 강하며 큰 평수 작업 경험이 풍부합니다.",
      en: "Classic-modern mix. Strong with premium materials and large-scale homes.",
    },
    profileImage: IMAGES.contractors.profiles[4],
    cover: IMAGES.contractors.portfolios[4][0],
    portfolio: IMAGES.contractors.portfolios[4],
    licenseDocs: IMAGES.contractors.licenses,
  },
  // Unlicensed Verified
  {
    id: "min-craft",
    name: { ko: "민재호", en: "Jaeho Min" },
    company: { ko: "크래프트 룸", en: "Craft Room" },
    licensed: false,
    region: { ko: "서울 은평구", en: "Eunpyeong, Seoul" },
    regionKey: "seoul",
    yearsExperience: 6,
    completedProjects: 58,
    rating: 4.7,
    reviewCount: 41,
    responseHours: 4,
    startingPrice: 12000000,
    badges: ["transparent_pricing", "eco_materials"],
    bio: {
      ko: "소규모 원룸·투룸 전문. 합리적 가격대로 검증 리뷰 41건을 보유한 무면허 우수 시공자.",
      en: "Small studio & 1-bed expert. Verified unlicensed pro with 41 verified reviews and a fair-price track record.",
    },
    profileImage: IMAGES.contractors.profiles[5],
    cover: IMAGES.contractors.portfolios[5][0],
    portfolio: IMAGES.contractors.portfolios[5],
    licenseDocs: [],
  },
  {
    id: "oh-natural",
    name: { ko: "오하늘", en: "Haneul Oh" },
    company: { ko: "내추럴 코어", en: "Natural Core" },
    licensed: false,
    region: { ko: "경기 고양시", en: "Goyang, Gyeonggi" },
    regionKey: "gyeonggi",
    yearsExperience: 5,
    completedProjects: 47,
    rating: 4.8,
    reviewCount: 36,
    responseHours: 3,
    startingPrice: 11000000,
    badges: ["eco_materials", "transparent_pricing"],
    bio: {
      ko: "원목 가구 제작자 출신. 작은 평수의 자연 소재 마감 작업을 합리적 가격에 제공합니다.",
      en: "Former furniture maker. Natural-material finishes for compact homes at honest prices.",
    },
    profileImage: IMAGES.contractors.profiles[6],
    cover: IMAGES.contractors.portfolios[6][0],
    portfolio: IMAGES.contractors.portfolios[6],
    licenseDocs: [],
  },
  {
    id: "seo-bold",
    name: { ko: "서지안", en: "Jian Seo" },
    company: { ko: "볼드 컨셉", en: "Bold Concept" },
    licensed: false,
    region: { ko: "부산 해운대구", en: "Haeundae, Busan" },
    regionKey: "busan",
    yearsExperience: 7,
    completedProjects: 72,
    rating: 4.6,
    reviewCount: 53,
    responseHours: 5,
    startingPrice: 14000000,
    badges: ["transparent_pricing", "background_checked"],
    bio: {
      ko: "컬러 액센트와 대담한 패턴이 강점. 부산권 신혼·청년 1인가구에서 인기.",
      en: "Bold colors and patterns. Popular among Busan-area newlyweds and young professionals.",
    },
    profileImage: IMAGES.contractors.profiles[7],
    cover: IMAGES.contractors.portfolios[7][0],
    portfolio: IMAGES.contractors.portfolios[7],
    licenseDocs: [],
  },
];
