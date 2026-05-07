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
    id: "proj-w8-space",
    title: "W2-1 Space Lounge Renewal",
    contractorId: "park-rough",
    status: "in_progress",
    progress: 58,
    currentStage: "carpentry",
    startDate: "2026-04-29",
    expectedEnd: "2026-05-16",
    daysLeft: 9,
    pm: {
      name: "이서영, PM",
      role: "W2-1 space project manager",
      avatar: IMAGES.contractors.profiles[1],
      responseHours: 1,
    },
    updates: [
      {
        id: "w8-up-1",
        date: "2026-05-07",
        stage: "carpentry",
        author: "Site lead 박정훈",
        title: "TV lounge millwork alignment check",
        body: "The lounge wall line was checked against the AI proposal. Cable paths are hidden inside the new frame, and the display wall depth matches the approved W2-1 plan.",
        photos: [
          IMAGES.scenarios.w8.tvLounge,
          IMAGES.scenarios.w8.ai.tvLounge,
          IMAGES.scenarios.w8.openLounge,
        ],
      },
      {
        id: "w8-up-2",
        date: "2026-05-05",
        stage: "carpentry",
        author: "Carpentry lead 김도윤",
        title: "Meeting bay partition frame installed",
        body: "The meeting bay frame is in place. We kept the open sightline from the studio entry while adding enough structure for acoustic panels.",
        photos: [
          IMAGES.scenarios.w8.meetingBay,
          IMAGES.scenarios.w8.ai.meetingBay,
        ],
      },
      {
        id: "w8-up-3",
        date: "2026-05-03",
        stage: "electrical",
        author: "Electrical lead 한상민",
        title: "Lighting routes marked for lounge scenes",
        body: "Track lighting and indirect strips were marked for the studio entry, TV lounge, and open lounge. No extra fixture count was added beyond the confirmed plan.",
        photos: [
          IMAGES.scenarios.w8.studioEntry,
          IMAGES.scenarios.w8.ai.studioEntry,
        ],
      },
      {
        id: "w8-up-4",
        date: "2026-05-01",
        stage: "plumbing",
        author: "Site lead 박정훈",
        title: "Cafe counter utility route confirmed",
        body: "Utility access around the Home Cafe zone was checked before closing the wall. The route remains serviceable from the staff side.",
        photos: [
          IMAGES.scenarios.random.referenceSpace,
          IMAGES.scenarios.random.styles[3],
        ],
      },
      {
        id: "w8-up-5",
        date: "2026-04-30",
        stage: "demolition",
        author: "Demo lead 윤재호",
        title: "Loose fixtures and old finishes removed",
        body: "Existing loose fixtures were removed from the W2-1 lounge area. Floor protection is down, and reusable furniture was tagged before storage.",
        photos: [
          IMAGES.scenarios.w8.openLounge,
          IMAGES.scenarios.w8.meetingBay,
        ],
      },
    ],
    pmMessages: [
      {
        id: "w8-pm-1",
        sender: "pm",
        body: "Hi, I am 이서영, your PM for the W2-1 Space Lounge Renewal. I will keep the AI proposal, materials, and site updates aligned here.",
        time: "2026-04-29 09:12",
      },
      {
        id: "w8-pm-2",
        sender: "user",
        body: "Please make sure the TV lounge does not feel too dark compared with the AI proposal.",
        time: "2026-05-03 20:18",
      },
      {
        id: "w8-pm-3",
        sender: "pm",
        body: "Noted. We are checking wall depth and light temperature together before the panels close.",
        time: "2026-05-03 20:42",
      },
      {
        id: "w8-pm-4",
        sender: "pm",
        body: "Today's update includes the TV lounge alignment check and photos beside the AI proposal.",
        time: "2026-05-07 14:22",
      },
    ],
    notifications: [
      {
        id: "w8-n-1",
        time: "2 hours ago",
        title: "W2-1 update posted",
        body: "TV lounge millwork alignment photos are ready.",
        unread: true,
      },
      {
        id: "w8-n-2",
        time: "Yesterday",
        title: "PM note",
        body: "Lighting temperature will be checked before panel close.",
        unread: true,
      },
      {
        id: "w8-n-3",
        time: "3 days ago",
        title: "Carpentry started",
        body: "Meeting bay partition frame is underway.",
        unread: false,
      },
    ],
  },
];

export function getProject(id: string): Project | undefined {
  return PROJECTS.find((p) => p.id === id);
}

export function getActiveProject(): Project {
  return PROJECTS.find((p) => p.status === "in_progress") ?? PROJECTS[0];
}
