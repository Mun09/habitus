#!/usr/bin/env pwsh
# Boot the local Supabase stack (Postgres + Auth + Storage + Realtime
# + Studio + Inbucket) in Docker. Idempotent: safe to re-run.
#
# Usage:
#   .\scripts\backend-up.ps1           # start + apply existing migrations
#   .\scripts\backend-up.ps1 -Reset    # wipe DB and replay every migration + seed

[CmdletBinding()]
param(
    [switch]$Reset
)

$ErrorActionPreference = "Stop"
$root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $root

function Info($msg)  { Write-Host "==> $msg" -ForegroundColor Cyan }
function Ok($msg)    { Write-Host "OK  $msg"  -ForegroundColor Green }
function Warn($msg)  { Write-Host "!!  $msg"  -ForegroundColor Yellow }
function Fail($msg)  { Write-Host "ERR $msg"  -ForegroundColor Red; exit 1 }

Info "Checking Docker..."
try {
    docker info *> $null
    if ($LASTEXITCODE -ne 0) { throw "docker info failed" }
} catch {
    Fail "Docker is not running. Start Docker Desktop and try again."
}
Ok "Docker is running."

if (-not (Test-Path "supabase/config.toml")) {
    Info "First-time setup: scaffolding supabase/config.toml (your existing migrations are preserved)..."
    npx supabase init
    if ($LASTEXITCODE -ne 0) { Fail "supabase init failed." }
}

Info "Booting Supabase containers (this may take a few minutes the first time)..."
npx supabase start
if ($LASTEXITCODE -ne 0) { Fail "supabase start failed." }

if ($Reset) {
    Info "Resetting database and replaying every migration in supabase/migrations/..."
    npx supabase db reset
    if ($LASTEXITCODE -ne 0) { Fail "supabase db reset failed." }
}

Ok "Backend is up."
Write-Host ""
Write-Host "Studio (DB UI):     http://localhost:54323" -ForegroundColor White
Write-Host "Inbucket (emails):  http://localhost:54324" -ForegroundColor White
Write-Host "API gateway:        http://localhost:54321" -ForegroundColor White
Write-Host ""
Write-Host "Copy the anon key + service_role key printed above into .env." -ForegroundColor Gray
Write-Host "If this is a fresh boot, run with -Reset to apply migrations + seeds." -ForegroundColor Gray
