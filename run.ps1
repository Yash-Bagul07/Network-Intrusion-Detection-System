# run.ps1
# Helper script to launch both UI and Backend

Write-Output "Starting Backend..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; .\venv\Scripts\Activate.ps1; uvicorn main:app --reload --port 8000"

Write-Output "Starting Frontend..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev -- --port 3000"

Write-Output "All services launched. Switch to the new terminal windows to view logs."
