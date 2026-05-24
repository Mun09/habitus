#!/usr/bin/env bash
# Boot the local Supabase stack (Postgres + Auth + Storage + Realtime
# + Studio + Inbucket) in Docker. Idempotent: safe to re-run.
#
# Usage:
#   ./scripts/backend-up.sh           # start + apply existing migrations
#   ./scripts/backend-up.sh --reset   # start AND wipe DB + replay every migration + seed

set -euo pipefail

cd "$(dirname "$0")/.."

reset=0
for arg in "$@"; do
  case "$arg" in
    --reset|-r) reset=1 ;;
    *) echo "Unknown arg: $arg" >&2; exit 1 ;;
  esac
done

info() { printf '\033[36m==> %s\033[0m\n' "$1"; }
ok()   { printf '\033[32mOK  %s\033[0m\n' "$1"; }
fail() { printf '\033[31mERR %s\033[0m\n' "$1" >&2; exit 1; }

info "Checking Docker..."
if ! docker info >/dev/null 2>&1; then
  fail "Docker is not running. Start Docker Desktop and try again."
fi
ok "Docker is running."

if [ ! -f supabase/config.toml ]; then
  info "First-time setup: scaffolding supabase/config.toml (existing migrations are preserved)..."
  npx supabase init
fi

info "Booting Supabase containers (first run may take a few minutes)..."
npx supabase start

if [ "$reset" -eq 1 ]; then
  info "Resetting database and replaying every migration in supabase/migrations/..."
  npx supabase db reset
fi

ok "Backend is up."
echo
echo "Studio (DB UI):     http://localhost:54323"
echo "Inbucket (emails):  http://localhost:54324"
echo "API gateway:        http://localhost:54321"
echo
echo "Copy the anon key + service_role key printed above into .env."
echo "If this is a fresh boot, re-run with --reset to apply migrations + seeds."
