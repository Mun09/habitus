"use client";

import Link from "next/link";
import { use } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Clock } from "lucide-react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/lib/i18n/locale-provider";
import { getProject } from "@/lib/mock/projects";
import { CONTRACTORS } from "@/lib/mock/contractors";
import { PROJECT_W2_PHOTOS } from "@/lib/mock/images";
import { MiniGantt } from "@/components/tracking/mini-gantt";
import { UpdateTimeline } from "@/components/tracking/update-timeline";
import { ChatPanel } from "@/components/tracking/chat-panel";
import { NotificationSheet } from "@/components/tracking/notification-sheet";

export default function TrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { t } = useLocale();
  const project = getProject(id);
  if (!project) notFound();

  const contractor = CONTRACTORS.find((c) => c.id === project.contractorId);
  const isCompleted = project.status === "completed";

  const ProjectInfo = (
    <div className="space-y-4">
      <div className="border border-border bg-card p-5 shadow-[var(--shadow-warm)]">
        <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-1">
          {t("tracking.column.info")}
        </div>
        <div className="serif text-lg font-medium leading-tight">
          {project.title}
        </div>
        {contractor && (
          <Link
            href={`/matching/${contractor.id}`}
            className="mt-3 flex items-center gap-3 hover:opacity-80"
          >
            <div className="relative h-10 w-10 overflow-hidden rounded-md">
              <Image
                src={contractor.profileImage}
                alt=""
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">
                {contractor.company}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {contractor.name}
              </div>
            </div>
          </Link>
        )}
        <div className="mt-5">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>{t("tracking.progress")}</span>
            <span className="text-foreground font-medium">{project.progress}%</span>
          </div>
          <Progress value={project.progress} />
        </div>
        {isCompleted ? (
          <div className="mt-4 flex items-center gap-2 text-xs">
            <CheckCircle2 className="h-3.5 w-3.5 text-[color:var(--success)]" />
            <span className="text-muted-foreground">{t("tracking.completedAt")}</span>
            <span className="font-medium">{project.expectedEnd}</span>
          </div>
        ) : (
          <div className="mt-4 flex items-center gap-2 text-xs">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span className="text-muted-foreground">{t("tracking.dDay")}</span>
            <span className="font-medium">
              {project.daysLeft} {t("tracking.days")}
            </span>
          </div>
        )}
      </div>

      <MiniGantt current={project.currentStage} />

      <div className="border border-border bg-card p-5 shadow-[var(--shadow-warm)]">
        <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-3">
          {t("tracking.pm.title")}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-md">
            <Image
              src={project.pm.avatar}
              alt=""
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
          <div>
            <div className="text-sm font-medium">{project.pm.name}</div>
            <div className="text-xs text-muted-foreground">
              {project.pm.role}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-10">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("nav.projects")}
        </Link>
        <NotificationSheet items={project.notifications} />
      </div>

      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        Tracking Room
      </div>
      <div className="mb-2 flex flex-wrap items-center gap-3">
        <h1 className="serif text-3xl font-medium leading-tight text-secondary md:text-5xl">
          {isCompleted ? t("tracking.history") : t("tracking.title")}
        </h1>
        {isCompleted && (
          <Badge variant="success">
            <CheckCircle2 className="h-3 w-3" />
            {t("tracking.completedBadge")}
          </Badge>
        )}
      </div>
      <p className="border-b border-border pb-6 text-sm text-muted-foreground">{project.title}</p>

      {/* Mobile: Tabs */}
      <div className="md:hidden mt-6">
        <Tabs defaultValue="timeline">
          <TabsList className="w-full">
            <TabsTrigger value="info" className="flex-1">{t("tracking.column.info")}</TabsTrigger>
            <TabsTrigger value="timeline" className="flex-1">
              {isCompleted ? t("tracking.history") : t("tracking.column.timeline")}
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex-1">
              {t("tracking.column.chat")}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="info">{ProjectInfo}</TabsContent>
          <TabsContent value="timeline">
            <UpdateTimeline updates={project.updates} />
          </TabsContent>
          <TabsContent value="chat">
            {isCompleted ? (
              <CompletedSidePanel />
            ) : (
              <ChatPanel project={project} />
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Desktop: 3 columns, left + right sticky */}
      <div className="mt-8 hidden items-start gap-6 md:grid md:grid-cols-[260px_1fr_360px]">
        <div className="sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto no-scrollbar">
          {ProjectInfo}
        </div>
        <div>
          <UpdateTimeline updates={project.updates} />
        </div>
        <div className="sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto no-scrollbar">
          {isCompleted ? (
            <CompletedSidePanel />
          ) : (
            <ChatPanel project={project} />
          )}
        </div>
      </div>
    </div>
  );
}

function CompletedSidePanel() {
  const completedPhotos = [...PROJECT_W2_PHOTOS.after, PROJECT_W2_PHOTOS.before[0]];

  return (
    <div className="space-y-4">
      <div className="overflow-hidden border border-border bg-card shadow-[var(--shadow-warm)]">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Completed photos
          </span>
          <span className="text-xs text-muted-foreground">
            {completedPhotos.length}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1 p-1">
          {completedPhotos.map((src, i) => (
            <div
              key={i}
              className="relative aspect-square overflow-hidden bg-muted"
            >
              <Image src={src} alt="" fill sizes="160px" className="object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
