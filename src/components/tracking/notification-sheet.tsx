"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLocale } from "@/lib/i18n/locale-provider";
import type { Notification } from "@/lib/mock/projects";

export function NotificationSheet({ items }: { items: Notification[] }) {
  const { t, pick } = useLocale();
  const [open, setOpen] = useState(false);
  const unread = items.filter((i) => i.unread).length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="relative h-10 w-10 rounded-full hover:bg-muted flex items-center justify-center cursor-pointer">
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[color:var(--danger)]" />
          )}
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{t("tracking.notifications")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {items.map((n) => (
            <div
              key={n.id}
              className="rounded-2xl p-4 bg-muted/40 hover:bg-muted/60 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{pick(n.title)}</span>
                <span className="text-[10px] text-muted-foreground">{n.time}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {pick(n.body)}
              </p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
