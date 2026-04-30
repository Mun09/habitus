"use client";

import { useState } from "react";
import { Download, Shield } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { CONTRACT_CHECKLIST } from "@/lib/mock/materials";
import { useLocale } from "@/lib/i18n/locale-provider";
import { toast } from "sonner";

export function ContractChecklist() {
  const { locale } = useLocale();
  const [checked, setChecked] = useState<Set<number>>(
    () => new Set(CONTRACT_CHECKLIST.map((_, i) => i))
  );

  const toggle = (i: number) => {
    setChecked((s) => {
      const next = new Set(s);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const allChecked = checked.size === CONTRACT_CHECKLIST.length;

  return (
    <div className="rounded-3xl border border-border bg-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          <div className="serif text-base font-medium">
            {locale === "ko" ? "필수 계약 조항" : "Must-have contract clauses"}
          </div>
        </div>
        <span className="text-xs text-muted-foreground">
          {checked.size} / {CONTRACT_CHECKLIST.length}
        </span>
      </div>
      <div className="p-5 space-y-2.5 max-h-80 overflow-y-auto">
        {CONTRACT_CHECKLIST.map((item, i) => {
          const isChecked = checked.has(i);
          return (
            <label
              key={i}
              className="flex items-start gap-3 cursor-pointer rounded-xl p-2 hover:bg-muted/50"
            >
              <Checkbox
                checked={isChecked}
                onCheckedChange={() => toggle(i)}
                className="mt-0.5"
              />
              <span
                className={`text-sm ${
                  isChecked ? "text-foreground" : "text-muted-foreground line-through"
                }`}
              >
                {locale === "ko" ? item.ko : item.en}
              </span>
            </label>
          );
        })}
      </div>
      <div className="px-5 py-4 border-t border-border bg-muted/40 flex items-center justify-between">
        <span
          className={`text-xs font-medium ${
            allChecked ? "text-[color:var(--success)]" : "text-warning"
          }`}
        >
          {allChecked
            ? locale === "ko"
              ? "✓ 모든 조항 포함된 계약서로 진행하세요"
              : "✓ Sign only when all clauses are present"
            : locale === "ko"
            ? "체크 해제된 조항이 있습니다"
            : "Some clauses missing"}
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            toast.success(
              locale === "ko" ? "PDF 다운로드 준비 완료 (모의)" : "PDF ready (mock)"
            )
          }
        >
          <Download className="h-3.5 w-3.5" />
          PDF
        </Button>
      </div>
    </div>
  );
}
