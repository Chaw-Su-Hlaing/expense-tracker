param(
    [string]$JavaHome = "C:\Program Files\Java\jdk-17"
)

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot

if (-not (Test-Path $JavaHome)) {
    Write-Error "JDK 17 not found at '$JavaHome'. Pass -JavaHome pointing at a JDK 17 install (this backend requires Java 17)."
    exit 1
}

$backendDir = Join-Path $root "backend"
$frontendDir = Join-Path $root "frontend"
$javaBin = Join-Path $JavaHome "bin"

$backendCmd = "`$env:JAVA_HOME = '$JavaHome'; `$env:Path = '$javaBin;' + `$env:Path; Set-Location '$backendDir'; mvn spring-boot:run"
$frontendCmd = "Set-Location '$frontendDir'; if (-not (Test-Path node_modules)) { npm install }; npm run dev"

Write-Host "Starting backend (Spring Boot, JDK 17) on http://localhost:8080 ..." -ForegroundColor Cyan
$backend = Start-Process powershell -PassThru -ArgumentList @("-NoExit", "-Command", $backendCmd)

Write-Host "Starting frontend (Vite) on http://localhost:5173 ..." -ForegroundColor Cyan
$frontend = Start-Process powershell -PassThru -ArgumentList @("-NoExit", "-Command", $frontendCmd)

Write-Host ""
Write-Host "Backend PID: $($backend.Id)  Frontend PID: $($frontend.Id)"
Write-Host "Each is running in its own PowerShell window. Close those windows (or Ctrl+C inside them) to stop."
