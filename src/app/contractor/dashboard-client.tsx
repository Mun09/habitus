"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Clock,
  Hammer,
  Inbox,
  MapPin,
  MessageSquare,
  Star,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLocale } from "@/lib/i18n/locale-provider";
import { formatKRW } from "@/lib/utils";
import { DemoBanner } from "@/components/contractor/demo-banner";
import type {
  DemoActiveProject,
  DemoActivity,
  DemoTodo,
} from "@/lib/mock/contractor-demo";
import type { TKey } from "@/lib/i18n/dictionaries";

type Props = {
  isDemo: boolean;
  companyName: string;
  activeProjects: DemoActiveProject[];
  todos: DemoTodo[];
  activity: DemoActivity[];
  pendingQuotes: number;
  monthlyRevenue: number;
  avgResponseHours: number;
};

const TODO_ICONS: Record<DemoTodo["type"], React.ReactNode> = {
  reply_needed: <MessageSquare className="h-4 w-4" />,
  photo_upload_needed: <Camera className="h-4 w-4" />,
  quote_deadline: <Clock className="h-4 w-4" />,
  site_visit: <MapPin className="h-4 w-4" />,
};

const ACTIVITY_ICONS: Record<DemoActivity["kind"], React.ReactNode> = {
  quote: <Inbox className="h-4 w-4 text-primary" />,
  message: <MessageSquare className="h-4 w-4 text-primary" />,
  update: <Hammer className="h-4 w-4 text-primary" />,
  review: <Star className="h-4 w-4 text-primary" />,
};

export function DashboardClient({
  isDemo,
  companyName,
  activeProjects,
  todos,
  activity,
  pendingQuotes,
  monthlyRevenue,
  avgResponseHours,
}: Props) {
  const { t } = useLocale();

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12">
      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          {t("contractor.dashboard.welcome")}
        </div>
        <h1 className="serif text-3xl font-medium leading-tight text-secondary md:text-4xl">
          {companyName}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("contractor.dashboard.subtitle")}
        </p>
      </div>

      {isDemo && (
        <div className="mt-5">
          <DemoBanner />
        </div>
      )}

      {/* KPIs */}
      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <KpiCard
          icon={<Hammer className="h-4 w-4" />}
          label={t("contractor.dashboard.kpi.active")}
          value={String(activeProjects.length)}
        />
        <KpiCard
          icon={<Inbox className="h-4 w-4" />}
          label={t("contractor.dashboard.kpi.pending")}
          value={String(pendingQuotes)}
          accent
        />
        <KpiCard
          icon={<Wallet className="h-4 w-4" />}
          label={t("contractor.dashboard.kpi.revenue")}
          value={formatKRW(monthlyRevenue)}
        />
        <KpiCard
          icon={<Clock className="h-4 w-4" />}
          label={t("contractor.dashboard.kpi.response")}
          value={`${avgResponseHours}${t("contractor.dashboard.kpi.hoursUnit")}`}
        />
      </div>

      {/* Todos */}
      <section className="mt-10">
        <h2 className="serif text-xl font-medium text-secondary">
          {t("contractor.dashboard.todos.title")}
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="rounded-2xl border border-border bg-card p-4"
            >
              <div className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {TODO_ICONS[todo.type]}
                {t(`contractor.dashboard.todos.${todo.type}` as TKey)}
              </div>
              <div className="mt-2 serif text-3xl font-medium text-foreground">
                {todo.count}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Active projects */}
      <section className="mt-12">
        <div className="flex items-end justify-between gap-3">
          <h2 className="serif text-xl font-medium text-secondary">
            {t("contractor.dashboard.active.title")}
          </h2>
        </div>

        {activeProjects.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
            {t("contractor.dashboard.active.empty")}
          </div>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeProjects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </section>

      {/* Activity */}
      <section className="mt-12">
        <h2 className="serif text-xl font-medium text-secondary">
          {t("contractor.dashboard.activity.title")}
        </h2>
        <ul className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card">
          {activity.map((a) => (
            <li key={a.id} className="flex items-start gap-3 px-4 py-3">
              <div className="mt-0.5 inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                {ACTIVITY_ICONS[a.kind]}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm text-foreground">{a.text}</div>
                <div className="mt-0.5 text-[11px] text-muted-foreground">
                  {a.when}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={
        "rounded-2xl border p-4 " +
        (accent
          ? "border-primary/30 bg-primary/5"
          : "border-border bg-card")
      }
    >
      <div className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-2 serif text-2xl font-medium text-foreground md:text-3xl">
        {value}
      </div>
    </div>
  );
}

function ProjectCard({ project: p }: { project: DemoActiveProject }) {
  const { t } = useLocale();
  return (
    <Link
      href={`/contractor/projects/${p.id}`}
      className="group block overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(3,57,108,0.12)]"
    >
      <div className="relative aspect-[5/3] bg-muted">
        {p.thumbnail && (
          <Image
            src={p.thumbnail}
            alt=""
            fill
            sizes="(min-width: 1024px) 320px, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        )}
        <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-card/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-foreground backdrop-blur">
          {p.currentStage}
        </div>
        {p.unreadMessages > 0 && (
          <div className="absolute right-3 top-3">
            <Badge variant="primary" className="text-[10px]">
              <MessageSquare className="h-3 w-3" />
              {p.unreadMessages} {t("contractor.dashboard.active.unread")}
            </Badge>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="serif text-base font-medium text-foreground line-clamp-1">
          {p.title}
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          {p.customerName} · {p.region}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Progress value={p.progress} className="h-1.5 flex-1" />
          <span className="text-xs font-medium text-foreground">
            {p.progress}%
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between gap-2 text-[11px]">
          <div className="text-muted-foreground">
            {p.daysLeft} {t("contractor.dashboard.active.daysLeft")}
          </div>
          <div className="inline-flex items-center gap-1 text-primary opacity-0 transition-opacity group-hover:opacity-100">
            {t("contractor.dashboard.active.open")}
            <ArrowRight className="h-3 w-3" />
          </div>
        </div>
        {p.nextAction && (
          <div className="mt-3 flex items-start gap-2 rounded-xl bg-muted/50 p-2.5">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary" />
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {t("contractor.dashboard.active.nextAction")}
              </div>
              <div className="text-xs text-foreground line-clamp-1">
                {p.nextAction}
              </div>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
