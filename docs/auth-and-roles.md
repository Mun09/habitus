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
- `user_profiles.contractor_id` (FK → `contractors.id`) binds a contractor user to a contractor row (migration [011_contractor_link.sql](../supabase/migrations/011_contractor_link.sql))
- TS type: `UserRole` in [src/lib/db/types.ts](../src/lib/db/types.ts)
- Single source of truth for "which role may visit which path": [src/lib/auth/route-policy.ts](../src/lib/auth/route-policy.ts)

## Sign-in flow

1. User lands on `/sign-in`, optionally with `?next=/some/path`
2. Picks Google OAuth, magic link, or email + password. All paths land in [finalize-signin.ts](../src/lib/auth/finalize-signin.ts)
3. `finalizeSignIn`:
   - Looks up `user_profiles` row (creates one with `role='customer'` if missing)
   - Reads `locale` from the profile and writes it to the `habitus_locale` cookie so the first server render after sign-in is already in the user's language
   - Redirects via `postSignInDestination(role, next)` which:
     - Honors `?next=...` only if the role is allowed there
     - Otherwise sends the user to `homeFor(role)`

Promotion to `contractor` or `admin` is **operator work** — flip `user_profiles.role` (and `contractor_id` for contractors) directly in Supabase Studio. There is no env-var auto-promotion.

## Adding an admin

1. Have the user sign in once so a `user_profiles` row exists
2. In Supabase Studio, set their `user_profiles.role` to `admin`
3. Next sign-in lands them on `/admin`

## Adding a contractor

1. Have the user sign in once so a `user_profiles` row exists
2. In Supabase Studio, set their `user_profiles.role` to `contractor` **and** `user_profiles.contractor_id` to the matching `contractors.id` slug (e.g. `kim-warm`, `lee-haus`)
3. Next sign-in lands them on `/contractor`. `requireContractor()` ([src/lib/auth/require-contractor.ts](../src/lib/auth/require-contractor.ts)) enforces the binding on every contractor-side request

## Middleware

[middleware.ts](../middleware.ts) gates every protected path (see `PROTECTED_PREFIXES` in [route-policy.ts](../src/lib/auth/route-policy.ts)):

- Calls `supabase.auth.getSession()` so an expired access token is refreshed via the cookie setter callback **before** `getUser()` validates
- Redirects unauthenticated users to `/sign-in?next=<pathname>`
- For `/admin/*` specifically, looks up `user_profiles.role` and redirects non-admins to `/`

Role-vs-path enforcement at sign-in lives in `postSignInDestination`. Phase 3 added `requireContractor()` for contractor routes; admin and contractor routes both have an in-request DB check on top of the middleware gate.

## Files of record

- [supabase/migrations/010_roles_and_locale.sql](../supabase/migrations/010_roles_and_locale.sql)
- [supabase/migrations/011_contractor_link.sql](../supabase/migrations/011_contractor_link.sql)
- [src/lib/auth/route-policy.ts](../src/lib/auth/route-policy.ts)
- [src/lib/auth/finalize-signin.ts](../src/lib/auth/finalize-signin.ts)
- [src/lib/auth/require-contractor.ts](../src/lib/auth/require-contractor.ts)
- [src/app/auth/callback/route.ts](../src/app/auth/callback/route.ts)
- [middleware.ts](../middleware.ts)
