# run.ps1
# Helper script to launch both UI and Backend

$projectRoot = $PSScriptRoot
$backendPath = Join-Path $projectRoot "backend"
$frontendPath = Join-Path $projectRoot "frontend"

Write-Output "Starting Backend..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$backendPath'; & '.\venv\Scripts\python.exe' -m uvicorn main:app --reload --port 8000"

Write-Output "Starting Frontend..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$frontendPath'; npm run dev -- --port 3000"

Write-Output "All services launched. Switch to the new terminal windows to view logs."
