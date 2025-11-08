@echo off
echo =====================================
echo   Local Inventory System Setup
echo =====================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo Step 1: Installing backend dependencies...
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Failed to install backend dependencies
    pause
    exit /b 1
)
echo Backend dependencies installed!
echo.

echo Step 2: Initializing database...
call npm run init-db
if %ERRORLEVEL% NEQ 0 (
    echo Failed to initialize database
    pause
    exit /b 1
)
echo Database initialized!
echo.

echo Step 3: Loading sample data...
call npm run seed
if %ERRORLEVEL% NEQ 0 (
    echo Failed to load sample data
    pause
    exit /b 1
)
echo Sample data loaded!
echo.

echo Step 4: Installing frontend dependencies...
cd ..\frontend\inventory-frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Failed to install frontend dependencies
    pause
    exit /b 1
)
echo Frontend dependencies installed!
echo.

echo =====================================
echo   Setup Complete!
echo =====================================
echo.
echo To start the application:
echo 1. Backend: cd backend && npm start
echo 2. Frontend: cd frontend\inventory-frontend && npm run dev
echo.
echo Default admin credentials:
echo   Email: admin@inventory.local
echo   Password: password
echo.
echo Backend will run on: http://localhost:3000
echo Frontend will run on: http://localhost:5173
echo =====================================
pause
