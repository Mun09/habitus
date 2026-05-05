"use client";

import Image from "next/image";
import { ArrowRight, Bell, ChevronRight, Hammer, Home, MessageCircle, Search, ShieldCheck, Sparkles, Star } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-provider";
import { CONTRACTORS } from "@/lib/mock/contractors";
import { IMAGES } from "@/lib/mock/images";
import { PROJECTS } from "@/lib/mock/projects";

function ScreenShell({ children, header }: { children: React.ReactNode; header: string }) {
  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      <div className="pt-14 pb-3 px-4 flex items-center justify-between border-b border-border bg-card/60">
        <span className="serif text-sm font-medium">{header}</span>
        <Bell className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar">{children}</div>
      <div className="grid grid-cols-4 border-t border-border bg-card">
        {[
          { icon: Home, label: "Home" },
          { icon: Search, label: "Find" },
          { icon: Hammer, label: "Project" },
          { icon: Sparkles, label: "AI" },
        ].map(({ icon: Icon, label }, i) => (
          <div
            key={label}
            className={`py-2.5 flex flex-col items-center gap-0.5 text-[9px] ${
              i === 0 ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

export function HomeScreen() {
  const { t } = useLocale();
  return (
    <ScreenShell header="Habitus">
      <div className="relative h-44 overflow-hidden">
        <Image src={IMAGES.hero.landing} alt="" fill sizes="320px" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <div className="text-[10px] uppercase tracking-wider text-primary mb-1">
            AI Design · Matching · Tracking
          </div>
          <div className="serif text-xl leading-tight">
            {"Vague dreams,\nsafe interiors."}
          </div>
        </div>
      </div>
      <div className="p-3 space-y-3">
        <div className="rounded-2xl bg-primary text-primary-foreground p-3 flex items-center justify-between">
          <span className="text-xs">{t("landing.hero.ctaPrimary")}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {CONTRACTORS.slice(0, 4).map((c) => (
            <div key={c.id} className="rounded-2xl border border-border overflow-hidden bg-card">
              <div className="relative aspect-[4/5]">
                <Image src={c.cover} alt="" fill sizes="160px" className="object-cover" />
              </div>
              <div className="p-2">
                <div className="text-[10px] font-medium truncate">{c.company}</div>
                <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                  <Star className="h-2 w-2 fill-primary text-primary" />
                  {c.rating} · {c.reviewCount}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScreenShell>
  );
}

export function DesignScreen() {
  return (
    <ScreenShell header="AI Design">
      <div className="p-3 space-y-3">
        <div className="flex justify-end">
          <div className="rounded-2xl rounded-br-md bg-primary text-primary-foreground px-3 py-2 text-[11px] max-w-[80%]">
            Mid-century living, wood
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-3 w-3 text-primary" />
          </div>
          <div className="rounded-2xl rounded-tl-md bg-muted px-3 py-2 text-[11px] flex-1">
            Here&apos;s the mood I curated ✨
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1 rounded-2xl overflow-hidden">
          {IMAGES.moodboard.midcentury.slice(0, 4).map((src, i) => (
            <div key={i} className="relative aspect-square">
              <Image src={src} alt="" fill sizes="160px" className="object-cover" />
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-3 w-3 text-primary" />
          </div>
          <div className="rounded-2xl rounded-tl-md bg-muted px-3 py-2 text-[11px] flex-1">
            Est. materials $14K
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}

export function MatchingScreen() {
  return (
    <ScreenShell header="Find Pros">
      <div className="p-3 space-y-3">
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          {["All", "Licensed", "Verified", "★4.5+"].map((tag, i) => (
            <span
              key={i}
              className={`flex-shrink-0 rounded-full px-2.5 py-1 text-[10px] ${
                i === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
        {CONTRACTORS.slice(0, 4).map((c) => (
          <div
            key={c.id}
            className="rounded-2xl border border-border bg-card overflow-hidden flex"
          >
            <div className="relative h-20 w-20 flex-shrink-0">
              <Image src={c.cover} alt="" fill sizes="80px" className="object-cover" />
            </div>
            <div className="p-2.5 flex-1 min-w-0">
              <div className="flex items-center gap-1">
                {c.licensed ? (
                  <ShieldCheck className="h-3 w-3 text-[color:var(--success)]" />
                ) : (
                  <ShieldCheck className="h-3 w-3 text-secondary" />
                )}
                <span className="text-[9px] uppercase tracking-wider text-muted-foreground">
                  {c.licensed ? "Licensed" : "Verified"}
                </span>
              </div>
              <div className="text-xs font-medium mt-0.5 truncate">{c.company}</div>
              <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                <span className="inline-flex items-center gap-0.5">
                  <Star className="h-2.5 w-2.5 fill-primary text-primary" />
                  {c.rating}
                </span>
                <span>{c.region}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScreenShell>
  );
}

export function DetailScreen() {
  const c = CONTRACTORS[0];
  return (
    <ScreenShell header={c.company}>
      <div className="relative h-32 -mt-px">
        <Image src={c.cover} alt="" fill sizes="320px" className="object-cover" />
      </div>
      <div className="p-3">
        <div className="flex items-center gap-2">
          <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-card -mt-8 shadow">
            <Image src={c.profileImage} alt="" fill sizes="48px" className="object-cover" />
          </div>
          <div className="flex-1">
            <div className="text-xs font-medium">{c.name}</div>
            <div className="text-[10px] text-muted-foreground">{c.region}</div>
          </div>
          <span className="text-[10px] inline-flex items-center gap-0.5 rounded-full bg-[color:var(--success)]/15 text-[color:var(--success)] px-2 py-0.5">
            <ShieldCheck className="h-2.5 w-2.5" />
            Licensed
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed line-clamp-3">
          {c.bio}
        </p>
        <div className="mt-3 grid grid-cols-3 gap-1">
          {c.portfolio.slice(0, 6).map((p, i) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
              <Image src={p} alt="" fill sizes="80px" className="object-cover" />
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-2xl bg-primary text-primary-foreground p-3 flex items-center justify-between">
          <span className="text-xs font-medium">Request consult</span>
          <ChevronRight className="h-4 w-4" />
        </div>
      </div>
    </ScreenShell>
  );
}

export function TrackingScreen() {
  const project = PROJECTS[0];
  return (
    <ScreenShell header="Project">
      <div className="p-3 space-y-3">
        <div className="rounded-2xl border border-border bg-card p-3">
          <div className="text-[10px] text-muted-foreground">{project.title}</div>
          <div className="flex items-end justify-between mt-1">
            <span className="serif text-2xl">{project.progress}%</span>
            <span className="text-[10px] text-muted-foreground">
              D-{project.daysLeft}
            </span>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
        <div className="rounded-2xl bg-warning/10 border border-warning/40 p-2.5 flex items-center gap-2">
          <Bell className="h-3 w-3 text-warning" />
          <span className="text-[10px]">First paint coat photos posted</span>
        </div>
        {project.updates.slice(0, 2).map((u) => (
          <div key={u.id} className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="px-3 pt-2.5 flex items-center justify-between">
              <span className="text-[9px] uppercase text-primary">{u.date}</span>
              <span className="text-[9px] text-muted-foreground">{u.author}</span>
            </div>
            <div className="text-xs font-medium px-3 mt-1">{u.title}</div>
            <div className="grid grid-cols-3 gap-0.5 mt-2">
              {u.photos.slice(0, 3).map((p, i) => (
                <div key={i} className="relative aspect-square">
                  <Image src={p} alt="" fill sizes="120px" className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="rounded-2xl bg-primary/10 p-3 flex items-center gap-2">
          <MessageCircle className="h-3.5 w-3.5 text-primary" />
          <span className="text-[10px]">Message PM</span>
        </div>
      </div>
    </ScreenShell>
  );
}
