@echo off
REM Enhanced Local Inventory System - Start Script (Windows)
REM Starts the backend server

echo =========================================
echo Enhanced Inventory System - Starting
echo =========================================
echo.

REM Check if database exists
if not exist "backend\database.sqlite" (
    echo Error: Database not found!
    echo Please run setup-enhanced.bat first
    exit /b 1
)

echo Starting backend server...
echo Server will run on http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

cd backend
npm start
