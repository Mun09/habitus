# scripts/

Local dev helpers. PowerShell on Windows is the primary target (see
[CLAUDE.md](../CLAUDE.md)). All scripts are idempotent and safe to
re-run.

## Workflow

```powershell
# Boot Supabase (Postgres + Auth + Storage + Realtime + Studio + Inbucket)
.\scripts\backend-up.ps1            # start, preserve existing data
.\scripts\backend-up.ps1 -Reset     # start AND replay every migration + seed (wipes DB first)

# Start the Next.js dev server in a separate terminal
.\scripts\frontend-up.ps1

# Shutting down
.\scripts\frontend-down.ps1         # kill the dev server on port 3000
.\scripts\backend-down.ps1          # stop containers, preserve volumes
.\scripts\backend-down.ps1 -Wipe    # stop containers AND drop volumes (full wipe)
```

## Scripts

| Script | What |
|---|---|
| [backend-up.ps1](backend-up.ps1) | Boot local Supabase. Requires Docker Desktop running. First run scaffolds `supabase/config.toml`. `-Reset` runs `supabase db reset` to apply every migration + the seed. |
| [backend-down.ps1](backend-down.ps1) | `supabase stop`. `-Wipe` for `--no-backup` (drops volumes). |
| [frontend-up.ps1](frontend-up.ps1) | `npm run dev`. Warns if port 3000 is busy or `.env` is missing. |
| [frontend-down.ps1](frontend-down.ps1) | Finds the process listening on port 3000 and force-kills it. |
| [optimize-images.mjs](optimize-images.mjs) | One-off image optimization (pre-existing). |

## First-time local Supabase setup

1. Install Docker Desktop (WSL2 backend on Windows) and start it
2. `.\scripts\backend-up.ps1` (will scaffold + boot, ~2 minutes first time)
3. Copy the printed `anon key`, `service_role key`, and `API URL` into `.env`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<from start output>
   SUPABASE_SERVICE_ROLE_KEY=<from start output>
   ```
4. `.\scripts\backend-up.ps1 -Reset` to apply migrations + seed data
5. `.\scripts\frontend-up.ps1` in a second terminal
6. Sign in with magic link, then read the email at http://localhost:54324

See [README.md "Optional: run Supabase locally (Docker)"](../README.md) for full reference.

## Bash users

Bash equivalents are not provided; the underlying commands are the same:

```bash
npx supabase start          # = backend-up.ps1
npx supabase db reset       # = backend-up.ps1 -Reset (data side only)
npx supabase stop           # = backend-down.ps1
npx supabase stop --no-backup  # = backend-down.ps1 -Wipe
npm run dev                 # = frontend-up.ps1
# frontend-down.ps1 equivalent (POSIX): kill $(lsof -ti :3000)
```
