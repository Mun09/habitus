"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Image as ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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

const CATEGORIES = ["quality", "schedule", "cost", "communication", "material"] as const;

export function IssueReportDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const { t } = useLocale();
  const [cat, setCat] = useState<string>("quality");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenChange(false);
    toast.warning(t("tracking.issue.toast"));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("tracking.issue.title")}</DialogTitle>
          <DialogDescription>
            {t("tracking.issue.toast")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
              {t("tracking.issue.category")}
            </label>
            <Select value={cat} onValueChange={setCat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {t(`tracking.issue.cat.${c}` as any)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
              {t("tracking.issue.description")}
            </label>
            <Textarea required />
          </div>
          <button
            type="button"
            className="w-full rounded-2xl border border-dashed border-border bg-muted/30 p-6 text-sm text-muted-foreground hover:bg-muted/50 cursor-pointer flex items-center justify-center gap-2"
          >
            <ImageIcon className="h-4 w-4" />
            {t("tracking.issue.attach")}
          </button>
          <DialogFooter>
            <Button variant="ghost" type="button" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit">{t("common.submit")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
