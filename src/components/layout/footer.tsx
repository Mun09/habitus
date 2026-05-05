"use client";

import Link from "next/link";
import { Logo } from "@/components/common/logo";
import { useLocale } from "@/lib/i18n/locale-provider";

export function Footer() {
  const { t } = useLocale();

  const sections = [
    {
      title: t("footer.product"),
      links: [
        { href: "/design", label: t("nav.design") },
        { href: "/matching", label: t("nav.matching") },
        { href: "/projects", label: t("nav.projects") },
      ],
    },
    {
      title: t("footer.support"),
      links: [
        { href: "/trust", label: t("nav.trust") },
        { href: "#", label: "Help Center" },
        { href: "#", label: "File a dispute" },
      ],
    },
    {
      title: t("footer.company"),
      links: [
        { href: "#", label: "About" },
        { href: "#", label: "Careers" },
        { href: "#", label: "Press" },
      ],
    },
    {
      title: t("footer.legal"),
      links: [
        { href: "#", label: "Terms" },
        { href: "#", label: "Privacy" },
      ],
    },
  ];

  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-16 grid grid-cols-2 md:grid-cols-6 gap-10">
        <div className="col-span-2">
          <Logo />
          <p className="mt-4 text-sm text-muted-foreground max-w-xs">
            {t("footer.tagline")}
          </p>
        </div>
        {sections.map((s) => (
          <div key={s.title}>
            <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-4">
              {s.title}
            </div>
            <ul className="space-y-2">
              {s.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-foreground/80 hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-5 md:px-8 py-5 text-xs text-muted-foreground flex justify-between">
          <span>© 2026 Habitus Inc.</span>
          <span>Prototype demo · EN</span>
        </div>
      </div>
    </footer>
  );
}
