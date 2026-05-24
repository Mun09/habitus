"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, Menu, Settings, X } from "lucide-react";
import { Logo } from "@/components/common/logo";
import { NotificationsBell } from "@/components/layout/notifications-bell";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n/locale-provider";
import { useUser } from "@/lib/supabase/user-provider";
import { cn } from "@/lib/utils";

export function Header() {
  const { t } = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useUser();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  const links = [
    { href: "/design", label: t("nav.design") },
    { href: "/matching", label: t("nav.matching") },
    { href: "/projects", label: t("nav.projects") },
    { href: "/trust", label: t("nav.trust") },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        scrolled
          ? "bg-background/85 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Logo />
        </Link>
        <nav className="hidden md:flex items-center gap-7">
          {links.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-1">
          <NotificationsBell />
          {user ? (
            <>
              <Link
                href="/settings"
                aria-label={t("nav.settings")}
                className="cursor-pointer rounded-md p-2 hover:bg-muted hidden md:inline-flex items-center text-muted-foreground hover:text-foreground"
              >
                <Settings className="h-5 w-5" />
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                aria-label={t("common.signOut")}
                className="cursor-pointer rounded-md p-2 hover:bg-muted hidden md:inline-flex items-center text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-2 ml-1">
              <Button asChild variant="ghost" size="sm">
                <Link href="/sign-in">{t("common.signIn")}</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/sign-in?mode=signup">{t("common.signUp")}</Link>
              </Button>
            </div>
          )}
          <button
            type="button"
            aria-label="menu"
            onClick={() => setOpen((v) => !v)}
            className="cursor-pointer rounded-md p-2 hover:bg-muted md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-card/95 backdrop-blur">
          <nav className="px-5 py-4 flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-sm hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  href="/settings"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-3 text-sm hover:bg-muted flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  {t("nav.settings")}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    handleSignOut();
                  }}
                  className="rounded-md px-3 py-3 text-sm hover:bg-muted flex items-center gap-2 text-left"
                >
                  <LogOut className="h-4 w-4" />
                  {t("common.signOut")}
                </button>
              </>
            ) : (
              <div className="mt-2 flex flex-col gap-2">
                <Button asChild variant="outline">
                  <Link href="/sign-in" onClick={() => setOpen(false)}>
                    {t("common.signIn")}
                  </Link>
                </Button>
                <Button asChild>
                  <Link
                    href="/sign-in?mode=signup"
                    onClick={() => setOpen(false)}
                  >
                    {t("common.signUp")}
                  </Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
