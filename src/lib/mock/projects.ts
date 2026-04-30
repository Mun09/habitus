import type { Bilingual } from "./contractors";
import { IMAGES } from "./images";

export type ProjectStage =
  | "demolition"
  | "plumbing"
  | "electrical"
  | "carpentry"
  | "painting"
  | "finishing";

export type Update = {
  id: string;
  date: string;
  stage: ProjectStage;
  author: Bilingual;
  title: Bilingual;
  body: Bilingual;
  photos: string[];
};

export type ChatMessage = {
  id: string;
  sender: "user" | "ai" | "pm";
  body: Bilingual;
  time: string;
};

export type Notification = {
  id: string;
  time: string;
  title: Bilingual;
  body: Bilingual;
  unread: boolean;
};

export type Project = {
  id: string;
  title: Bilingual;
  contractorId: string;
  status: "in_progress" | "completed" | "pending";
  progress: number;
  currentStage: ProjectStage;
  startDate: string;
  expectedEnd: string;
  daysLeft: number;
  pm: {
    name: Bilingual;
    role: Bilingual;
    avatar: string;
    responseHours: number;
  };
  updates: Update[];
  pmMessages: ChatMessage[];
  notifications: Notification[];
};

export const PROJECT_STAGES: { key: ProjectStage; tKey: string }[] = [
  { key: "demolition", tKey: "tracking.gantt.demolition" },
  { key: "plumbing", tKey: "tracking.gantt.plumbing" },
  { key: "electrical", tKey: "tracking.gantt.electrical" },
  { key: "carpentry", tKey: "tracking.gantt.carpentry" },
  { key: "painting", tKey: "tracking.gantt.painting" },
  { key: "finishing", tKey: "tracking.gantt.finishing" },
];

