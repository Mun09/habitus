"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Calendar, MessageSquare, ShieldCheck, Sparkles } from "lucide-react";
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
import { COST_BENCHMARK } from "@/lib/mock/materials";
import { formatKRW } from "@/lib/utils";
import type { Contractor } from "@/lib/mock/contractors";

export function RequestDialog({ contractor }: { contractor: Contractor }) {
  const { t, pick, locale } = useLocale();
  const { plan, hasPlan, setAftercareUpgrade } = useDesignPlan();
  const [open, setOpen] = useState(false);
  const [attachPlan, setAttachPlan] = useState(true);
  const [aftercare, setAftercare] = useState(plan?.aftercareUpgrade ?? false);
  const router = useRouter();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasPlan && aftercare !== plan?.aftercareUpgrade) {
      setAftercareUpgrade(aftercare);
    }
    setOpen(false);
    toast.success(
      hasPlan && attachPlan
        ? t("matching.request.toastWithPlan")
        : t("matching.request.toast")
    );
    setTimeout(() => router.push("/projects/proj-mapo-32"), 600);
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
            {pick(contractor.company)} · {pick(contractor.name)}
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
                      {pick(plan.styleLabel)}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      {plan.options.length}{" "}
                      {pick({ ko: "개 옵션", en: "options" })} ·{" "}
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
                        {pick(
                          CATEGORIES.find((c) => c.key === o.category)?.label ?? {
                            ko: "",
                            en: "",
                          }
                        )}
                      </span>
                      {pick(o.name)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Aftercare option (pre-construction only) */}
          <div className="rounded-2xl border border-border p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs uppercase tracking-wider text-secondary inline-flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  {t("matching.request.aftercareOption")}
                </div>
                <p className="text-sm text-foreground/80 mt-2 leading-relaxed">
                  {t("matching.request.aftercareBody")}
                </p>
                <div className="mt-3 inline-flex items-baseline gap-2 rounded-full bg-secondary/10 px-3 py-1">
                  <span className="serif text-base font-semibold text-secondary">
                    {locale === "ko"
                      ? formatKRW(Math.round(COST_BENCHMARK.ourQuote * 0.5))
                      : `$${Math.round(
                          (COST_BENCHMARK.ourQuote * 0.5) / 1300
                        ).toLocaleString()}`}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {locale === "ko" ? "공사비의 50%" : "50% of cost"}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-2">
                  {t("matching.request.aftercareNote")}
                </p>
              </div>
              <Switch checked={aftercare} onCheckedChange={setAftercare} />
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1.5 mb-2">
              <Calendar className="h-3.5 w-3.5" />
              {t("matching.request.dateLabel")}
            </label>
            <Input type="date" required />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1.5 mb-2">
              <MessageSquare className="h-3.5 w-3.5" />
              {t("matching.request.messageLabel")}
            </label>
            <Textarea
              required
              placeholder={t("matching.request.messagePlaceholder")}
              defaultValue=""
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                {t("common.cancel")}
              </Button>
            </DialogClose>
            <Button type="submit">{t("matching.request.submit")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
