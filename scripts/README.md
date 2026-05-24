# scripts/

Local dev helpers. Bash on top (works in git bash on Windows, plus
macOS / Linux). All scripts are idempotent and safe to re-run.

## Workflow

```bash
# Boot Supabase (Postgres + Auth + Storage + Realtime + Studio + Inbucket)
./scripts/backend-up.sh             # start, preserve existing data
./scripts/backend-up.sh --reset     # start AND wipe DB + replay every migration + seed

# Start the Next.js dev server in a separate terminal
./scripts/frontend-up.sh

# Shutting down
./scripts/frontend-down.sh          # kill the dev server on port 3000
./scripts/backend-down.sh           # stop containers, preserve volumes
./scripts/backend-down.sh --wipe    # stop containers AND drop volumes (full wipe)
```

If a script complains about permissions on first run:

```bash
chmod +x scripts/*.sh
```

## Scripts

| Script | What |
|---|---|
| [backend-up.sh](backend-up.sh) | Boot local Supabase. Requires Docker Desktop running. First run scaffolds `supabase/config.toml`. `--reset` runs `supabase db reset` to wipe the DB and replay every migration + the seed. |
| [backend-down.sh](backend-down.sh) | `supabase stop`. `--wipe` for `--no-backup` (drops volumes). |
| [frontend-up.sh](frontend-up.sh) | `npm run dev`. Warns if port 3000 is busy or `.env` is missing. |
| [frontend-down.sh](frontend-down.sh) | Finds the process listening on port 3000 and kills it. Uses `netstat` + `taskkill` on git bash, `lsof` + `kill` on POSIX. |
| [optimize-images.mjs](optimize-images.mjs) | One-off image optimization (pre-existing). |

## First-time local Supabase setup

1. Install Docker Desktop (WSL2 backend on Windows) and start it
2. `./scripts/backend-up.sh` (will scaffold + boot, ~2 minutes first time)
3. Copy the printed `anon key`, `service_role key`, and `API URL` into `.env`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<from start output>
   SUPABASE_SERVICE_ROLE_KEY=<from start output>
   ```
4. `./scripts/backend-up.sh --reset` to apply migrations + seed data
5. `./scripts/frontend-up.sh` in a second terminal
6. Sign in with magic link, then read the email at http://localhost:54324

See [README.md "Optional: run Supabase locally (Docker)"](../README.md) for full reference.
