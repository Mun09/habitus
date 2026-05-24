#!/usr/bin/env bash
# Kill whatever is listening on port 3000 (the Next.js dev server).
# Works in git bash on Windows (uses netstat + taskkill) and on
# Linux/macOS (uses lsof + kill).
#
# Usage:
#   ./scripts/frontend-down.sh

set -euo pipefail

info() { printf '\033[36m==> %s\033[0m\n' "$1"; }
ok()   { printf '\033[32mOK  %s\033[0m\n' "$1"; }
err()  { printf '\033[31mERR %s\033[0m\n' "$1" >&2; }

info "Looking for process on port 3000..."

# Windows path (git bash). netstat -ano: last column is PID.
if command -v taskkill >/dev/null 2>&1; then
  # shellcheck disable=SC2207
  pids=($(netstat -ano 2>/dev/null \
            | grep -E ":3000[[:space:]]+.*LISTENING" \
            | awk '{print $NF}' \
            | sort -u))
  if [ "${#pids[@]}" -eq 0 ]; then
    ok "Nothing listening on port 3000. Already down."
    exit 0
  fi
  for pid in "${pids[@]}"; do
    info "Stopping PID $pid ..."
    # // escapes the leading / for git bash's mingw path translation.
    taskkill //F //PID "$pid" >/dev/null || err "Failed to stop PID $pid"
  done
  ok "Frontend is down."
  exit 0
fi

# POSIX path (Linux/macOS).
if command -v lsof >/dev/null 2>&1; then
  pids=$(lsof -ti:3000 || true)
  if [ -z "$pids" ]; then
    ok "Nothing listening on port 3000. Already down."
    exit 0
  fi
  echo "$pids" | xargs -r kill -9
  ok "Frontend is down."
  exit 0
fi

err "Neither taskkill nor lsof is available. Kill the dev server manually."
exit 1
