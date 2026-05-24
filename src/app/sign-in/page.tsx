"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/common/logo";
import { useLocale } from "@/lib/i18n/locale-provider";
import { createClient } from "@/lib/supabase/client";

function SignInInner() {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [emailMode, setEmailMode] = useState(false);
  const [sending, setSending] = useState(false);

  const nextParam = searchParams.get("next");

  const buildCallback = (origin: string) => {
    const base = `${origin}/auth/callback`;
    return nextParam ? `${base}?next=${encodeURIComponent(nextParam)}` : base;
  };

  const signInWithGoogle = async () => {
    const supabase = createClient();
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: buildCallback(origin),
      },
    });
    if (error) toast.error(error.message);
  };

  const sendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSending(true);
    const supabase = createClient();
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: buildCallback(origin),
      },
    });
    setSending(false);
    if (error) toast.error(error.message);
    else toast.success("Magic link sent. Check your inbox.");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 md:p-10 shadow-[0_24px_60px_rgba(3,57,108,0.10)]">
        <Link href="/" className="inline-block mb-8">
          <Logo />
        </Link>
        <h1 className="serif text-3xl font-medium leading-tight">{t("auth.title")}</h1>
        <p className="text-sm text-muted-foreground mt-2">{t("auth.subtitle")}</p>

        <div className="mt-8 space-y-3">
          <button
            disabled
            className="w-full h-12 rounded-full bg-[#FEE500] text-[#191600] text-sm font-medium opacity-50 cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span className="text-base">💬</span>
            {t("auth.kakao")}
            <span className="ml-1 text-[10px] uppercase tracking-wider rounded-full bg-black/10 px-2 py-0.5">
              Soon
            </span>
          </button>
          <button
            disabled
            className="w-full h-12 rounded-full bg-[#03C75A] text-white text-sm font-medium opacity-50 cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span className="font-bold">N</span>
            {t("auth.naver")}
            <span className="ml-1 text-[10px] uppercase tracking-wider rounded-full bg-white/20 px-2 py-0.5">
              Soon
            </span>
          </button>

          <Button onClick={signInWithGoogle} variant="default" size="lg" className="w-full">
            <span className="font-bold">G</span>
            Continue with Google
          </Button>

          {!emailMode ? (
            <Button
              onClick={() => setEmailMode(true)}
              variant="outline"
              size="lg"
              className="w-full"
            >
              <Mail className="h-4 w-4" />
              {t("auth.email")}
            </Button>
          ) : (
            <form onSubmit={sendMagicLink} className="space-y-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoFocus
                required
              />
              <Button type="submit" size="lg" className="w-full" disabled={sending}>
                {sending ? "Sending..." : "Send magic link"}
              </Button>
              <button
                type="button"
                onClick={() => setEmailMode(false)}
                className="text-xs text-muted-foreground hover:text-foreground w-full text-center"
              >
                Back to other options
              </button>
            </form>
          )}
        </div>

        <p className="text-xs text-muted-foreground mt-8 text-center">{t("auth.note")}</p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInInner />
    </Suspense>
  );
}
