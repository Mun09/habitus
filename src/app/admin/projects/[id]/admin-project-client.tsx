"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  addProjectUpdate,
  sendPmMessage,
  updateProjectProgress,
} from "@/app/admin/actions";

const STAGES = [
  "demolition",
  "plumbing",
  "electrical",
  "carpentry",
  "painting",
  "finishing",
] as const;

const STATUSES = ["pending", "in_progress", "completed", "cancelled"] as const;

type ProjectRow = {
  id: string;
  title: string;
  status: string;
  progress: number;
  current_stage: string;
};

type UpdateRow = {
  id: string;
  stage: string | null;
  author: string | null;
  title: string | null;
  body: string | null;
  photos: string[] | null;
  created_at: string;
};

type ChatRow = {
  id: string;
  sender_type: string;
  body: string;
  created_at: string;
};

export function AdminProjectClient({
  project,
  updates,
  chats,
}: {
  project: ProjectRow;
  updates: UpdateRow[];
  chats: ChatRow[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  // Progress + stage form
  const [progress, setProgress] = useState(project.progress);
  const [stage, setStage] = useState(project.current_stage);
  const [status, setStatus] = useState(project.status);

  const saveProgress = () => {
    startTransition(async () => {
      const result = await updateProjectProgress({
        projectId: project.id,
        progress,
        currentStage: stage,
        status,
      });
      if ("error" in result) toast.error(result.error);
      else {
        toast.success("Progress saved");
        router.refresh();
      }
    });
  };

  // New update form
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateBody, setUpdateBody] = useState("");
  const [updateStage, setUpdateStage] = useState<string>(project.current_stage);
  const [updateAuthor, setUpdateAuthor] = useState("PM");
  const [updatePhotos, setUpdatePhotos] = useState("");

  const postUpdate = () => {
    if (!updateTitle.trim()) {
      toast.error("Title is required");
      return;
    }
    const photos = updatePhotos
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
    startTransition(async () => {
      const result = await addProjectUpdate({
        projectId: project.id,
        stage: updateStage,
        author: updateAuthor,
        title: updateTitle,
        body: updateBody,
        photos,
      });
      if ("error" in result) toast.error(result.error);
      else {
        toast.success("Update published");
        setUpdateTitle("");
        setUpdateBody("");
        setUpdatePhotos("");
        router.refresh();
      }
    });
  };

  // PM message form
  const [chatBody, setChatBody] = useState("");
  const postMessage = () => {
    if (!chatBody.trim()) return;
    startTransition(async () => {
      const result = await sendPmMessage(project.id, chatBody);
      if ("error" in result) toast.error(result.error);
      else {
        setChatBody("");
        toast.success("Message sent");
        router.refresh();
      }
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Left column: progress + new update */}
      <section className="space-y-6">
        <div className="border border-border bg-card p-5">
          <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-3">
            Progress / Stage
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>{progress}%</span>
            <span>{stage}</span>
          </div>
          <Progress value={progress} />
          <div className="mt-4 grid gap-3">
            <Input
              type="number"
              min={0}
              max={100}
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value || 0))}
            />
            <Select value={stage} onValueChange={setStage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STAGES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={saveProgress} disabled={pending}>
              Save progress
            </Button>
          </div>
        </div>

        <div className="border border-border bg-card p-5">
          <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-3">
            Publish site update
          </div>
          <div className="grid gap-3">
            <Input
              placeholder="Title"
              value={updateTitle}
              onChange={(e) => setUpdateTitle(e.target.value)}
            />
            <Input
              placeholder="Author (e.g. Site lead 박정훈)"
              value={updateAuthor}
              onChange={(e) => setUpdateAuthor(e.target.value)}
            />
            <Select value={updateStage} onValueChange={setUpdateStage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STAGES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea
              rows={4}
              placeholder="What happened on site today?"
              value={updateBody}
              onChange={(e) => setUpdateBody(e.target.value)}
            />
            <Textarea
              rows={3}
              placeholder={"Photo URLs (one per line)\nhttps://..."}
              value={updatePhotos}
              onChange={(e) => setUpdatePhotos(e.target.value)}
            />
            <Button onClick={postUpdate} disabled={pending}>
              Publish update
            </Button>
          </div>
        </div>
      </section>

      {/* Right column: chat + history */}
      <section className="space-y-6">
        <div className="border border-border bg-card p-5">
          <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-3">
            Send PM message
          </div>
          <Textarea
            rows={3}
            placeholder="Message to the customer"
            value={chatBody}
            onChange={(e) => setChatBody(e.target.value)}
          />
          <div className="mt-3">
            <Button onClick={postMessage} disabled={pending}>
              Send to customer
            </Button>
          </div>
        </div>

        <div className="border border-border bg-card p-5">
          <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-3">
            Recent chat ({chats.length})
          </div>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {chats.length === 0 ? (
              <div className="text-xs text-muted-foreground">
                No messages yet.
              </div>
            ) : (
              chats.map((c) => (
                <div key={c.id} className="text-sm">
                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground mr-2">
                    {c.sender_type}
                  </span>
                  {c.body}
                  <div className="text-[10px] text-muted-foreground">
                    {new Date(c.created_at).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="border border-border bg-card p-5">
          <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-3">
            Published updates ({updates.length})
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {updates.length === 0 ? (
              <div className="text-xs text-muted-foreground">
                No updates published yet.
              </div>
            ) : (
              updates.map((u) => (
                <div key={u.id} className="border-l-2 border-primary/50 pl-3">
                  <div className="text-xs text-muted-foreground">
                    {new Date(u.created_at).toLocaleDateString()} · {u.stage} ·{" "}
                    {u.author}
                  </div>
                  <div className="text-sm font-medium">{u.title}</div>
                  {u.body && (
                    <div className="text-xs text-foreground/80 mt-1">{u.body}</div>
                  )}
                  {u.photos && u.photos.length > 0 && (
                    <div className="text-[10px] text-muted-foreground mt-1">
                      {u.photos.length} photo(s)
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
