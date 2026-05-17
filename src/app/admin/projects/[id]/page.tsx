import { notFound } from "next/navigation";
import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import { AdminProjectClient } from "./admin-project-client";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

async function loadAdminProject(id: string) {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return null;
  }
  const service = await createServiceClient();
  const { data: project } = await service
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!project) return null;

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

  return {
    project,
    updates: updatesRes.data ?? [],
    chats: chatsRes.data ?? [],
  };
}

export default async function AdminProjectPage({ params }: Props) {
  const { id } = await params;
  const data = await loadAdminProject(id);
  if (!data) notFound();

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 md:px-8">
      <Link
        href="/admin"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        &larr; All projects
      </Link>
      <div className="mt-3 mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        PM Console
      </div>
      <h1 className="serif text-3xl font-medium leading-tight text-secondary md:text-4xl">
        {data.project.title}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Project id: <span className="font-mono text-foreground">{data.project.id}</span>
      </p>

      <div className="mt-8">
        <AdminProjectClient
          project={data.project}
          updates={data.updates}
          chats={data.chats}
        />
      </div>
    </div>
  );
}
