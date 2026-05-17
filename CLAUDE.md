# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

Habitus — interior design + verified contractor matching + live project tracking, packaged as a single Next.js demo. There is no backend; every domain object (contractors, projects, design options, materials, reviews, image URLs) is defined under `src/lib/mock/` and consumed by client components. Treat this as a clickable prototype, not a real app.

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

The top `StageIndicator` is **clickable** — users can jump to any stage at any time. The Result stage **always shows the 5 W2-1 sample spaces** regardless of upstream selection (hard-coded `W2_BEFORES` / `W2_AFTERS` arrays in `result-view.tsx`). Any change that breaks this assumption needs to be intentional.

State that needs to survive the transition to `/matching` is persisted via `DesignPlanProvider` (`src/lib/design-plan.tsx`) into `localStorage` key `habitus.designPlan`.

### Image asset isolation (important)

All image URLs are centralized in `src/lib/mock/images.ts`. Two W2-1 photo sets exist and **must stay isolated**:

- `IMAGES.scenarios.w2` → `public/images/scenarios/w2/` — Design Studio AI result images. Used by Design Studio only.
- `PROJECT_W2_PHOTOS` → `public/images/projects/w2-1/` — isolated copies used by My Projects history (`src/lib/mock/projects.ts`, `src/app/projects/[id]/page.tsx`). Must NOT reference `scenarios/`.

When adding photos to one surface, do not reach into the other folder. The history mock messages in `projects.ts` are written to match the specific contents of the 3 `projects/w2-1/` photos (reference space / ceiling / meeting bay) — if you change the photo set, rewrite the messages too.

### i18n

`src/lib/i18n/locale-provider.tsx` exposes `useLocale()` returning `t(key)` and `pick(bilingual)`. Locale is hard-coded to `"en"`; `dictionaries.ts` is keyed by `Locale` so a future locale switch only needs the provider state changed. Some mock data uses `Bilingual = string | { en: string }` — always go through `pick()`.

### UI primitives

`src/components/ui/` holds shadcn-style Radix wrappers (Tabs, Dialog, Progress, etc.). Compose with `cn()` from `src/lib/utils.ts` (clsx + tailwind-merge). Fonts: Fraunces (`serif` class) + Inter, loaded in `app/layout.tsx`.

## Conventions

- **No em dashes** in copy, comments, or chat output (reads as AI-generated). En dashes for numeric ranges are fine.
- Mock data is the source of truth for IDs and shapes. When adding a domain field, update the type in `src/lib/mock/*.ts` first, then consumers.
