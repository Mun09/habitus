"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/lib/i18n/locale-provider";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/contractor", key: "contractor.nav.dashboard" as const, exact: true },
  { href: "/contractor/inbox", key: "contractor.nav.inbox" as const },
  { href: "/contractor/profile", key: "contractor.nav.profile" as const },
  { href: "/contractor/analytics", key: "contractor.nav.analytics" as const },
];

export function ContractorTabs() {
  const { t } = useLocale();
  const pathname = usePathname();

  return (
    <nav className="overflow-x-auto no-scrollbar">
      <ul className="flex items-center gap-1 min-w-max">
        {TABS.map((tab) => {
          const active = tab.exact
            ? pathname === tab.href
            : pathname === tab.href || pathname.startsWith(tab.href + "/");
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                className={cn(
                  "inline-flex items-center px-3 py-2 text-sm rounded-full transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {t(tab.key)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
