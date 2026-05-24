import type { UserRole } from "@/lib/db/types";

// Single source of truth for role-vs-path access. Imported by both
// middleware.ts and src/app/auth/callback/route.ts so the two never
// disagree about where to send a signed-in user.

export const PROTECTED_PREFIXES = [
  "/onboarding",
  "/design",
  "/matching",
  "/projects",
  "/app",
  "/settings",
  "/contractor",
] as const;

export const ADMIN_PREFIX = "/admin";

// Paths that belong to a specific role. A user whose role is not in
// the list gets redirected to their home dashboard (see homeFor).
const ROLE_OWNED: { prefix: string; allowed: UserRole[] }[] = [
  { prefix: "/contractor", allowed: ["contractor", "admin"] },
  { prefix: "/onboarding", allowed: ["customer"] },
  { prefix: "/design",     allowed: ["customer", "admin"] },
  { prefix: "/matching",   allowed: ["customer", "admin"] },
  { prefix: "/projects",   allowed: ["customer", "admin"] },
];

export function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

export function isAdminPath(pathname: string): boolean {
  return pathname === ADMIN_PREFIX || pathname.startsWith(`${ADMIN_PREFIX}/`);
}

export function homeFor(role: UserRole): string {
  switch (role) {
    case "admin":      return "/admin";
    case "contractor": return "/contractor";
    case "customer":   return "/projects";
  }
}

// Returns null if the role may visit this path, or the redirect
// target if it may not. Admin bypasses every role gate (they can
// view contractor + customer surfaces for support).
export function redirectIfDisallowed(
  pathname: string,
  role: UserRole,
): string | null {
  if (role === "admin") return null;

  if (isAdminPath(pathname)) return homeFor(role);

  for (const rule of ROLE_OWNED) {
    const matches = pathname === rule.prefix || pathname.startsWith(`${rule.prefix}/`);
    if (matches && !rule.allowed.includes(role)) {
      return homeFor(role);
    }
  }
  return null;
}

// Decides where to send a user immediately after sign-in. The `next`
// param is honored only if the role is allowed there.
export function postSignInDestination(
  role: UserRole,
  next: string | null | undefined,
): string {
  const home = homeFor(role);
  if (!next || !next.startsWith("/") || next.startsWith("//")) return home;
  const disallowed = redirectIfDisallowed(next, role);
  return disallowed ?? next;
}
