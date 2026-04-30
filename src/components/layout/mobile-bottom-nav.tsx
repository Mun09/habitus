"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Hammer, Sparkles } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-provider";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { t } = useLocale();

  const tabs = [
    { href: "/", label: t("nav.home"), icon: Home },
    { href: "/matching", label: t("nav.matching"), icon: Search },
    { href: "/projects", label: t("nav.projects"), icon: Hammer },
    { href: "/design", label: t("nav.design"), icon: Sparkles },
  ];

  // Hide on app showcase route
  if (pathname.startsWith("/app")) return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-card/95 backdrop-blur-xl border-t border-border">
      <div className="flex items-stretch justify-around h-16">
        {tabs.map((tab) => {
          const active =
            pathname === tab.href ||
            (tab.href !== "/" && pathname.startsWith(tab.href));
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 text-[10px] tracking-wide",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
