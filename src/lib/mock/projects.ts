import type { Bilingual } from "./contractors";
import { IMAGES, PROJECT_W2_PHOTOS } from "./images";

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
    id: "proj-w2-space",
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
        id: "w2-up-1",
        date: "2026-05-07",
        stage: "carpentry",
        author: "Site lead 박정훈",
        title: "Open lounge alignment against AI proposal",
        body: "The open lounge layout was checked against the AI proposal. Hardwood floor protection stays on while the warm dining and lounge zones are framed in to match the approved W2-1 plan.",
        photos: [
          PROJECT_W2_PHOTOS.before[0],
          PROJECT_W2_PHOTOS.after[0],
        ],
      },
      {
        id: "w2-up-2",
        date: "2026-05-05",
        stage: "carpentry",
        author: "Carpentry lead 김도윤",
        title: "Meeting bay partition frame installed",
        body: "The meeting bay frame is in place. The wall TV side and the glass partition by ROOM 200 stay open, with enough structure added for acoustic panels behind the seating row.",
        photos: [
          PROJECT_W2_PHOTOS.before[2],
          PROJECT_W2_PHOTOS.after[2],
        ],
      },
      {
        id: "w2-up-3",
        date: "2026-05-03",
        stage: "electrical",
        author: "Electrical lead 한상민",
        title: "Ceiling track lighting routes marked",
        body: "Track lighting and indirect strips were marked along the existing ceiling grid above the entry and lounge. AC vent and projector positions are kept; no extra fixture count was added beyond the confirmed plan.",
        photos: [
          PROJECT_W2_PHOTOS.before[1],
          PROJECT_W2_PHOTOS.after[1],
        ],
      },
      {
        id: "w2-up-4",
        date: "2026-05-01",
        stage: "plumbing",
        author: "Site lead 박정훈",
        title: "Ceiling utility route confirmed",
        body: "Utility access along the entry ceiling was checked before closing the soffit. The route around the AC unit and projector remains serviceable from above.",
        photos: [
          PROJECT_W2_PHOTOS.before[1],
        ],
      },
      {
        id: "w2-up-5",
        date: "2026-04-30",
        stage: "demolition",
        author: "Demo lead 윤재호",
        title: "Loose fixtures and old finishes removed",
        body: "Existing loose fixtures were removed from the W2-1 open lounge area. Floor protection is down on the hardwood, and reusable furniture was tagged before storage.",
        photos: [
          PROJECT_W2_PHOTOS.before[0],
        ],
      },
    ],
    pmMessages: [
      {
        id: "w2-pm-1",
        sender: "pm",
        body: "Hi, I am 이서영, your PM for the W2-1 Space Lounge Renewal. I will keep the AI proposal, materials, and site updates aligned here.",
        time: "2026-04-29 09:12",
      },
      {
        id: "w2-pm-2",
        sender: "user",
        body: "Please make sure the open lounge does not feel too dark compared with the AI proposal.",
        time: "2026-05-03 20:18",
      },
      {
        id: "w2-pm-3",
        sender: "pm",
        body: "Noted. We are checking ceiling track temperature and indirect strip placement together before the panels close.",
        time: "2026-05-03 20:42",
      },
      {
        id: "w2-pm-4",
        sender: "pm",
        body: "Today's update includes the open lounge alignment check and photos beside the AI proposal.",
        time: "2026-05-07 14:22",
      },
    ],
    notifications: [
      {
        id: "w2-n-1",
        time: "2 hours ago",
        title: "W2-1 update posted",
        body: "Open lounge alignment photos are ready.",
        unread: true,
      },
      {
        id: "w2-n-2",
        time: "Yesterday",
        title: "PM note",
        body: "Ceiling track temperature will be checked before panel close.",
        unread: true,
      },
      {
        id: "w2-n-3",
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
