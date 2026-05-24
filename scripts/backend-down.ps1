#!/usr/bin/env pwsh
# Stop the local Supabase stack.
#
# Usage:
#   .\scripts\backend-down.ps1          # stop containers, preserve volumes (DB data survives)
#   .\scripts\backend-down.ps1 -Wipe    # stop AND drop volumes (full wipe, no recovery)

[CmdletBinding()]
param(
    [switch]$Wipe
)

$ErrorActionPreference = "Stop"
$root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $root

function Info($msg) { Write-Host "==> $msg" -ForegroundColor Cyan }
function Ok($msg)   { Write-Host "OK  $msg"  -ForegroundColor Green }

if ($Wipe) {
    Info "Stopping Supabase AND dropping all volumes..."
    npx supabase stop --no-backup
} else {
    Info "Stopping Supabase (volumes preserved)..."
    npx supabase stop
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERR supabase stop returned non-zero. The stack may have been already stopped." -ForegroundColor Yellow
    exit $LASTEXITCODE
}

Ok "Backend is down."
