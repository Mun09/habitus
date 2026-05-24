// Single source of truth for the env-based role bootstrap.
// Used by middleware.ts, finalize-signin.ts, and any server action
// that needs to check the caller's role-from-env.

export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return adminEmails().includes(email.toLowerCase());
}

// CONTRACTOR_EMAILS format: "email1:contractor-slug,email2:contractor-slug2"
// where contractor-slug matches a row in public.contractors.id.
// Parsing is permissive: entries without a ":" or with an empty slug
// are dropped so a malformed env never crashes finalizeSignIn.
export function contractorEmailMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (const raw of (process.env.CONTRACTOR_EMAILS ?? "").split(",")) {
    const trimmed = raw.trim();
    if (!trimmed) continue;
    const idx = trimmed.indexOf(":");
    if (idx <= 0) continue;
    const email = trimmed.slice(0, idx).trim().toLowerCase();
    const slug = trimmed.slice(idx + 1).trim();
    if (!email || !slug) continue;
    map.set(email, slug);
  }
  return map;
}

export function contractorIdForEmail(
  email: string | null | undefined,
): string | null {
  if (!email) return null;
  return contractorEmailMap().get(email.toLowerCase()) ?? null;
}
