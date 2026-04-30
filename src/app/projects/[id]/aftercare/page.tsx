"use client";

import Link from "next/link";
import { use } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-provider";
import { getProject } from "@/lib/mock/projects";
import { WarrantyCard } from "@/components/aftercare/warranty-card";
import { AftercareRequest } from "@/components/aftercare/aftercare-request";

export default function AfterCarePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { t, pick } = useLocale();
  const project = getProject(id);
  if (!project) notFound();

  const daysSinceCompletion =
    project.status === "completed"
      ? Math.max(
          0,
          Math.floor(
            (Date.now() - new Date(project.expectedEnd).getTime()) /
              86_400_000
          )
        )
      : 0;

  return (
    <div className="mx-auto max-w-6xl px-5 md:px-8 py-8 md:py-14">
      <Link
        href={`/projects/${project.id}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("tracking.title")}
      </Link>

      <div className="mt-6">
        <h1 className="serif text-3xl md:text-5xl font-medium leading-tight">
          {t("aftercare.title")}
        </h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          {pick(project.title)} · {t("aftercare.subtitle")}
        </p>
      </div>

      <div className="mt-10 space-y-8">
        <WarrantyCard
          projectStatus={project.status}
          daysSinceCompletion={daysSinceCompletion}
        />

        <AftercareRequest />
      </div>
    </div>
  );
}
