"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Footer } from "./footer";
import { MobileBottomNav } from "./mobile-bottom-nav";

const HIDE_ON = new Set(["/"]);

export function ConditionalFooter() {
  const pathname = usePathname();
  if (HIDE_ON.has(pathname)) return null;
  return <Footer />;
}

export function ConditionalMobileBottomNav() {
  const pathname = usePathname();
  if (HIDE_ON.has(pathname)) return null;
  return <MobileBottomNav />;
}

export function ConditionalMain({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hide = HIDE_ON.has(pathname);
  return (
    <main className={hide ? "flex-1" : "flex-1 pb-20 md:pb-0"}>{children}</main>
  );
}
