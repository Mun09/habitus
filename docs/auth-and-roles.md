# Auth and roles

Habitus uses a single Supabase Auth pool for every user (customer, contractor, admin). A `role` column on `user_profiles` decides where each user lives in the app.

## Roles

| role | who | home | gets |
|---|---|---|---|
| `customer` | DIY homeowners | `/projects` | onboarding, design studio, matching, project tracking |
| `contractor` | verified service pros (Phase 3) | `/contractor` | their assigned jobs, milestone uploads, customer chat |
| `admin` | platform PMs | `/admin` | every project, every customer, every contractor |

## Where role lives

- DB column: `user_profiles.role text not null default 'customer' check (in customer/contractor/admin)` (migration [010_roles_and_locale.sql](../supabase/migrations/010_roles_and_locale.sql))
- TS type: `UserRole` in [src/lib/db/types.ts](../src/lib/db/types.ts)
- Single source of truth for "which role may visit which path": [src/lib/auth/route-policy.ts](../src/lib/auth/route-policy.ts)

## Sign-in flow

1. User lands on `/sign-in`, optionally with `?next=/some/path`
2. Picks Google OAuth or magic link. Both redirect to `/auth/callback`
3. [auth/callback/route.ts](../src/app/auth/callback/route.ts):
   - Exchanges code for session
   - Looks up `user_profiles` row (creates one with `role='customer'` if missing)
   - **Admin promotion:** If the user's email is in the `ADMIN_EMAILS` env var, role is upserted to `admin`. This runs on every callback and is idempotent
   - Reads `locale` from the profile and writes it to the `habitus_locale` cookie so the first server render after sign-in is already in the user's language
   - Redirects via `postSignInDestination(role, next)` which:
     - Honors `?next=...` only if the role is allowed there
     - Otherwise sends the user to `homeFor(role)`

## Adding an admin

1. Add the email to `ADMIN_EMAILS` (comma-separated) in `.env` and on Vercel
2. Have that user sign in. The callback auto-promotes their `user_profiles.role` to `admin`
3. Subsequent sign-ins skip the promotion (idempotent)

You can also flip the column manually in the Supabase dashboard; `ADMIN_EMAILS` is the bootstrap path, not the only way.

## Middleware

[middleware.ts](../middleware.ts) gates every protected path (see `PROTECTED_PREFIXES` in [route-policy.ts](../src/lib/auth/route-policy.ts)):

- Calls `supabase.auth.getSession()` so an expired access token is refreshed via the cookie setter callback **before** `getUser()` validates
- Redirects unauthenticated users to `/sign-in?next=<pathname>`
- For `/admin/*` specifically, enforces the `ADMIN_EMAILS` check (Phase 1 — Phase 2 swaps this for `role='admin'`)

Phase 1 does **not** yet enforce role-vs-path at the middleware layer. That is enforced inside the callback's `postSignInDestination` so wrong-role users get bounced on sign-in. Phase 3 will add per-request role checks for `/contractor`.

## Files of record

- [supabase/migrations/010_roles_and_locale.sql](../supabase/migrations/010_roles_and_locale.sql)
- [src/lib/auth/route-policy.ts](../src/lib/auth/route-policy.ts)
- [src/app/auth/callback/route.ts](../src/app/auth/callback/route.ts)
- [middleware.ts](../middleware.ts)
