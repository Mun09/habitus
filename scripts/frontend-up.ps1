#!/usr/bin/env pwsh
# Start the Next.js dev server on http://localhost:3000.
#
# Reads .env (or .env.local) from repo root automatically. Assumes the
# backend (cloud or local Supabase) is reachable at the URL in .env.
#
# Usage:
#   .\scripts\frontend-up.ps1

$ErrorActionPreference = "Stop"
$root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $root

function Info($msg) { Write-Host "==> $msg" -ForegroundColor Cyan }
function Warn($msg) { Write-Host "!!  $msg"  -ForegroundColor Yellow }

if (-not (Test-Path ".env") -and -not (Test-Path ".env.local")) {
    Warn "No .env or .env.local found. The app will degrade to mock data + every protected route redirects to /sign-in."
}

# Check if port 3000 is already taken.
$existing = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
if ($existing) {
    Warn "Port 3000 is already in use (PID $($existing.OwningProcess)). Stop it first with .\scripts\frontend-down.ps1"
    exit 1
}

Info "Starting Next.js dev server on http://localhost:3000 ..."
npm run dev
