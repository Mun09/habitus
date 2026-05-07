"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Camera } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-provider";
import type { Update } from "@/lib/mock/projects";
import { Button } from "@/components/ui/button";
import { IssueReportDialog } from "./issue-report-dialog";

export function UpdateTimeline({ updates }: { updates: Update[] }) {
  const { t } = useLocale();
  const [issueFor, setIssueFor] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="serif text-xl font-medium">{t("tracking.timeline.title")}</h3>
        <span className="text-xs text-muted-foreground">{updates.length} updates</span>
      </div>
      <div className="space-y-4">
        {updates.map((u, i) => (
          <motion.article
            key={u.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="overflow-hidden border border-border bg-card shadow-[var(--shadow-warm)]"
          >
            <div className="px-5 pt-5 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <div className="text-xs uppercase tracking-wider text-primary">
                  {u.date}
                </div>
                <h4 className="serif text-lg font-medium mt-1">{u.title}</h4>
                <div className="text-xs text-muted-foreground mt-1">
                  {u.author}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIssueFor(u.id)}
                className="text-xs text-muted-foreground hover:text-[color:var(--danger)]"
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                {t("tracking.timeline.reportIssue")}
              </Button>
            </div>
            {u.photos && u.photos.length > 0 && (
              <div className="grid grid-cols-3 gap-1 px-1">
                {u.photos.map((p, j) => (
                  <div
                    key={j}
                    className="relative aspect-[4/3] overflow-hidden bg-muted"
                  >
                    <Image src={p} alt="" fill sizes="240px" className="object-cover" />
                    {j === 0 && (
                      <div className="absolute top-2 left-2 rounded-full bg-card/80 backdrop-blur p-1">
                        <Camera className="h-3 w-3 text-primary" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            <p className="text-sm text-foreground/80 leading-relaxed px-5 pt-4 pb-5">
              {u.body}
            </p>
          </motion.article>
        ))}
      </div>
      <IssueReportDialog
        open={!!issueFor}
        onOpenChange={(o) => !o && setIssueFor(null)}
      />
    </div>
  );
}
