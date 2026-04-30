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
  const { t, pick } = useLocale();
  return (
    <ScreenShell header="Gather">
      <div className="relative h-44 overflow-hidden">
        <Image src={IMAGES.hero.landing} alt="" fill sizes="320px" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <div className="text-[10px] uppercase tracking-wider text-primary mb-1">
            AI · Verified · Warranty
          </div>
          <div className="serif text-xl leading-tight">
            {pick({ ko: "막연한 꿈을\n안전한 공간으로.", en: "Vague dreams,\nsafe interiors." })}
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
                <div className="text-[10px] font-medium truncate">{pick(c.company)}</div>
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
  const { pick } = useLocale();
  return (
    <ScreenShell header="AI Design">
      <div className="p-3 space-y-3">
        <div className="flex justify-end">
          <div className="rounded-2xl rounded-br-md bg-primary text-primary-foreground px-3 py-2 text-[11px] max-w-[80%]">
            {pick({ ko: "거실 미드센추리, 우드톤", en: "Mid-century living, wood" })}
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-3 w-3 text-primary" />
          </div>
          <div className="rounded-2xl rounded-tl-md bg-muted px-3 py-2 text-[11px] flex-1">
            {pick({ ko: "이런 무드를 모았어요 ✨", en: "Here's the mood I curated ✨" })}
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
            {pick({ ko: "예상 자재비 ₩18.2M", en: "Est. materials $14K" })}
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}

export function MatchingScreen() {
  const { pick } = useLocale();
  return (
    <ScreenShell header="Find Pros">
      <div className="p-3 space-y-3">
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          {["전체", "면허", "검증", "★4.5+"].map((tag, i) => (
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
              <div className="text-xs font-medium mt-0.5 truncate">{pick(c.company)}</div>
              <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                <span className="inline-flex items-center gap-0.5">
                  <Star className="h-2.5 w-2.5 fill-primary text-primary" />
                  {c.rating}
                </span>
                <span>{pick(c.region)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScreenShell>
  );
}

export function DetailScreen() {
  const { pick, locale } = useLocale();
  const c = CONTRACTORS[0];
  return (
    <ScreenShell header={pick(c.company)}>
      <div className="relative h-32 -mt-px">
        <Image src={c.cover} alt="" fill sizes="320px" className="object-cover" />
      </div>
      <div className="p-3">
        <div className="flex items-center gap-2">
          <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-card -mt-8 shadow">
            <Image src={c.profileImage} alt="" fill sizes="48px" className="object-cover" />
          </div>
          <div className="flex-1">
            <div className="text-xs font-medium">{pick(c.name)}</div>
            <div className="text-[10px] text-muted-foreground">{pick(c.region)}</div>
          </div>
          <span className="text-[10px] inline-flex items-center gap-0.5 rounded-full bg-[color:var(--success)]/15 text-[color:var(--success)] px-2 py-0.5">
            <ShieldCheck className="h-2.5 w-2.5" />
            {locale === "ko" ? "면허" : "Licensed"}
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed line-clamp-3">
          {pick(c.bio)}
        </p>
        <div className="mt-3 grid grid-cols-3 gap-1">
          {c.portfolio.slice(0, 6).map((p, i) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
              <Image src={p} alt="" fill sizes="80px" className="object-cover" />
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-2xl bg-primary text-primary-foreground p-3 flex items-center justify-between">
          <span className="text-xs font-medium">
            {locale === "ko" ? "상담 요청" : "Request consult"}
          </span>
          <ChevronRight className="h-4 w-4" />
        </div>
      </div>
    </ScreenShell>
  );
}

export function TrackingScreen() {
  const { pick, t, locale } = useLocale();
  const project = PROJECTS[0];
  return (
    <ScreenShell header={locale === "ko" ? "진행 현황" : "Project"}>
      <div className="p-3 space-y-3">
        <div className="rounded-2xl border border-border bg-card p-3">
          <div className="text-[10px] text-muted-foreground">{pick(project.title)}</div>
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
          <span className="text-[10px]">
            {locale === "ko" ? "도장 1차 완료 사진이 올라왔어요" : "First paint coat photos posted"}
          </span>
        </div>
        {project.updates.slice(0, 2).map((u) => (
          <div key={u.id} className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="px-3 pt-2.5 flex items-center justify-between">
              <span className="text-[9px] uppercase text-primary">{u.date}</span>
              <span className="text-[9px] text-muted-foreground">{pick(u.author)}</span>
            </div>
            <div className="text-xs font-medium px-3 mt-1">{pick(u.title)}</div>
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
          <span className="text-[10px]">
            {locale === "ko" ? "PM에게 메시지" : "Message PM"}
          </span>
        </div>
      </div>
    </ScreenShell>
  );
}

export function AftercareScreen() {
  const { locale } = useLocale();
  return (
    <ScreenShell header={locale === "ko" ? "사후 관리" : "After-care"}>
      <div className="p-3 space-y-3">
        <div className="rounded-2xl border border-border bg-card p-4 text-center">
          <div className="text-[10px] uppercase tracking-wider text-primary">
            {locale === "ko" ? "보증 남은 일수" : "Days left"}
          </div>
          <div className="serif text-5xl text-primary mt-2">28</div>
          <div className="mt-3 h-1 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-primary" style={{ width: "93%" }} />
          </div>
        </div>
        <div className="rounded-2xl bg-secondary text-secondary-foreground p-3">
          <div className="text-[10px] uppercase tracking-wider opacity-80">
            {locale === "ko" ? "만족도 설문" : "Satisfaction"}
          </div>
          <div className="text-xs font-medium mt-1">
            {locale === "ko"
              ? "솔직한 의견은 다음 고객에게 도움이 됩니다."
              : "Honest feedback helps the next customer."}
          </div>
          <div className="mt-3 flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                className={`h-4 w-4 ${
                  n <= 4 ? "fill-primary text-primary" : "text-secondary-foreground/40"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-3">
          <div className="text-[10px] uppercase tracking-wider text-secondary">
            {locale === "ko" ? "법률 지원" : "Legal support"}
          </div>
          <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
            {locale === "ko"
              ? "분쟁 의심 시 전문 변호사 무료 상담."
              : "Free lawyer consult on disputes."}
          </p>
          <div className="mt-3 inline-flex items-center gap-1 text-[10px] text-secondary">
            {locale === "ko" ? "신청하기" : "Request"} <ArrowRight className="h-3 w-3" />
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}
