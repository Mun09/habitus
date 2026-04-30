"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Clock, MessageSquare, Send, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import {
  PhotoUploader,
  type UploadedPhoto,
} from "@/components/design/photo-uploader";
import { useLocale } from "@/lib/i18n/locale-provider";
import { cn } from "@/lib/utils";

const CATEGORIES = ["minor", "major", "appliance", "other"] as const;
const SEVERITIES = ["low", "med", "high"] as const;

type Severity = (typeof SEVERITIES)[number];
type Category = (typeof CATEGORIES)[number];

type RequestEntry = {
  id: string;
  date: string;
  category: Category;
  severity: Severity;
  message: string;
  photoCount: number;
  status: "received" | "scheduled" | "resolved";
};

const SEED_HISTORY: RequestEntry[] = [
  {
    id: "h1",
    date: "2026-04-15",
    category: "minor",
    severity: "low",
    message: "거실 창틀 실리콘이 살짝 갈라졌어요.",
    photoCount: 2,
    status: "resolved",
  },
  {
    id: "h2",
    date: "2026-04-22",
    category: "appliance",
    severity: "med",
    message: "주방 후드 작동 시 소음이 점점 커져요.",
    photoCount: 0,
    status: "scheduled",
  },
];

export function AftercareRequest() {
  const { t, locale } = useLocale();
  const [category, setCategory] = useState<Category>("minor");
  const [severity, setSeverity] = useState<Severity>("med");
  const [message, setMessage] = useState("");
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [history, setHistory] = useState<RequestEntry[]>(SEED_HISTORY);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const entry: RequestEntry = {
      id: `r-${Date.now()}`,
      date: `${yyyy}-${mm}-${dd}`,
      category,
      severity,
      message,
      photoCount: photos.length,
      status: "received",
    };
    setHistory((h) => [entry, ...h]);
    setMessage("");
    setPhotos([]);
    toast.success(t("aftercare.request.toast"));
  };

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-6">
      {/* Form */}
      <form
        onSubmit={submit}
        className="rounded-3xl border border-border bg-card p-6 md:p-8 space-y-5"
      >
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center flex-shrink-0">
            <Wrench className="h-5 w-5" />
          </div>
          <div>
            <h2 className="serif text-xl md:text-2xl font-medium">
              {t("aftercare.request.title")}
            </h2>
            <p className="text-sm text-muted-foreground mt-1.5">
              {t("aftercare.request.body")}
            </p>
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
            {t("aftercare.request.category")}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={cn(
                  "rounded-2xl border px-3 py-3 text-left text-sm transition cursor-pointer",
                  category === c
                    ? "border-primary bg-primary/8 text-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40"
                )}
              >
                {t(`aftercare.request.cat.${c}` as any)}
              </button>
            ))}
          </div>
        </div>

        {/* Severity */}
        <div>
          <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
            {t("aftercare.request.severity")}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {SEVERITIES.map((s) => {
              const colors: Record<Severity, string> = {
                low: "border-[color:var(--success)]/40 text-[color:var(--success)]",
                med: "border-[color:var(--warning)]/40 text-[color:var(--warning)]",
                high: "border-[color:var(--danger)]/40 text-[color:var(--danger)]",
              };
              const activeColors: Record<Severity, string> = {
                low: "bg-[color:var(--success)]/10 border-[color:var(--success)]",
                med: "bg-[color:var(--warning)]/10 border-[color:var(--warning)]",
                high: "bg-[color:var(--danger)]/10 border-[color:var(--danger)]",
              };
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSeverity(s)}
                  className={cn(
                    "rounded-2xl border px-3 py-2.5 text-sm font-medium transition cursor-pointer",
                    severity === s
                      ? `${colors[s]} ${activeColors[s]}`
                      : "border-border bg-card text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t(`aftercare.request.sev.${s}` as any)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 inline-flex items-center gap-1.5">
            <MessageSquare className="h-3.5 w-3.5" />
            {t("aftercare.request.message")}
          </label>
          <Textarea
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("aftercare.request.placeholder")}
            className="min-h-[120px]"
          />
        </div>

        {/* Photos */}
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            {t("aftercare.request.attach")}
          </div>
          <p className="text-[11px] text-muted-foreground mb-2">
            {t("aftercare.request.attachHint")}
          </p>
          <PhotoUploader photos={photos} onChange={setPhotos} maxCount={4} />
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" size="lg" disabled={!message.trim()}>
            <Send className="h-4 w-4" />
            {t("aftercare.request.submit")}
          </Button>
        </div>
      </form>

      {/* History */}
      <aside className="space-y-3">
        <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground px-1">
          {t("aftercare.request.history")}
        </div>
        {history.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground text-center">
            {t("aftercare.request.empty")}
          </div>
        ) : (
          history.map((h) => (
            <article
              key={h.id}
              className="rounded-2xl border border-border bg-card p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] uppercase tracking-wider text-primary">
                  {h.date}
                </span>
                <StatusBadge status={h.status} />
              </div>
              <div className="text-sm font-medium">
                {t(`aftercare.request.cat.${h.category}` as any)}
                {h.severity === "high" && (
                  <span className="ml-2 text-[10px] text-[color:var(--danger)] uppercase">
                    {t("aftercare.request.sev.high")}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {h.message}
              </p>
              {h.photoCount > 0 && (
                <div className="mt-2 text-[10px] text-muted-foreground">
                  {locale === "ko"
                    ? `사진 ${h.photoCount}장`
                    : `${h.photoCount} photos`}
                </div>
              )}
            </article>
          ))
        )}
      </aside>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: "received" | "scheduled" | "resolved";
}) {
  const { t } = useLocale();
  const styles: Record<typeof status, string> = {
    received: "bg-muted text-muted-foreground",
    scheduled:
      "bg-[color:var(--warning)]/10 text-[color:var(--warning)] border border-[color:var(--warning)]/30",
    resolved:
      "bg-[color:var(--success)]/10 text-[color:var(--success)] border border-[color:var(--success)]/30",
  };
  const Icon =
    status === "resolved"
      ? CheckCircle2
      : status === "scheduled"
      ? Clock
      : MessageSquare;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
        styles[status]
      )}
    >
      <Icon className="h-3 w-3" />
      {t(`aftercare.request.status.${status}` as any)}
    </span>
  );
}
