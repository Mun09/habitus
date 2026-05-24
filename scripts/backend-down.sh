#!/usr/bin/env bash
# Stop the local Supabase stack.
#
# Usage:
#   ./scripts/backend-down.sh          # stop containers, preserve volumes (DB survives)
#   ./scripts/backend-down.sh --wipe   # stop AND drop volumes (full wipe, no recovery)

set -euo pipefail

cd "$(dirname "$0")/.."

wipe=0
for arg in "$@"; do
  case "$arg" in
    --wipe|-w) wipe=1 ;;
    *) echo "Unknown arg: $arg" >&2; exit 1 ;;
  esac
done

info() { printf '\033[36m==> %s\033[0m\n' "$1"; }
ok()   { printf '\033[32mOK  %s\033[0m\n' "$1"; }

if [ "$wipe" -eq 1 ]; then
  info "Stopping Supabase AND dropping all volumes..."
  npx supabase stop --no-backup
else
  info "Stopping Supabase (volumes preserved)..."
  npx supabase stop
fi

ok "Backend is down."
