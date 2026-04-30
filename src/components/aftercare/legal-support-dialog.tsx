"use client";

import { useState } from "react";
import { Image as ImageIcon, Scale } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n/locale-provider";

const CASES = ["Fraud", "Abandon", "Defect", "Other"] as const;

export function LegalSupportDialog() {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const [c, setC] = useState<string>("Fraud");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
    toast.success(t("aftercare.legal.toast"));
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center flex-shrink-0">
          <Scale className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <div className="serif text-xl font-medium">{t("aftercare.legal.title")}</div>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            {t("aftercare.legal.body")}
          </p>
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="secondary" className="mt-5">{t("aftercare.legal.cta")}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("aftercare.legal.title")}</DialogTitle>
            <DialogDescription>{t("aftercare.legal.body")}</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
                {t("aftercare.legal.case")}
              </label>
              <Select value={c} onValueChange={setC}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CASES.map((k) => (
                    <SelectItem key={k} value={k}>
                      {t(`aftercare.legal.case${k}` as any)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
                {t("aftercare.legal.detail")}
              </label>
              <Textarea required />
            </div>
            <button
              type="button"
              className="w-full rounded-2xl border border-dashed border-border bg-muted/30 p-6 text-sm text-muted-foreground hover:bg-muted/50 cursor-pointer flex items-center justify-center gap-2"
            >
              <ImageIcon className="h-4 w-4" />
              {t("aftercare.legal.attach")}
            </button>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                {t("common.cancel")}
              </Button>
              <Button type="submit">{t("aftercare.legal.submit")}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
