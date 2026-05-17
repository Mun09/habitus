"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Calendar, MessageSquare, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useLocale } from "@/lib/i18n/locale-provider";
import { useDesignPlan } from "@/lib/design-plan";
import { CATEGORIES } from "@/lib/mock/design-options";
import type { Contractor } from "@/lib/mock/contractors";
import { createQuoteRequest } from "@/app/matching/actions";

export function RequestDialog({ contractor }: { contractor: Contractor }) {
  const { t } = useLocale();
  const { plan, hasPlan } = useDesignPlan();
  const [open, setOpen] = useState(false);
  const [attachPlan, setAttachPlan] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    const formData = new FormData(e.currentTarget);
    const message = String(formData.get("message") ?? "");
    const date = String(formData.get("date") ?? "");

    setSubmitting(true);
    const result = await createQuoteRequest({
      contractorId: contractor.id,
      designPlanId: attachPlan && hasPlan ? plan?.dbId ?? null : null,
      message,
      preferredStart: date || null,
      attachPlan: hasPlan && attachPlan,
    });
    setSubmitting(false);

    if ("error" in result) {
      toast.error(result.error);
      return;
    }

    setOpen(false);
    toast.success(
      hasPlan && attachPlan
        ? t("matching.request.toastWithPlan")
        : t("matching.request.toast")
    );
    router.push(`/projects/${result.projectId}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">{t("matching.detail.requestConsult")}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("matching.request.title")}</DialogTitle>
          <DialogDescription>
            {contractor.company} · {contractor.name}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-5">
          {/* Plan attach */}
          {hasPlan && plan && (
            <div className="rounded-2xl bg-primary/5 border border-primary/30 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  {plan.heroProposal && (
                    <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={plan.heroProposal}
                        alt=""
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="text-xs uppercase tracking-wider text-primary inline-flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      {t("matching.request.attachPlan")}
                    </div>
                    <div className="text-sm font-medium mt-1 truncate">
                      {plan.styleLabel}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      {plan.options.length} options ·{" "}
                      {t("matching.request.attachPlanBody")}
                    </div>
                  </div>
                </div>
                <Switch checked={attachPlan} onCheckedChange={setAttachPlan} />
              </div>
              {attachPlan && plan.options.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {plan.options.slice(0, 6).map((o) => (
                    <span
                      key={o.id}
                      className="inline-flex items-center gap-1.5 rounded-full bg-card border border-border px-2 py-0.5 text-[10px]"
                    >
                      {o.swatch && (
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ background: o.swatch }}
                        />
                      )}
                      <span className="text-muted-foreground uppercase tracking-wider text-[9px]">
                        {CATEGORIES.find((c) => c.key === o.category)?.label ?? ""}
                      </span>
                      {o.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1.5 mb-2">
              <Calendar className="h-3.5 w-3.5" />
              {t("matching.request.dateLabel")}
            </label>
            <Input type="date" name="date" required />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1.5 mb-2">
              <MessageSquare className="h-3.5 w-3.5" />
              {t("matching.request.messageLabel")}
            </label>
            <Textarea
              name="message"
              required
              placeholder={t("matching.request.messagePlaceholder")}
              defaultValue=""
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost" disabled={submitting}>
                {t("common.cancel")}
              </Button>
            </DialogClose>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Sending..." : t("matching.request.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
