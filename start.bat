@echo off
echo Starting Library Recommendation System...
echo.

echo [1/2] Starting Backend Server...
start "Backend Server" cmd /k "cd /d c:\library-recommendation-system\backend && uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"

timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend Server...
start "Frontend Server" cmd /k "cd /d c:\library-recommendation-system\frontend && npm run dev"

echo.
echo ✓ Both servers started!
echo ✓ Backend: http://127.0.0.1:8000
echo ✓ Frontend: http://localhost:5173
echo.
pause
