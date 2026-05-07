"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/lib/i18n/locale-provider";
import { PROJECTS } from "@/lib/mock/projects";
import { CONTRACTORS } from "@/lib/mock/contractors";

export default function ProjectsPage() {
  const { t } = useLocale();

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-10">
      <div className="border-b border-border pb-6">
        <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Tracking Room
        </div>
        <h1 className="serif text-3xl font-medium leading-tight text-secondary md:text-5xl">
          {t("nav.projects")}
        </h1>
        <p className="mt-3 text-muted-foreground">
          W2-1 space design, contractor handoff, and site progress in one place.
        </p>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {PROJECTS.map((p) => {
          const contractor = CONTRACTORS.find((c) => c.id === p.contractorId);
          const href = `/projects/${p.id}`;
          const cover = p.updates[0]?.photos[0] ?? contractor?.cover;
          return (
            <Link
              key={p.id}
              href={href}
              className="group overflow-hidden border border-border bg-card transition hover:shadow-[var(--shadow-warm)]"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                {cover && (
                  <Image
                    src={cover}
                    alt={p.title}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
                <div className="absolute top-4 left-4">
                  {p.status === "in_progress" && (
                    <Badge variant="primary">
                      <Clock className="h-3 w-3" />
                      In progress
                    </Badge>
                  )}
                  {p.status === "completed" && (
                    <Badge variant="success">
                      <CheckCircle2 className="h-3 w-3" />
                      Completed
                    </Badge>
                  )}
                  {p.status === "pending" && (
                    <Badge variant="muted">Pending</Badge>
                  )}
                </div>
              </div>
              <div className="p-6">
                <div className="serif text-xl font-medium leading-tight">
                  {p.title}
                </div>
                {contractor && (
                  <div className="text-sm text-muted-foreground mt-1">
                    {contractor.company}
                  </div>
                )}
                {p.status === "in_progress" && (
                  <div className="mt-5">
                    <div className="flex justify-between text-xs text-muted-foreground mb-2">
                      <span>{t("tracking.progress")}</span>
                      <span>{p.progress}%</span>
                    </div>
                    <Progress value={p.progress} />
                  </div>
                )}
                <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {p.startDate} / {p.expectedEnd}
                  </span>
                  <span className="inline-flex items-center gap-1 text-primary group-hover:translate-x-0.5 transition">
                    Open <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
