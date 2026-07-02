@echo off
title Job Hunt OS — Development Servers

echo ==========================================
echo   Job Hunt OS — Starting Dev Environment
echo ==========================================
echo.

REM Start FastAPI backend in a new window
echo [1/2] Starting FastAPI backend (port 8000)...
start "Job Hunt OS — Backend" cmd /k "cd /d %~dp0 && python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload"

REM Small delay to let backend boot
timeout /t 2 /nobreak >nul

REM Start React frontend in a new window
echo [2/2] Starting React frontend (port 5173)...
start "Job Hunt OS — Frontend" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo ==========================================
echo   Both servers started in separate windows
echo   Frontend: http://localhost:5173
echo   Backend:  http://127.0.0.1:8000
echo   API Docs: http://127.0.0.1:8000/docs
echo ==========================================
echo.
echo Press any key to exit this window...
pause >nul
