"use client";

import { useState, Suspense, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/common/logo";
import { useLocale } from "@/lib/i18n/locale-provider";
import { createClient } from "@/lib/supabase/client";
import { passwordSignIn, passwordSignUp } from "./actions";

type Mode = "options" | "email";

function SignInInner() {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<Mode>("options");
  const [sending, setSending] = useState(false);
  const [pending, startTransition] = useTransition();
  const busy = sending || pending;

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
      options: { redirectTo: buildCallback(origin) },
    });
    if (error) toast.error(error.message);
  };

  const handlePasswordSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    startTransition(async () => {
      const result = await passwordSignIn({ email, password, next: nextParam });
      // On success the action calls redirect() and throws; we only reach
      // here on error.
      if (result && !result.ok) {
        toast.error(
          result.error.toLowerCase().includes("invalid")
            ? t("auth.invalidCredentials")
            : result.error,
        );
      }
    });
  };

  const handleSignUp = () => {
    if (!email || !password) return;
    if (password.length < 6) {
      toast.error(t("auth.passwordTooShort"));
      return;
    }
    startTransition(async () => {
      const result = await passwordSignUp({ email, password, next: nextParam });
      if (result && !result.ok) {
        toast.error(result.error);
        return;
      }
      if (result && result.ok && result.needsConfirmation) {
        toast.success(t("auth.confirmEmail"));
      }
    });
  };

  const sendMagicLink = async () => {
    if (!email) return;
    setSending(true);
    const supabase = createClient();
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: buildCallback(origin) },
    });
    setSending(false);
    if (error) toast.error(error.message);
    else toast.success(t("auth.magicLinkSent"));
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
            {t("auth.google")}
          </Button>

          {mode === "options" ? (
            <Button
              onClick={() => setMode("email")}
              variant="outline"
              size="lg"
              className="w-full"
            >
              <Mail className="h-4 w-4" />
              {t("auth.email")}
            </Button>
          ) : (
            <form onSubmit={handlePasswordSignIn} className="space-y-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoFocus
                required
                autoComplete="email"
              />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("auth.password.placeholder")}
                autoComplete="current-password"
              />
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={busy || !email || !password}
                >
                  {pending ? t("auth.signingIn") : t("auth.signIn")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={handleSignUp}
                  disabled={busy || !email || !password}
                >
                  {pending ? t("auth.creatingAccount") : t("auth.signUp")}
                </Button>
              </div>
              <button
                type="button"
                onClick={sendMagicLink}
                disabled={busy || !email}
                className="text-xs text-muted-foreground hover:text-foreground w-full text-center pt-1 disabled:opacity-50 cursor-pointer"
              >
                {sending ? t("auth.magicLinkSending") : t("auth.magicLinkInstead")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("options");
                  setPassword("");
                }}
                className="text-xs text-muted-foreground hover:text-foreground w-full text-center cursor-pointer"
              >
                {t("auth.backToOptions")}
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
