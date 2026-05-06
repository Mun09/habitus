"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/common/logo";
import { useLocale } from "@/lib/i18n/locale-provider";

export default function SignInPage() {
  const { t } = useLocale();
  const router = useRouter();

  const proceed = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("habitus.auth", "1");
    }
    router.push("/onboarding");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 md:p-10 shadow-[0_24px_60px_rgba(15,30,44,0.08)]">
        <Link href="/" className="inline-block mb-8">
          <Logo />
        </Link>
        <h1 className="serif text-3xl font-medium leading-tight">{t("auth.title")}</h1>
        <p className="text-sm text-muted-foreground mt-2">{t("auth.subtitle")}</p>

        <div className="mt-8 space-y-3">
          <button
            onClick={proceed}
            className="w-full h-12 rounded-full bg-[#FEE500] text-[#191600] text-sm font-medium hover:opacity-90 cursor-pointer flex items-center justify-center gap-2"
          >
            <span className="text-base">💬</span>
            {t("auth.kakao")}
          </button>
          <button
            onClick={proceed}
            className="w-full h-12 rounded-full bg-[#03C75A] text-white text-sm font-medium hover:opacity-90 cursor-pointer flex items-center justify-center gap-2"
          >
            <span className="font-bold">N</span>
            {t("auth.naver")}
          </button>
          <Button onClick={proceed} variant="outline" size="lg" className="w-full">
            <Mail className="h-4 w-4" />
            {t("auth.email")}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-8 text-center">
          {t("auth.note")}
        </p>
      </div>
    </div>
  );
}
