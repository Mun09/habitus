# Habitus

Interior design + verified contractor matching + live project tracking,
packaged as a single Next.js app.

The Design Studio runs through OpenAI `gpt-image-1` to render a styled
result from a user's space photo. Contractors, quotes, projects, chat,
reviews, and the PM admin console are backed by Supabase (Postgres,
Auth, Storage, Realtime).

When no Supabase credentials are present, the app degrades to mock
data so the UI walk-through still renders locally.

## Stack

- Next.js 16.2.4 (App Router, Turbopack) + React 19
- Tailwind v4 + Radix UI + framer-motion
- Supabase (Postgres + Auth + Storage + Realtime)
- OpenAI Node SDK (`gpt-image-1` image edit)
- Deployed on Vercel

## Quick start (already configured)

```bash
npm install
cp .env.example .env.local   # fill in real keys
npm run dev
```

Open http://localhost:3000.

## First-time setup

You only need to do this once per environment.

### 1. Supabase project

1. Create a new project at https://supabase.com/dashboard.
2. Copy three values from **Project Settings > API**:
   - `Project URL` to `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` to `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` (keep secret) to `SUPABASE_SERVICE_ROLE_KEY`
3. **SQL Editor** > new query, run each migration in order:
   - [supabase/migrations/001_schema.sql](supabase/migrations/001_schema.sql): 9 tables, indexes, Realtime publish, updated_at triggers
   - [supabase/migrations/002_rls.sql](supabase/migrations/002_rls.sql): owner-scoped RLS policies
   - [supabase/migrations/003_seed.sql](supabase/migrations/003_seed.sql): 8 prototype contractors
   - [supabase/migrations/004_public_reads.sql](supabase/migrations/004_public_reads.sql): public read on reviews
4. **Storage** > new bucket, name it `habitus-uploads`, mark it **public**.
   Folder structure used at runtime:
   - `user-spaces/{userId}/{timestamp}.jpg`: space photo uploads
   - `user-references/{userId}/{timestamp}.jpg`: reference uploads
   - `ai-outputs/{planId}/{index}.png`: gpt-image-1 results
5. **Authentication > Providers > Google**, enable, paste your OAuth
   client id + secret (see step 3). Under **URL Configuration** add
   the redirect URLs you will use:
   - `http://localhost:3000/auth/callback`
   - `https://<your-vercel-domain>/auth/callback`

### 2. Google OAuth client

1. https://console.cloud.google.com → APIs & Services → Credentials →
   Create OAuth client ID (Web application).
2. Authorized redirect URIs: paste the Supabase callback URL shown in
   the Supabase Google provider page (looks like
   `https://<project-ref>.supabase.co/auth/v1/callback`).
3. Copy client id + secret back into the Supabase Google provider form.

Kakao and Naver buttons are intentionally left disabled in this MVP.
They show up on the sign-in page with a "Soon" badge so the layout
stays stable; wire them through Supabase Custom OAuth when needed.

### 3. OpenAI

1. https://platform.openai.com → API keys → create a key.
2. Confirm your account has access to `gpt-image-1` (Image generation
   models tier). Single render: about 15–30s, $0.04–0.17 each.
3. Paste into `OPENAI_API_KEY`.

### 4. .env.local

Copy [.env.example](.env.example) and fill in the values you collected:

```
NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

OPENAI_API_KEY=sk-...

NEXT_PUBLIC_APP_URL=http://localhost:3000

# Comma-separated emails allowed into /admin. Yours goes here.
ADMIN_EMAILS=you@example.com
```

`.env.local` is gitignored. Never commit `SUPABASE_SERVICE_ROLE_KEY`
or `OPENAI_API_KEY`.

### 5. (Optional) Strong types from your schema

The repo ships a hand-written stub in
[src/lib/db/types.ts](src/lib/db/types.ts) so the build does not depend
on the Supabase CLI. To get accurate types once your project exists:

```bash
npx supabase gen types typescript --project-id <ref> > src/lib/db/types.ts
```

Then re-add the `<Database>` generic to both clients:

- [src/lib/supabase/client.ts](src/lib/supabase/client.ts): `createBrowserClient<Database>(...)`
- [src/lib/supabase/server.ts](src/lib/supabase/server.ts): `createServerClient<Database>(...)`

