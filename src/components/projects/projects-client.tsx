"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/lib/i18n/locale-provider";
import type { Project } from "@/lib/mock/projects";
import type { Contractor } from "@/lib/mock/contractors";

export function ProjectsClient({
  projects,
  contractors,
}: {
  projects: Project[];
  contractors: Contractor[];
}) {
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
          Design, contractor handoff, and site progress in one place.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="mt-8 border border-dashed border-border bg-card p-16 text-center">
          <p className="text-sm text-muted-foreground">
            You haven&apos;t started a project yet.
          </p>
          <Link
            href="/design"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Start with AI Design Studio
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {projects.map((p) => {
            const contractor = contractors.find((c) => c.id === p.contractorId);
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
                      {p.startDate} / {p.expectedEnd || "TBD"}
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
      )}
    </div>
  );
}
