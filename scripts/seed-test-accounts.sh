#!/usr/bin/env bash
# Seed three test accounts (admin / contractor / customer) into the
# Supabase project pointed at by NEXT_PUBLIC_SUPABASE_URL. Idempotent
# — re-running skips creation when the user already exists.
#
# Usage:
#   bash scripts/seed-test-accounts.sh                # reads .env.local
#   bash scripts/seed-test-accounts.sh .env.staging   # reads given file
#
# Requirements:
#   - NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the env
#     file (or already exported).
#   - Migration 011_contractor_link.sql applied (so user_profiles has
#     the contractor_id column).
#   - public.contractors must contain "min-craft" (it does in the seed
#     migrations) for the contractor account's FK to resolve.
#   - python or python3 on PATH (for JSON parsing — works on Windows
#     git bash, macOS, Linux without jq).

set -euo pipefail

ENV_FILE="${1:-.env.local}"
if [ -f "$ENV_FILE" ]; then
  set -a
  # shellcheck source=/dev/null
  source "$ENV_FILE"
  set +a
fi

: "${NEXT_PUBLIC_SUPABASE_URL:?Missing NEXT_PUBLIC_SUPABASE_URL}"
: "${SUPABASE_SERVICE_ROLE_KEY:?Missing SUPABASE_SERVICE_ROLE_KEY}"

SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL%/}"
SR="$SUPABASE_SERVICE_ROLE_KEY"

# Safety prompt when targeting a hosted Supabase project. The local
# CLI URL is always 127.0.0.1:54321 so we skip the prompt there.
if [[ "$SUPABASE_URL" != *127.0.0.1* && "$SUPABASE_URL" != *localhost* ]]; then
  echo "WARNING: target is a remote Supabase project."
  echo "  $SUPABASE_URL"
  echo "  Will create admin@habitus.test, contractor@habitus.test, customer@habitus.test"
  echo "  (password: Habitus123! — change before committing to a real project)"
  read -r -p "Continue? [y/N] " ans
  case "$ans" in
    y|Y|yes|YES) ;;
    *) echo "Aborted."; exit 1 ;;
  esac
fi

if command -v python3 > /dev/null 2>&1; then
  PYTHON=python3
elif command -v python > /dev/null 2>&1; then
  PYTHON=python
else
  echo "Need python or python3 on PATH (for JSON parsing)." >&2
  exit 1
fi

find_user_id_by_email() {
  local email="$1"
  curl -s \
    -H "apikey: $SR" \
    -H "Authorization: Bearer $SR" \
    "$SUPABASE_URL/auth/v1/admin/users?per_page=200" \
  | "$PYTHON" -c "
import json, sys
data = json.load(sys.stdin)
target = sys.argv[1].lower()
for u in data.get('users', []):
    if (u.get('email') or '').lower() == target:
        print(u['id'])
        break
" "$email"
}

create_user() {
  local email="$1" password="$2"
  curl -s -X POST \
    -H "apikey: $SR" \
    -H "Authorization: Bearer $SR" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$email\",\"password\":\"$password\",\"email_confirm\":true}" \
    "$SUPABASE_URL/auth/v1/admin/users" \
  | "$PYTHON" -c "
import json, sys
data = json.load(sys.stdin)
if 'id' in data:
    print(data['id'])
else:
    sys.stderr.write('create_user error: ' + json.dumps(data) + '\n')
"
}

ensure_user() {
  # Returns the user id on stdout. Logs go to stderr.
  local email="$1" password="$2"
  local id
  id=$(find_user_id_by_email "$email")
  if [ -n "$id" ]; then
    echo "  exists: $email -> $id" >&2
  else
    id=$(create_user "$email" "$password")
    if [ -z "$id" ]; then
      echo "  FAILED to create $email" >&2
      return 1
    fi
    echo "  created: $email -> $id" >&2
  fi
  printf '%s' "$id"
}

upsert_profile() {
  local id="$1" role="$2" nickname="$3" contractor_id="${4:-}"
  local body
  if [ -n "$contractor_id" ]; then
    body="[{\"id\":\"$id\",\"role\":\"$role\",\"nickname\":\"$nickname\",\"contractor_id\":\"$contractor_id\"}]"
  else
    body="[{\"id\":\"$id\",\"role\":\"$role\",\"nickname\":\"$nickname\",\"contractor_id\":null}]"
  fi
  local res
  res=$(curl -s -X POST \
    -H "apikey: $SR" \
    -H "Authorization: Bearer $SR" \
    -H "Content-Type: application/json" \
    -H "Prefer: resolution=merge-duplicates,return=minimal" \
    -d "$body" \
    "$SUPABASE_URL/rest/v1/user_profiles")
  if [ -n "$res" ]; then
    # PostgREST only returns a body on error when return=minimal.
    echo "  profile error: $res" >&2
    return 1
  fi
}

echo "Targeting: $SUPABASE_URL"
echo

echo "Admin..."
admin_id=$(ensure_user "admin@habitus.test" "Habitus123!")
upsert_profile "$admin_id" "admin" "Admin" ""
echo "  profile: role=admin"

echo
echo "Contractor..."
contractor_id=$(ensure_user "contractor@habitus.test" "Habitus123!")
upsert_profile "$contractor_id" "contractor" "Craft Room Lead" "min-craft"
echo "  profile: role=contractor, contractor_id=min-craft"

echo
echo "Customer..."
customer_id=$(ensure_user "customer@habitus.test" "Habitus123!")
upsert_profile "$customer_id" "customer" "Customer" ""
echo "  profile: role=customer"

echo
echo "Done."
