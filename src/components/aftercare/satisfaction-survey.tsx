"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { useLocale } from "@/lib/i18n/locale-provider";
import { toast } from "sonner";

const QUESTIONS = ["overall", "quality", "communication", "schedule", "price"] as const;

export function SatisfactionSurvey() {
  const { t } = useLocale();
  const [scores, setScores] = useState<Record<string, number>>({});
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success(t("aftercare.survey.toast"));
  };

  const avg =
    Object.values(scores).reduce((a, b) => a + b, 0) /
    Math.max(Object.values(scores).length, 1);

  return (
    <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
      <div className="serif text-xl font-medium">{t("aftercare.survey.title")}</div>
      <p className="text-sm text-muted-foreground mt-1">{t("aftercare.survey.body")}</p>

      {submitted ? (
        <div className="mt-8 text-center py-8">
          <div className="serif text-5xl text-primary font-medium">{avg.toFixed(1)}</div>
          <div className="text-sm text-muted-foreground mt-2">
            {t("aftercare.survey.toast")}
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-6 space-y-5">
          {QUESTIONS.map((q) => (
            <div key={q} className="flex items-center justify-between gap-4">
              <span className="text-sm">{t(`aftercare.survey.q.${q}` as any)}</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setScores((s) => ({ ...s, [q]: n }))}
                    className="p-1 rounded-full hover:bg-muted/60 cursor-pointer"
                  >
                    <Star
                      className={`h-5 w-5 ${
                        (scores[q] ?? 0) >= n
                          ? "fill-primary text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
              {t("aftercare.survey.comment")}
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder=""
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={QUESTIONS.some((q) => !scores[q])}
          >
            {t("aftercare.survey.submit")}
          </Button>
        </form>
      )}
    </div>
  );
}
