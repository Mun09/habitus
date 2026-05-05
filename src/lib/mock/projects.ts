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
    title: "Mapo 105m² Living + Kitchen",
    contractorId: "kim-warm",
    status: "in_progress",
    progress: 62,
    currentStage: "painting",
    startDate: "2026-04-01",
    expectedEnd: "2026-05-12",
    daysLeft: 14,
    pm: {
      name: "Seoyeong Lee, PM",
      role: "Dedicated PM",
      avatar: IMAGES.contractors.profiles[1],
      responseHours: 1,
    },
    updates: [
      {
        id: "up-1",
        date: "2026-04-26",
        stage: "painting",
        author: "Site lead Junghoon Park",
        title: "First paint coat done, tone check",
        body: "First coat finished. The tone reads slightly warm under afternoon light — within the agreed beige spec. Second coat scheduled in 2 days.",
        photos: [IMAGES.projectUpdates[0], IMAGES.projectUpdates[1], IMAGES.projectUpdates[2]],
      },
      {
        id: "up-2",
        date: "2026-04-22",
        stage: "carpentry",
        author: "Carpentry lead Doyun Kim",
        title: "Upper kitchen cabinets installed",
        body: "All upper cabinets installed in birch ply as agreed. Joints to be finished tomorrow.",
        photos: [IMAGES.projectUpdates[3], IMAGES.projectUpdates[4]],
      },
      {
        id: "up-3",
        date: "2026-04-18",
        stage: "carpentry",
        author: "Carpentry lead Doyun Kim",
        title: "Living room sliding-door frame",
        body: "Sliding-door frame between living and bedroom installed. Slides smoothly.",
        photos: [IMAGES.projectUpdates[5], IMAGES.projectUpdates[6]],
      },
      {
        id: "up-4",
        date: "2026-04-12",
        stage: "electrical",
        author: "Electrical lead Sangmin Han",
        title: "Lighting layout updated",
        body: "Main living light shifted by 30cm as discussed. No cost change.",
        photos: [IMAGES.projectUpdates[7]],
      },
      {
        id: "up-5",
        date: "2026-04-08",
        stage: "plumbing",
        author: "Plumbing lead Taesik Jung",
        title: "Kitchen plumbing replaced",
        body: "Aging pipes replaced with PEX. Functional test passed.",
        photos: [IMAGES.projectUpdates[0], IMAGES.projectUpdates[3]],
      },
      {
        id: "up-6",
        date: "2026-04-02",
        stage: "demolition",
        author: "Demo lead Jaeho Yoon",
        title: "Demolition complete",
        body: "Existing finishes and non-load-bearing walls removed. Debris cleared.",
        photos: [IMAGES.projectUpdates[1], IMAGES.projectUpdates[2]],
      },
    ],
    pmMessages: [
      {
        id: "pm-1",
        sender: "pm",
        body: "Hi! I'm Seoyeong, your dedicated PM for the Mapo project. I'll send daily summaries — message me anytime.",
        time: "2026-04-01 09:12",
      },
      {
        id: "pm-2",
        sender: "user",
        body: "Could I see the flooring sample once more? Worried it's a bit too dark.",
        time: "2026-04-04 21:33",
      },
      {
        id: "pm-3",
        sender: "pm",
        body: "Of course. The pro will bring 3 samples tomorrow morning. You can decide in natural light.",
        time: "2026-04-04 22:01",
      },
      {
        id: "pm-4",
        sender: "user",
        body: "Thanks!",
        time: "2026-04-04 22:05",
      },
      {
        id: "pm-5",
        sender: "pm",
        body: "Just posted the paint-tone photos. Let me know if anything looks off.",
        time: "2026-04-26 14:22",
      },
    ],
    notifications: [
      {
        id: "n-1",
        time: "2 hours ago",
        title: "New update",
        body: "First paint coat photos posted.",
        unread: true,
      },
      {
        id: "n-2",
        time: "Yesterday",
        title: "PM message",
        body: "Seoyeong sent you a message.",
        unread: true,
      },
      {
        id: "n-3",
        time: "3 days ago",
        title: "Phase started",
        body: "Painting phase has begun.",
        unread: false,
      },
    ],
  },
  {
    id: "proj-songpa-25",
    title: "Songpa 82m² Bedroom + Bath",
    contractorId: "han-skandi",
    status: "completed",
    progress: 100,
    currentStage: "finishing",
    startDate: "2026-02-10",
    expectedEnd: "2026-03-25",
    daysLeft: 0,
    pm: {
      name: "Yujin Choi, PM",
      role: "Dedicated PM",
      avatar: IMAGES.contractors.profiles[3],
      responseHours: 2,
    },
    updates: [
      {
        id: "su-1",
        date: "2026-03-25",
        stage: "finishing",
        author: "Sua Han, contractor",
        title: "Final inspection done, handover",
        body: "All work complete, deep-cleaned, and keys handed over.",
        photos: [IMAGES.projectCompleted[0], IMAGES.projectCompleted[1], IMAGES.projectCompleted[2]],
      },
      {
        id: "su-2",
        date: "2026-03-21",
        stage: "finishing",
        author: "Sua Han, contractor",
        title: "Finishing materials installed",
        body: "Skirting, molding, and outlet covers done. Cleaning + inspection next.",
        photos: [IMAGES.projectCompleted[3], IMAGES.projectCompleted[4]],
      },
      {
        id: "su-3",
        date: "2026-03-12",
        stage: "painting",
        author: "Painting lead Junghoon Park",
        title: "Second paint coat done",
        body: "Second coat in the agreed white tone — even and consistent.",
        photos: [IMAGES.projectCompleted[5], IMAGES.projectCompleted[0]],
      },
      {
        id: "su-4",
        date: "2026-02-28",
        stage: "carpentry",
        author: "Carpentry lead Doyun Kim",
        title: "Built-in wardrobe installed",
        body: "Bedroom built-in and bathroom cabinets installed; sliding doors smooth.",
        photos: [IMAGES.projectUpdates[3], IMAGES.projectUpdates[4]],
      },
      {
        id: "su-5",
        date: "2026-02-18",
        stage: "plumbing",
        author: "Plumbing lead Taesik Jung",
        title: "Bath plumbing + waterproofing done",
        body: "Two-layer waterproofing done; 24h leak test passed.",
        photos: [IMAGES.projectUpdates[1], IMAGES.projectUpdates[2]],
      },
      {
        id: "su-6",
        date: "2026-02-10",
        stage: "demolition",
        author: "Demo lead Jaeho Yoon",
        title: "Demolition started",
        body: "Old furniture and finishes removed; debris being sorted.",
        photos: [IMAGES.projectUpdates[0]],
      },
    ],
    pmMessages: [
      {
        id: "spm-1",
        sender: "pm",
        body: "Hi! Yujin here, PM for Songpa. Reach out anytime if you spot anything during walkthroughs.",
        time: "2026-03-25 16:00",
      },
    ],
    notifications: [],
  },
  {
    id: "proj-bundang-18",
    title: "Bundang 60m² Newlywed Living",
    contractorId: "han-skandi",
    status: "pending",
    progress: 0,
    currentStage: "demolition",
    startDate: "2026-05-20",
    expectedEnd: "2026-06-30",
    daysLeft: 41,
    pm: {
      name: "Seoyeong Lee, PM",
      role: "Dedicated PM",
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
