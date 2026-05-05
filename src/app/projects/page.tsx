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
    <div className="mx-auto max-w-6xl px-5 md:px-8 py-10 md:py-14">
      <h1 className="serif text-3xl md:text-5xl font-medium leading-tight">
        {t("nav.projects")}
      </h1>
      <p className="mt-3 text-muted-foreground">All your projects in one place.</p>

      <div className="mt-10 grid md:grid-cols-2 gap-5">
        {PROJECTS.map((p) => {
          const contractor = CONTRACTORS.find((c) => c.id === p.contractorId);
          const href = `/projects/${p.id}`;
          return (
            <Link
              key={p.id}
              href={href}
              className="group rounded-3xl border border-border bg-card overflow-hidden hover:shadow-[0_18px_40px_rgba(42,39,36,0.1)] transition"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                {contractor && (
                  <Image
                    src={contractor.cover}
                    alt=""
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
                    {p.startDate} → {p.expectedEnd}
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
