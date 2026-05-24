"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocale } from "@/lib/i18n/locale-provider";
import { cn } from "@/lib/utils";
import { signOut, updateProfile } from "@/app/settings/actions";
import { LanguageToggle } from "./language-toggle";
import type { Database, UserRole } from "@/lib/db/types";

type Profile = Database["public"]["Tables"]["user_profiles"]["Row"];
type RegionKey = NonNullable<Profile["region_key"]>;

const REGIONS: { key: RegionKey; label: string; sub: string }[] = [
  { key: "seoul", label: "Seoul", sub: "서울" },
  { key: "gyeonggi", label: "Gyeonggi", sub: "경기" },
  { key: "busan", label: "Busan", sub: "부산" },
  { key: "incheon", label: "Incheon", sub: "인천" },
];

type Props = {
  email: string;
  profile: Profile;
};

export function SettingsClient({ email, profile }: Props) {
  const { t } = useLocale();
  const router = useRouter();
  const [nickname, setNickname] = useState(profile.nickname ?? "");
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [region, setRegion] = useState<RegionKey | null>(profile.region_key);
  const [address, setAddress] = useState(profile.address ?? "");
  const [saving, startSaving] = useTransition();
  const [signingOut, startSignOut] = useTransition();

  const handleSave = () => {
    startSaving(async () => {
      const res = await updateProfile({
        nickname: nickname || null,
        phone: phone || null,
        region_key: region,
        address: address || null,
      });
      if (res.ok) toast.success(t("common.saved"));
      else toast.error(res.error ?? "Save failed");
    });
  };

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      const confirmed = window.confirm(t("settings.signOut.confirm"));
      if (!confirmed) return;
    }
    startSignOut(async () => {
      await signOut();
      router.push("/");
      router.refresh();
    });
  };

  const roleLabel = roleToLabel(profile.role, t);

  return (
    <div className="space-y-6">
      <header className="mb-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          {roleLabel}
        </p>
        <h1 className="serif text-3xl md:text-5xl font-medium leading-tight mt-2">
          {t("settings.title")}
        </h1>
        <p className="text-sm text-muted-foreground mt-2">{t("settings.subtitle")}</p>
      </header>

      <Section title={t("settings.section.language")} help={t("settings.language.help")}>
        <LanguageToggle />
      </Section>

      <Section title={t("settings.section.profile")} help={t("settings.profile.help")}>
        <div className="space-y-4">
          <Field label={t("settings.profile.nickname")}>
            <Input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Alex"
            />
          </Field>
          <Field label={t("settings.profile.phone")}>
            <Input
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010-1234-5678"
            />
          </Field>
          <Field label={t("settings.profile.region")}>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {REGIONS.map((r) => {
                const active = region === r.key;
                return (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => setRegion(r.key)}
                    className={cn(
                      "rounded-2xl border bg-muted/30 px-3 py-3 text-left transition cursor-pointer",
                      active
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50",
                    )}
                  >
                    <div className="text-sm font-medium">{r.label}</div>
                    <div className="text-[11px] text-muted-foreground">{r.sub}</div>
                  </button>
                );
              })}
            </div>
          </Field>
          <Field label={t("settings.profile.address")}>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Brooklyn, NY"
            />
          </Field>
          <div className="pt-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? t("common.saving") : t("common.save")}
            </Button>
          </div>
        </div>
      </Section>

      <Section title={t("settings.section.account")}>
        <dl className="space-y-3 text-sm">
          <Row label={t("settings.account.email")} value={email} />
          <Row label={t("settings.account.role")} value={roleLabel} />
        </dl>
        <div className="mt-6 border-t border-border pt-4">
          <Button
            variant="outline"
            onClick={handleSignOut}
            disabled={signingOut}
          >
            <LogOut className="h-4 w-4" />
            {signingOut ? t("common.saving") : t("common.signOut")}
          </Button>
        </div>
      </Section>
    </div>
  );
}

function Section({
  title,
  help,
  children,
}: {
  title: string;
  help?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-[0_24px_60px_rgba(3,57,108,0.06)]">
      <h2 className="serif text-xl md:text-2xl font-medium leading-tight">{title}</h2>
      {help && (
        <p className="text-sm text-muted-foreground mt-1.5">{help}</p>
      )}
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
        {label}
      </label>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}

function roleToLabel(role: UserRole, t: (key: Parameters<ReturnType<typeof useLocale>["t"]>[0]) => string) {
  switch (role) {
    case "admin":      return t("settings.role.admin");
    case "contractor": return t("settings.role.contractor");
    case "customer":   return t("settings.role.customer");
  }
}
