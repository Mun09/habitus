"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useLocale } from "@/lib/i18n/locale-provider";
import { useUser } from "@/lib/supabase/user-provider";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function OnboardingPage() {
  const { t } = useLocale();
  const router = useRouter();
  const { user } = useUser();
  const [step, setStep] = useState(0);
  const [nickname, setNickname] = useState("");
  const [address, setAddress] = useState("");
  const [budget, setBudget] = useState<[number, number]>([15000000, 30000000]);
  const [saving, setSaving] = useState(false);

  const totalSteps = 3;

  const next = async () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
      return;
    }
    if (!user) {
      toast.error("Sign in first.");
      router.push("/sign-in?next=/onboarding");
      return;
    }
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from("user_profiles").upsert({
      id: user.id,
      nickname: nickname || "Guest",
      address: address || null,
      budget_min: budget[0],
      budget_max: budget[1],
      onboarded_at: new Date().toISOString(),
    });
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(`${t("onboarding.toast")}${nickname || "Guest"}!`);
    setTimeout(() => router.push("/design"), 400);
  };

  const fmtBudget = (v: number) =>
    `$${Math.round(v / 1300).toLocaleString()}`;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={cn(
                "h-1 w-12 rounded-full transition",
                i <= step ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>
        <div className="rounded-3xl border border-border bg-card p-8 md:p-10 min-h-[360px] flex flex-col">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col"
              >
                <h1 className="serif text-2xl md:text-3xl font-medium leading-tight">
                  {t("onboarding.step1.title")}
                </h1>
                <div className="mt-6">
                  <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
                    {t("onboarding.step1.label")}
                  </label>
                  <Input
                    autoFocus
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder={t("onboarding.step1.placeholder")}
                  />
                </div>
              </motion.div>
            )}
            {step === 1 && (
              <motion.div
                key="1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col"
              >
                <h1 className="serif text-2xl md:text-3xl font-medium leading-tight">
                  {t("onboarding.step2.title")}
                </h1>
                <div className="mt-6">
                  <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
                    {t("onboarding.step2.label")}
                  </label>
                  <Input
                    autoFocus
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={t("onboarding.step2.placeholder")}
                  />
                </div>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div
                key="2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col"
              >
                <h1 className="serif text-2xl md:text-3xl font-medium leading-tight">
                  {t("onboarding.step3.title")}
                </h1>
                <p className="text-sm text-muted-foreground mt-2">
                  {t("onboarding.step3.body")}
                </p>
                <div className="mt-8">
                  <Slider
                    value={budget}
                    onValueChange={(v) => setBudget([v[0], v[1]] as [number, number])}
                    min={5000000}
                    max={80000000}
                    step={1000000}
                  />
                  <div className="mt-4 flex justify-between text-sm text-foreground">
                    <span className="serif text-xl">{fmtBudget(budget[0])}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="serif text-xl">{fmtBudget(budget[1])}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between">
            {step > 0 ? (
              <Button variant="ghost" onClick={() => setStep(step - 1)} disabled={saving}>
                <ArrowLeft className="h-4 w-4" />
                {t("common.back")}
              </Button>
            ) : (
              <span />
            )}
            <Button onClick={next} disabled={saving}>
              {step === totalSteps - 1 ? (
                <>
                  {saving ? "Saving..." : t("onboarding.complete")} <Check className="h-4 w-4" />
                </>
              ) : (
                <>
                  {t("common.next")} <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