## Run

```bash
npm run dev      # next dev (http://localhost:3000)
npm run build    # next build
npm run start    # next start (production)
npm run lint     # eslint (eslint-config-next)
```

No test runner is configured. Shell is **PowerShell on Windows**; use
PS syntax or invoke `bash` explicitly inside scripts.

## End-to-end smoke test

After Supabase + OpenAI keys are live:

1. http://localhost:3000/sign-in → continue with Google or send a magic
   link.
2. `/onboarding` → fill nickname / address / budget. A row should
   appear in `user_profiles` (Supabase Studio > Table editor).
3. `/design` → upload one space photo, pick a style and a few options,
   click **Generate**. Wait 15–30s. The space photo lands in Storage
   under `user-spaces/...`; the AI result lands in `ai-outputs/...`;
   a `design_plans` row flips from `generating` to `done`.
4. "Match a pro with this design" → `/matching`. The 8 seeded
   contractors load from the `contractors` table.
5. Click any contractor → request a consultation. A `quote_requests`
   row appears, then a paired `projects` row, and you are routed to
   `/projects/{uuid}`.
6. On `/projects/{uuid}`, type a message in the PM tab. A
   `chat_messages` row is written. Realtime updates fire when new
   rows appear.
7. `/admin` (only if your email is in `ADMIN_EMAILS`) → pick the
   project → publish a `project_update`, send a PM message, or push
   `progress` to 100 + `status` to `completed`. Switch back to
   `/projects/{uuid}` to see the changes (Realtime + revalidatePath).
8. When `status === completed`, the **Write a review** button shows
   up in the completed side panel. Submitting writes to `reviews`,
   which the contractor detail page renders for everyone.

If anything 404s or returns empty, check Supabase Studio first. The
RLS policies in 002 are strict, so missing user context is the most
common cause.

## Deploy to Vercel

The project is already linked (`.vercel/project.json`).

```bash
vercel deploy --prod --yes
```

Before the first deploy:

1. **Vercel dashboard > Project > Settings > Environment Variables**.
   Add the same six keys from `.env.local`, scoping them to
   `Production`, `Preview`, and `Development`. Set
   `NEXT_PUBLIC_APP_URL` to your production URL (no trailing slash).
2. Add the production callback to both providers:
   - Google Cloud → OAuth client → Authorized redirect URIs gets the
     Supabase callback (already in step 1.2 above; no change here).
   - Supabase > Auth > URL Configuration → add
     `https://<prod-domain>/auth/callback`.
3. Run the deploy command. Vercel rebuilds with Turbopack; expect about
   30s of build time, 12+ routes prerendered or marked dynamic.

Aliased prototype domain: `gather-alpha-six.vercel.app`.

## Admin (PM) console

`/admin` is gated behind:

1. The same auth middleware as the rest of the app (session required).
2. An additional email allowlist (`ADMIN_EMAILS` env var). Empty list
   disables the surface entirely.

Each Server Action under [src/app/admin/actions.ts](src/app/admin/actions.ts)
re-checks the caller's email before using the service-role client, so
even if the middleware is misconfigured the surface refuses to write.

From `/admin/projects/{id}` a PM can:

- Update `progress`, `current_stage`, `status` on the project row.
- Publish a `project_updates` row (title, body, stage, author, plus
  one photo URL per line; the MVP does not upload binary files).
- Send a `chat_messages` row as `sender_type='pm'` to the customer;
  the customer's tracking page picks it up via Realtime instantly.

## Architecture

For the runtime behavior, route map, design-studio flow, image
isolation rules, and code conventions, read [CLAUDE.md](CLAUDE.md).

## Heads-up: Next.js version

This repo runs Next 16.2.4 with the App Router. Some APIs differ from
older Next 13/14/15 patterns:

- `params` and `searchParams` are async (`Promise<...>`) on server
  pages. Use `await params`, not `use(params)` in server components.
- `cookies()` from `next/headers` is async; the Supabase server
  client awaits it before reading.
- Tailwind is **v4** (`@tailwindcss/postcss`), not v3. Config lives in
  CSS, not `tailwind.config.js`.

When in doubt, the canonical guide is in
`node_modules/next/dist/docs/`.

## License

Prototype, no license attached. Not for production redistribution.
