import { IMAGES } from "@/lib/mock/images";
import type {
  ChatMessage,
  Project,
  ProjectStage,
  Update,
} from "@/lib/mock/projects";

type ProjectRow = {
  id: string;
  user_id: string;
  contractor_id: string;
  title: string;
  status: Project["status"];
  progress: number;
  current_stage: ProjectStage;
  start_date: string | null;
  expected_end: string | null;
  pm_name: string | null;
  pm_role: string | null;
  pm_avatar: string | null;
  pm_response_hours: number;
};

type UpdateRow = {
  id: string;
  project_id: string;
  stage: string | null;
  author: string | null;
  title: string | null;
  body: string | null;
  photos: string[] | null;
  created_at: string;
};

type ChatRow = {
  id: string;
  project_id: string;
  sender_type: "user" | "pm" | "ai" | "system";
  body: string;
  created_at: string;
};

const DEFAULT_PM_AVATAR = IMAGES.contractors.profiles[1];

function daysBetween(from: Date, to: Date): number {
  return Math.max(0, Math.ceil((to.getTime() - from.getTime()) / 86_400_000));
}

function formatDate(iso: string): string {
  return iso.slice(0, 10);
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
}

function rowToUpdate(row: UpdateRow): Update {
  return {
    id: row.id,
    date: formatDate(row.created_at),
    stage: (row.stage as ProjectStage) ?? "demolition",
    author: row.author ?? "Site lead",
    title: row.title ?? "Update",
    body: row.body ?? "",
    photos: row.photos ?? [],
  };
}

export function rowToChatMessage(row: ChatRow): ChatMessage {
  return {
    id: row.id,
    sender: row.sender_type === "system" ? "ai" : row.sender_type,
    body: row.body,
    time: formatTimestamp(row.created_at),
  };
}

export function rowToProject(
  row: ProjectRow,
  updates: UpdateRow[],
  chats: ChatRow[]
): Project {
  const today = new Date();
  const end = row.expected_end ? new Date(row.expected_end) : null;
  const daysLeft = end ? daysBetween(today, end) : 0;

  return {
    id: row.id,
    title: row.title,
    contractorId: row.contractor_id,
    status: row.status,
    progress: row.progress ?? 0,
    currentStage: row.current_stage ?? "demolition",
    startDate: row.start_date ?? formatDate(new Date().toISOString()),
    expectedEnd: row.expected_end ?? "",
    daysLeft,
    pm: {
      name: row.pm_name ?? "Project Manager",
      role: row.pm_role ?? "Project Manager",
      avatar: row.pm_avatar ?? DEFAULT_PM_AVATAR,
      responseHours: row.pm_response_hours ?? 24,
    },
    updates: updates.map(rowToUpdate),
    pmMessages: chats.map(rowToChatMessage),
    // notifications belong to a separate table; MVP renders an empty list.
    notifications: [],
  };
}
