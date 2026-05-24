"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Calendar, Clock, Inbox, Paperclip, Sparkles, Wallet } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { DemoBanner } from "@/components/contractor/demo-banner";
import { useLocale } from "@/lib/i18n/locale-provider";
import { formatKRW } from "@/lib/utils";
import type { TKey } from "@/lib/i18n/dictionaries";
import type { DemoQuoteRequest } from "@/lib/mock/contractor-demo";

type Props = {
  isDemo: boolean;
  initial: DemoQuoteRequest[];
};

export function InboxClient({ isDemo, initial }: Props) {
  const { t } = useLocale();
  const [requests, setRequests] = useState(initial);
  const [openId, setOpenId] = useState<string | null>(null);

  const active = requests.find((r) => r.id === openId) ?? null;

  const respond = (id: string, decision: "responded" | "declined") => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: decision } : r)),
    );
    setOpenId(null);
    toast.success(
      decision === "responded"
        ? t("contractor.inbox.detail.toastSent")
        : t("contractor.inbox.detail.toastDeclined"),
    );
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12">
      <div className="space-y-2">
        <h1 className="serif text-3xl font-medium leading-tight text-secondary md:text-4xl">
          {t("contractor.inbox.title")}
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          {t("contractor.inbox.subtitle")}
        </p>
      </div>

      {isDemo && (
        <div className="mt-5">
          <DemoBanner />
        </div>
      )}

      {requests.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
          <Inbox className="mx-auto mb-3 h-6 w-6 text-muted-foreground" />
          {t("contractor.inbox.empty")}
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {requests.map((r) => (
            <RequestCard
              key={r.id}
              request={r}
              onOpen={() => setOpenId(r.id)}
            />
          ))}
        </ul>
      )}

      <Dialog open={openId !== null} onOpenChange={(open) => !open && setOpenId(null)}>
        <DialogContent className="max-w-2xl max-h-[88vh] overflow-y-auto">
          {active && (
            <ResponseForm
              request={active}
              onAccept={() => respond(active.id, "responded")}
              onDecline={() => respond(active.id, "declined")}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RequestCard({
  request: r,
  onOpen,
}: {
  request: DemoQuoteRequest;
  onOpen: () => void;
}) {
  const { t } = useLocale();
  return (
    <li>
      <button
        type="button"
        onClick={onOpen}
        className="group block w-full rounded-2xl border border-border bg-card p-4 text-left transition hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(3,57,108,0.1)] md:p-5"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          {/* Avatar / thumbnail */}
          <div className="flex items-start gap-3 md:flex-shrink-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {r.customerInitials}
            </div>
            <div className="md:hidden">
              <div className="text-sm font-medium">{r.customerName}</div>
              <div className="text-[11px] text-muted-foreground">
                {r.region}
              </div>
            </div>
          </div>

          {/* Middle content */}
          <div className="min-w-0 flex-1">
            <div className="hidden items-baseline gap-2 md:flex">
              <div className="text-sm font-medium text-foreground">
                {r.customerName}
              </div>
              <div className="text-[11px] text-muted-foreground">
                · {r.region}
              </div>
              <div className="ml-auto inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                <Clock className="h-3 w-3" />
                {relativeTime(r.receivedAt)}
              </div>
            </div>
            <p className="mt-1 line-clamp-2 text-sm text-foreground/85 leading-relaxed">
              {r.message}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(r.preferredStart)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Wallet className="h-3 w-3" />
                {formatKRW(r.budgetMin)} – {formatKRW(r.budgetMax)}
              </span>
              {r.attachedPlan && (
                <span className="inline-flex items-center gap-1 text-primary">
                  <Paperclip className="h-3 w-3" />
                  {t("contractor.inbox.attachedPlan")}
                </span>
              )}
            </div>
          </div>

          {/* Right: status + attached thumb */}
          <div className="flex items-center justify-between gap-3 md:flex-col md:items-end md:justify-start">
            <StatusBadge status={r.status} />
            {r.attachedPlan && (
              <div className="relative h-16 w-24 overflow-hidden rounded-lg bg-muted">
                <Image
                  src={r.attachedPlan.heroImage}
                  alt=""
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </button>
    </li>
  );
}

function StatusBadge({ status }: { status: DemoQuoteRequest["status"] }) {
  const { t } = useLocale();
  const variant =
    status === "pending"
      ? "warning"
      : status === "responded"
      ? "success"
      : "muted";
  return (
    <Badge variant={variant} className="text-[10px]">
      {t(`contractor.inbox.status.${status}` as TKey)}
    </Badge>
  );
}

function ResponseForm({
  request: r,
  onAccept,
  onDecline,
}: {
  request: DemoQuoteRequest;
  onAccept: () => void;
  onDecline: () => void;
}) {
  const { t } = useLocale();
  const isClosed = r.status !== "pending";

  return (
    <>
      <DialogHeader>
        <DialogTitle>{t("contractor.inbox.detail.title")}</DialogTitle>
        <DialogDescription>
          {r.customerName} · {r.region}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-5">
        {/* Customer message */}
        <div className="rounded-2xl border border-border bg-muted/30 p-4">
          <div className="grid gap-3 text-xs sm:grid-cols-2">
            <Field
              label={t("contractor.inbox.received")}
              value={relativeTime(r.receivedAt)}
            />
            <Field
              label={t("contractor.inbox.preferredStart")}
              value={formatDate(r.preferredStart)}
            />
            <Field
              label={t("contractor.inbox.budget")}
              value={`${formatKRW(r.budgetMin)} – ${formatKRW(r.budgetMax)}`}
            />
            <Field label="Status" value={t(`contractor.inbox.status.${r.status}` as TKey)} />
          </div>
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-foreground">
            {r.message}
          </p>
        </div>

        {/* Attached design */}
        {r.attachedPlan && (
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4">
            <div className="flex items-start gap-3">
              <div className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
                <Image
                  src={r.attachedPlan.heroImage}
                  alt=""
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
                  <Sparkles className="h-3 w-3" />
                  {t("contractor.inbox.attachedPlan")}
                </div>
                <div className="mt-1 text-sm font-medium">
                  {r.attachedPlan.styleLabel}
                </div>
                <div className="mt-0.5 text-[11px] text-muted-foreground">
                  {r.attachedPlan.optionCount} options
                </div>
              </div>
            </div>
            {r.attachedPlan.options.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {r.attachedPlan.options.map((o, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2 py-0.5 text-[10px]"
                  >
                    {o.swatch && (
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: o.swatch }}
                      />
                    )}
                    <span className="uppercase tracking-wider text-[9px] text-muted-foreground">
                      {o.label}
                    </span>
                    {o.value}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Response form */}
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onAccept();
          }}
        >
          <div>
            <label className="mb-2 inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
              <Wallet className="h-3.5 w-3.5" />
              {t("contractor.inbox.detail.amount")}
            </label>
            <Input
              type="number"
              name="amount"
              required={!isClosed}
              disabled={isClosed}
              placeholder="28000000"
              min={0}
              step={100000}
            />
            <p className="mt-1 text-[10px] text-muted-foreground">
              {t("contractor.inbox.detail.amountHint")}
            </p>
          </div>
          <div>
            <label className="mb-2 inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              {t("contractor.inbox.detail.startable")}
            </label>
            <Input
              type="date"
              name="startable"
              required={!isClosed}
              disabled={isClosed}
            />
          </div>
          <div>
            <label className="mb-2 inline-flex text-xs uppercase tracking-wider text-muted-foreground">
              {t("contractor.inbox.detail.reply")}
            </label>
            <Textarea
              required={!isClosed}
              disabled={isClosed}
              placeholder={t("contractor.inbox.detail.replyPlaceholder")}
              rows={4}
            />
          </div>

          <p className="text-[11px] text-muted-foreground">
            {t("contractor.inbox.detail.demoNote")}
          </p>

          <DialogFooter className="!justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={onDecline}
              disabled={isClosed}
            >
              {t("contractor.inbox.detail.decline")}
            </Button>
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  {t("common.cancel")}
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isClosed}>
                {t("contractor.inbox.detail.accept")}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </div>
    </>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-0.5 text-sm font-medium text-foreground">{value}</div>
    </div>
  );
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return iso;
  }
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
