import { notFound } from "next/navigation";
import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import { requireContractor } from "@/lib/auth/require-contractor";
import { ContractorProjectClient } from "./contractor-project-client";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ContractorProjectPage({ params }: Props) {
  const { id } = await params;
  const identity = await requireContractor();
  const service = await createServiceClient();

  const { data: project } = await service
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!project) notFound();
  if (project.contractor_id !== identity.contractorId) notFound();

  const [updatesRes, chatsRes] = await Promise.all([
    service
      .from("project_updates")
      .select("*")
      .eq("project_id", id)
      .order("created_at", { ascending: false }),
    service
      .from("chat_messages")
      .select("*")
      .eq("project_id", id)
      .order("created_at", { ascending: true }),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 md:px-8">
      <Link
        href="/contractor"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        &larr; My projects
      </Link>
      <div className="mt-3 mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        {identity.companyName}
      </div>
      <h1 className="serif text-3xl font-medium leading-tight text-secondary md:text-4xl">
        {project.title}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Project id:{" "}
        <span className="font-mono text-foreground">{project.id}</span>
      </p>

      <div className="mt-8">
        <ContractorProjectClient
          project={project}
          updates={updatesRes.data ?? []}
          chats={chatsRes.data ?? []}
          defaultAuthor={identity.companyName}
        />
      </div>
    </div>
  );
}