export const PROJECTS: Project[] = [
  {
    id: "proj-mapo-32",
    title: { ko: "마포 32평 거실 + 주방 리모델링", en: "Mapo 105m² Living + Kitchen" },
    contractorId: "kim-warm",
    status: "in_progress",
    progress: 62,
    currentStage: "painting",
    startDate: "2026-04-01",
    expectedEnd: "2026-05-12",
    daysLeft: 14,
    pm: {
      name: { ko: "이서영 PM", en: "Seoyeong Lee, PM" },
      role: { ko: "전담 프로젝트 매니저", en: "Dedicated PM" },
      avatar: IMAGES.contractors.profiles[1],
      responseHours: 1,
    },
    updates: [
      {
        id: "up-1",
        date: "2026-04-26",
        stage: "painting",
        author: { ko: "현장 반장 박정훈", en: "Site lead Junghoon Park" },
        title: { ko: "도장 1차 완료, 톤 확인", en: "First paint coat done, tone check" },
        body: {
          ko: "거실/주방 1차 도장 마무리했습니다. 자연광 들어올 때 톤이 살짝 노랗게 비치는데, 협의된 베이지 톤이라 정상입니다. 2차는 모레 진행 예정입니다.",
          en: "First coat finished. The tone reads slightly warm under afternoon light — within the agreed beige spec. Second coat scheduled in 2 days.",
        },
        photos: [IMAGES.projectUpdates[0], IMAGES.projectUpdates[1], IMAGES.projectUpdates[2]],
      },
      {
        id: "up-2",
        date: "2026-04-22",
        stage: "carpentry",
        author: { ko: "목공 팀 김도윤", en: "Carpentry lead Doyun Kim" },
        title: { ko: "주방 상부장 설치 완료", en: "Upper kitchen cabinets installed" },
        body: {
          ko: "협의한 자작합판으로 상부장 모두 설치했습니다. 이음새 처리는 내일 마무리합니다.",
          en: "All upper cabinets installed in birch ply as agreed. Joints to be finished tomorrow.",
        },
        photos: [IMAGES.projectUpdates[3], IMAGES.projectUpdates[4]],
      },
      {
        id: "up-3",
        date: "2026-04-18",
        stage: "carpentry",
        author: { ko: "목공 팀 김도윤", en: "Carpentry lead Doyun Kim" },
        title: { ko: "거실 미닫이 도어 프레임", en: "Living room sliding-door frame" },
        body: {
          ko: "거실-침실 사이 미닫이 프레임 설치 완료. 슬라이드 부드럽게 잘 작동합니다.",
          en: "Sliding-door frame between living and bedroom installed. Slides smoothly.",
        },
        photos: [IMAGES.projectUpdates[5], IMAGES.projectUpdates[6]],
      },
      {
        id: "up-4",
        date: "2026-04-12",
        stage: "electrical",
        author: { ko: "전기 팀 한상민", en: "Electrical lead Sangmin Han" },
        title: { ko: "조명 위치 변경 협의 완료", en: "Lighting layout updated" },
        body: {
          ko: "거실 메인 조명 위치를 30cm 이동 협의 완료. 비용 변동 없습니다.",
          en: "Main living light shifted by 30cm as discussed. No cost change.",
        },
        photos: [IMAGES.projectUpdates[7]],
      },
      {
        id: "up-5",
        date: "2026-04-08",
        stage: "plumbing",
        author: { ko: "배관 팀 정태식", en: "Plumbing lead Taesik Jung" },
        title: { ko: "주방 배관 교체 완료", en: "Kitchen plumbing replaced" },
        body: {
          ko: "노후 배관 모두 PEX로 교체 완료. 기능 테스트 통과.",
          en: "Aging pipes replaced with PEX. Functional test passed.",
        },
        photos: [IMAGES.projectUpdates[0], IMAGES.projectUpdates[3]],
      },
      {
        id: "up-6",
        date: "2026-04-02",
        stage: "demolition",
        author: { ko: "철거 팀 윤재호", en: "Demo lead Jaeho Yoon" },
        title: { ko: "철거 완료", en: "Demolition complete" },
        body: {
          ko: "기존 마감재와 비내력벽 철거 완료. 폐기물 정리까지 끝났습니다.",
          en: "Existing finishes and non-load-bearing walls removed. Debris cleared.",
        },
        photos: [IMAGES.projectUpdates[1], IMAGES.projectUpdates[2]],
      },
    ],
    pmMessages: [
      {
        id: "pm-1",
        sender: "pm",
        body: {
          ko: "안녕하세요, 마포 프로젝트 전담 PM 이서영입니다. 진행 상황 매일 정리해 드리고 궁금한 점 있으시면 언제든 메시지 주세요.",
          en: "Hi! I'm Seoyeong, your dedicated PM for the Mapo project. I'll send daily summaries — message me anytime.",
        },
        time: "2026-04-01 09:12",
      },
      {
        id: "pm-2",
        sender: "user",
        body: {
          ko: "혹시 자재 견본 한 번 더 확인 가능할까요? 마루 톤이 좀 어두운 거 아닌가 걱정돼서요.",
          en: "Could I see the flooring sample once more? Worried it's a bit too dark.",
        },
        time: "2026-04-04 21:33",
      },
      {
        id: "pm-3",
        sender: "pm",
        body: {
          ko: "네 가능합니다. 내일 오전 시공자분이 견본 3종 가져가실 거예요. 자연광에서 직접 보시고 결정하시면 됩니다.",
          en: "Of course. The pro will bring 3 samples tomorrow morning. You can decide in natural light.",
        },
        time: "2026-04-04 22:01",
      },
      {
        id: "pm-4",
        sender: "user",
        body: { ko: "감사합니다 :)", en: "Thanks!" },
        time: "2026-04-04 22:05",
      },
      {
        id: "pm-5",
        sender: "pm",
        body: {
          ko: "도장 톤 사진 방금 올라왔어요. 확인하시고 다른 의견 있으면 알려주세요.",
          en: "Just posted the paint-tone photos. Let me know if anything looks off.",
        },
        time: "2026-04-26 14:22",
      },
    ],
    notifications: [
      {
        id: "n-1",
        time: "2 시간 전",
        title: { ko: "새 업데이트", en: "New update" },
        body: { ko: "도장 1차 완료 사진이 올라왔어요.", en: "First paint coat photos posted." },
        unread: true,
      },
      {
        id: "n-2",
        time: "어제",
        title: { ko: "PM 메시지", en: "PM message" },
        body: {
          ko: "이서영 PM이 메시지를 보냈습니다.",
          en: "Seoyeong sent you a message.",
        },
        unread: true,
      },
      {
        id: "n-3",
        time: "3 일 전",
        title: { ko: "공정 진입", en: "Phase started" },
        body: { ko: "도장 공정이 시작되었습니다.", en: "Painting phase has begun." },
        unread: false,
      },
    ],
  },
  {
    id: "proj-songpa-25",
    title: { ko: "송파 25평 침실 + 욕실", en: "Songpa 82m² Bedroom + Bath" },
    contractorId: "han-skandi",
    status: "completed",
    progress: 100,
    currentStage: "finishing",
    startDate: "2026-02-10",
    expectedEnd: "2026-03-25",
    daysLeft: 0,
    pm: {
      name: { ko: "최유진 PM", en: "Yujin Choi, PM" },
      role: { ko: "전담 프로젝트 매니저", en: "Dedicated PM" },
      avatar: IMAGES.contractors.profiles[3],
      responseHours: 2,
    },
    updates: [
      {
        id: "su-1",
        date: "2026-03-25",
        stage: "finishing",
        author: { ko: "한수아 시공자", en: "Sua Han, contractor" },
        title: { ko: "최종 검수 완료, 인계", en: "Final inspection done, handover" },
        body: {
          ko: "모든 공정 완료, 청소까지 마치고 키 인계했습니다. 보증 1개월 시작 안내드렸습니다.",
          en: "All work complete, deep-cleaned, and keys handed over. 1-month warranty period begins today.",
        },
        photos: [IMAGES.projectCompleted[0], IMAGES.projectCompleted[1], IMAGES.projectCompleted[2]],
      },
      {
        id: "su-2",
        date: "2026-03-21",
        stage: "finishing",
        author: { ko: "한수아 시공자", en: "Sua Han, contractor" },
        title: { ko: "마감재 시공 완료", en: "Finishing materials installed" },
        body: {
          ko: "걸레받이, 몰딩, 콘센트 커버까지 모두 마무리했습니다. 청소 후 검수 예정입니다.",
          en: "Skirting, molding, and outlet covers done. Cleaning + inspection next.",
        },
        photos: [IMAGES.projectCompleted[3], IMAGES.projectCompleted[4]],
      },
      {
        id: "su-3",
        date: "2026-03-12",
        stage: "painting",
        author: { ko: "도장 팀 박정훈", en: "Painting lead Junghoon Park" },
        title: { ko: "도장 2차 완료", en: "Second paint coat done" },
        body: {
          ko: "협의된 화이트 톤으로 2차 도장 완료. 톤 일정합니다.",
          en: "Second coat in the agreed white tone — even and consistent.",
        },
        photos: [IMAGES.projectCompleted[5], IMAGES.projectCompleted[0]],
      },
      {
        id: "su-4",
        date: "2026-02-28",
        stage: "carpentry",
        author: { ko: "목공 팀 김도윤", en: "Carpentry lead Doyun Kim" },
        title: { ko: "붙박이장 설치 완료", en: "Built-in wardrobe installed" },
        body: {
          ko: "침실 붙박이장과 욕실 수납장 설치 완료. 슬라이딩 도어 부드럽게 작동.",
          en: "Bedroom built-in and bathroom cabinets installed; sliding doors smooth.",
        },
        photos: [IMAGES.projectUpdates[3], IMAGES.projectUpdates[4]],
      },
      {
        id: "su-5",
        date: "2026-02-18",
        stage: "plumbing",
        author: { ko: "배관 팀 정태식", en: "Plumbing lead Taesik Jung" },
        title: { ko: "욕실 배관·방수 완료", en: "Bath plumbing + waterproofing done" },
        body: {
          ko: "방수층 2중 시공 완료, 24시간 누수 테스트 통과.",
          en: "Two-layer waterproofing done; 24h leak test passed.",
        },
        photos: [IMAGES.projectUpdates[1], IMAGES.projectUpdates[2]],
      },
      {
        id: "su-6",
        date: "2026-02-10",
        stage: "demolition",
        author: { ko: "철거 팀 윤재호", en: "Demo lead Jaeho Yoon" },
        title: { ko: "철거 시작", en: "Demolition started" },
        body: {
          ko: "기존 가구·마감재 철거 시작. 폐기물 분리수거 진행 중.",
          en: "Old furniture and finishes removed; debris being sorted.",
        },
        photos: [IMAGES.projectUpdates[0]],
      },
    ],
    pmMessages: [
      {
        id: "spm-1",
        sender: "pm",
        body: {
          ko: "안녕하세요 송파 프로젝트 PM 최유진입니다. 시공 완료 후에도 1개월 동안 보증을 책임집니다.",
          en: "Hi! Yujin here, PM for Songpa. We back the project for the full 1-month warranty period.",
        },
        time: "2026-03-25 16:00",
      },
    ],
    notifications: [],
  },
  {
    id: "proj-bundang-18",
    title: { ko: "분당 18평 신혼 거실", en: "Bundang 60m² Newlywed Living" },
    contractorId: "han-skandi",
    status: "pending",
    progress: 0,
    currentStage: "demolition",
    startDate: "2026-05-20",
    expectedEnd: "2026-06-30",
    daysLeft: 41,
    pm: {
      name: { ko: "이서영 PM", en: "Seoyeong Lee, PM" },
      role: { ko: "전담 프로젝트 매니저", en: "Dedicated PM" },
      avatar: IMAGES.contractors.profiles[1],
      responseHours: 1,
    },
    updates: [],
    pmMessages: [],
    notifications: [],
  },
];

export function getProject(id: string): Project | undefined {
  return PROJECTS.find((p) => p.id === id);
}

export function getActiveProject(): Project {
  return PROJECTS.find((p) => p.status === "in_progress") ?? PROJECTS[0];
}
