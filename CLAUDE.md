# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

Habitus — interior design + verified contractor matching + live project tracking, packaged as a single Next.js app. Supabase (Postgres + Auth + Storage + Realtime) is the source of truth for every domain object. The files under `src/lib/mock/` are kept as **seed sources** for `supabase/migrations/007_seed_data.sql` and as TypeScript type holders; runtime data is read from the DB.

Every protected route (`/onboarding`, `/design`, `/matching`, `/projects`, `/app`, `/settings`, `/contractor`, `/admin`) requires a Supabase session — `middleware.ts` redirects to `/sign-in` when Supabase env vars are absent or no user is present. The single source of truth for path × role access is [src/lib/auth/route-policy.ts](src/lib/auth/route-policy.ts) — imported by both `middleware.ts` and `src/app/auth/callback/route.ts`. The `/app` route is the one exception: a marketing-only carousel of flow screenshots that still hard-codes preview data; treat it as a brochure, not a data surface.

User role lives in `user_profiles.role` (`customer` | `contractor` | `admin`). Post-login routing happens in [src/app/auth/callback/route.ts](src/app/auth/callback/route.ts): customers go to `/onboarding`/`/projects`, contractors to `/contractor` (Phase 3), admins to `/admin`. `ADMIN_EMAILS` env auto-promotes matching users to `admin` on sign-in. See [docs/auth-and-roles.md](docs/auth-and-roles.md).

## Heads-up: Next.js version

`AGENTS.md` (above) warns the Next.js version differs from your training data. The repo runs **Next 16.2.4 + React 19** with the App Router. Before writing routing or server-component code, read the relevant guide in `node_modules/next/dist/docs/` and watch for deprecations. Tailwind is **v4** (`@tailwindcss/postcss`), not v3.

## Commands

```bash
npm run dev      # next dev (http://localhost:3000)
npm run build    # next build
npm run start    # next start (production)
npm run lint     # eslint (eslint-config-next)
```

No test runner is configured. Shell is **PowerShell on Windows** — use PS syntax in Bash tool calls or invoke `bash` explicitly.

Vercel CLI is installed and the project is linked (`.vercel/project.json` present). Production deploys via `vercel deploy --prod --yes`. Aliased domain: `gather-alpha-six.vercel.app`.

## Architecture

### Routes (`src/app/`)

App Router segments map to the user flow:

`/` (landing) → `/onboarding` → `/design` (Design Studio) → `/matching` (contractor selection) → `/projects/[id]` (live tracking), plus `/app` (dashboard hub), `/sign-in`, `/trust`. Layout chrome (header, footer, mobile bottom nav) is gated per-route via `components/layout/conditional-chrome.tsx`.

### Design Studio (`/design`) — the most complex flow

Three stages tracked by `DesignStage = "compose" | "generating" | "result"`:

1. `ComposeWizard` — multi-step form (space photo, style, tone, flooring, wall, furniture, references) backed by `DESIGN_OPTIONS` in `src/lib/mock/design-options.ts`.
2. `GeneratingState` — animated placeholder.
3. `ResultView` — before/after slider, materials table, cost benchmark, contract checklist.

The top `StageIndicator` is **clickable** — users can jump to any stage at any time. Result stage proposals come from the rows in `design_plans.proposal_urls` produced by `/api/design/generate`. When the user picks "Random (5 styles)" the route fans out to five parallel `gpt-image-1` calls and writes five `generated_images` rows under one plan; the slider walks through them in order.

State that needs to survive the transition to `/matching` is persisted via `DesignPlanProvider` (`src/lib/design-plan.tsx`) into `localStorage` key `habitus.designPlan`.

### Image asset isolation (important)

All image URLs are centralized in `src/lib/mock/images.ts`. Two W2-1 photo sets exist and **must stay isolated**:

- `IMAGES.scenarios.w2` → `public/images/scenarios/w2/` — Design Studio AI result images. Used by Design Studio only.
- `PROJECT_W2_PHOTOS` → `public/images/projects/w2-1/` — isolated copies used by My Projects history (`src/lib/mock/projects.ts`, `src/app/projects/[id]/page.tsx`). Must NOT reference `scenarios/`.

When adding photos to one surface, do not reach into the other folder. The history mock messages in `projects.ts` are written to match the specific contents of the 3 `projects/w2-1/` photos (reference space / ceiling / meeting bay) — if you change the photo set, rewrite the messages too.

### i18n

`src/lib/i18n/locale-provider.tsx` exposes `useLocale()` returning `t(key)`, `pick(bilingual)`, and `setLocale(next)`. Supported locales: `en` (default) and `ko`. Resolution order: `habitus_locale` cookie → signed-in user's `user_profiles.locale` → `"en"`. Root layout reads the cookie server-side and seeds the provider via `initialLocale` so SSR matches the user's language without a flash. Users flip language at `/settings`. Mock data using `Bilingual = string | { en: T, ko?: T }` should always go through `pick()`. Full guide: [docs/i18n.md](docs/i18n.md).

### UI primitives

`src/components/ui/` holds shadcn-style Radix wrappers (Tabs, Dialog, Progress, etc.). Compose with `cn()` from `src/lib/utils.ts` (clsx + tailwind-merge). Fonts: Fraunces (`serif` class) + Inter, loaded in `app/layout.tsx`.

## Conventions

- **No em dashes** in copy, comments, or chat output (reads as AI-generated). En dashes for numeric ranges are fine.
- DB is the source of truth. When adding a domain field: write a new `supabase/migrations/0XX_*.sql` migration first, then update the TypeScript stub in `src/lib/db/types.ts` (or regenerate with `npm run types:gen`), then the seed mock in `src/lib/mock/*.ts`, then consumers.
- **Commits must not include `Co-Authored-By: Claude` trailers** (or any other AI co-author trailer). Write the commit message body only — no `Co-Authored-By` line, no "Generated with Claude Code" footer.
