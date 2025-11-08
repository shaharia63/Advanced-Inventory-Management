@echo off
REM Enhanced Local Inventory System - Automated Setup Script (Windows)
REM This script sets up the complete backend and frontend

echo =========================================
echo Enhanced Inventory System - Setup
echo =========================================
echo.

REM Check Node.js
echo Checking Node.js installation...
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Error: Node.js is not installed
    echo Please install Node.js 16.x or higher from https://nodejs.org/
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [92m✓ Node.js found: %NODE_VERSION%[0m

REM Check npm or pnpm
where pnpm >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    set PKG_MANAGER=pnpm
    echo [92m✓ Using pnpm[0m
) else (
    where npm >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        set PKG_MANAGER=npm
        echo [92m✓ Using npm[0m
    ) else (
        echo Error: Neither npm nor pnpm found
        exit /b 1
    )
)

echo.
echo =========================================
echo Step 1: Backend Setup
echo =========================================

cd backend

echo Installing backend dependencies...
call %PKG_MANAGER% install
if %ERRORLEVEL% NEQ 0 (
    echo [91mFailed to install backend dependencies[0m
    exit /b 1
)
echo [92m✓ Backend dependencies installed[0m

echo.
echo Initializing enhanced database...
call %PKG_MANAGER% run init-db-enhanced
if %ERRORLEVEL% NEQ 0 (
    echo [91mFailed to initialize database[0m
    exit /b 1
)
echo [92m✓ Database initialized[0m

echo.
echo Loading sample data...
call %PKG_MANAGER% run seed-enhanced
if %ERRORLEVEL% NEQ 0 (
    echo [93mWarning: Failed to seed sample data (optional)[0m
) else (
    echo [92m✓ Sample data loaded[0m
)

cd ..

echo.
echo =========================================
echo Step 2: Frontend Setup
echo =========================================

cd frontend\inventory-frontend

echo Installing frontend dependencies...
call %PKG_MANAGER% install
if %ERRORLEVEL% NEQ 0 (
    echo [91mFailed to install frontend dependencies[0m
    exit /b 1
)
echo [92m✓ Frontend dependencies installed[0m

echo.
echo Building frontend...
call %PKG_MANAGER% run build
if %ERRORLEVEL% NEQ 0 (
    echo [91mFailed to build frontend[0m
    exit /b 1
)
echo [92m✓ Frontend built successfully[0m

cd ..\..

echo.
echo =========================================
echo Setup Complete!
echo =========================================
echo.
echo To start the system:
echo.
echo   Option 1: Use the start script
echo     start-enhanced.bat
echo.
echo   Option 2: Start manually
echo     cd backend ^&^& %PKG_MANAGER% start
echo.
echo Then access the system at: http://localhost:3000
echo.
echo Default login credentials:
echo   Email: admin@inventory.local
echo   Password: password
echo.
echo [93m⚠️  IMPORTANT: Change the password after first login![0m
echo.
echo For more information, see:
echo   - README-ENHANCED.md
echo   - INSTALLATION-ENHANCED.md
echo.

pause
