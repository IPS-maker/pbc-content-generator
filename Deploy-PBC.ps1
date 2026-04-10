# PBC Content Generator — deploy helper (Vercel)
# Run: right-click → Run with PowerShell, or: powershell -ExecutionPolicy Bypass -File .\Deploy-PBC.ps1

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host ""
Write-Host "  PBC Content Generator — deploy to Vercel" -ForegroundColor Cyan
Write-Host "  -----------------------------------------" -ForegroundColor Cyan
Write-Host ""

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Host "  ERROR: Node.js is not installed." -ForegroundColor Red
  Write-Host "  Install LTS from https://nodejs.org then run this script again." -ForegroundColor Yellow
  Read-Host "  Press Enter to exit"
  exit 1
}

Write-Host "  [1/3] npm install ..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) { throw "npm install failed" }

Write-Host ""
Write-Host "  [2/3] Vercel login (browser opens). One-time on this computer." -ForegroundColor Yellow
npx vercel login
if ($LASTEXITCODE -ne 0) { throw "vercel login failed or cancelled" }

Write-Host ""
Write-Host "  [3/3] Production deploy ..." -ForegroundColor Yellow
Write-Host "  If asked: link to existing project = No (first time), or Yes if you already have one." -ForegroundColor DarkGray
npx vercel --prod
if ($LASTEXITCODE -ne 0) { throw "vercel deploy failed" }

Write-Host ""
Write-Host "  Done. Copy the https://....vercel.app URL from the output above for mentees." -ForegroundColor Green
Write-Host "  Then add GOOGLE_SCRIPT_WEB_APP_URL in Vercel → Project → Settings → Environment Variables → Redeploy." -ForegroundColor Cyan
Write-Host ""
Read-Host "  Press Enter to close"
