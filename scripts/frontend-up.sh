#!/usr/bin/env bash
# Start the Next.js dev server on http://localhost:3000.
#
# Reads .env (or .env.local) from repo root automatically. Assumes the
# backend (cloud or local Supabase) is reachable at the URL in .env.
#
# Usage:
#   ./scripts/frontend-up.sh

set -euo pipefail

cd "$(dirname "$0")/.."

info() { printf '\033[36m==> %s\033[0m\n' "$1"; }
warn() { printf '\033[33m!!  %s\033[0m\n' "$1"; }

if [ ! -f .env ] && [ ! -f .env.local ]; then
  warn "No .env or .env.local found. The app will redirect every protected route to /sign-in."
fi

# Check if port 3000 is already taken. On git bash on Windows, prefer
# netstat (always present); on Linux/macOS fall back to lsof.
if command -v netstat >/dev/null 2>&1 && netstat -ano 2>/dev/null | grep -qE ":3000[[:space:]]+.*LISTENING"; then
  warn "Port 3000 is already in use. Stop it first with ./scripts/frontend-down.sh"
  exit 1
elif command -v lsof >/dev/null 2>&1 && lsof -ti:3000 >/dev/null 2>&1; then
  warn "Port 3000 is already in use. Stop it first with ./scripts/frontend-down.sh"
  exit 1
fi

info "Starting Next.js dev server on http://localhost:3000 ..."
npm run dev
