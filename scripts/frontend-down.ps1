#!/usr/bin/env pwsh
# Kill whatever is listening on port 3000 (the Next.js dev server).
#
# Usage:
#   .\scripts\frontend-down.ps1

$ErrorActionPreference = "Stop"

function Info($msg) { Write-Host "==> $msg" -ForegroundColor Cyan }
function Ok($msg)   { Write-Host "OK  $msg"  -ForegroundColor Green }

Info "Looking for process on port 3000..."
$conns = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue

if (-not $conns) {
    Ok "Nothing listening on port 3000. Already down."
    exit 0
}

$pids = $conns | Select-Object -ExpandProperty OwningProcess -Unique
foreach ($targetPid in $pids) {
    try {
        $proc = Get-Process -Id $targetPid -ErrorAction Stop
        Info "Stopping $($proc.ProcessName) (PID $targetPid)..."
        Stop-Process -Id $targetPid -Force -ErrorAction Stop
    } catch {
        Write-Host "ERR Failed to stop PID $targetPid : $_" -ForegroundColor Red
    }
}

Ok "Frontend is down."
