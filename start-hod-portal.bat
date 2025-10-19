@echo off
echo ========================================
echo       HOD Portal Docker Manager
echo ========================================
echo.

REM Check if Docker Desktop is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker Desktop is not running!
    echo Please start Docker Desktop and wait for it to fully load, then try again.
    echo.
    pause
    exit /b 1
)

echo Docker Desktop is running. Ready to proceed!
echo.
echo Available options:
echo 1. Start HOD portal
echo 2. Start HOD portal in background
echo 3. Stop HOD portal
echo 4. View container status
echo 5. View logs
echo 6. Rebuild container
echo 7. Exit
echo.

set /p choice="Enter your choice (1-7): "

if "%choice%"=="1" (
    echo Starting HOD portal...
    docker-compose up --build
) else if "%choice%"=="2" (
    echo Starting HOD portal in background...
    docker-compose up -d --build
    echo.
    echo HOD Portal is now running in the background!
    echo Access it at: http://localhost:3006
) else if "%choice%"=="3" (
    echo Stopping HOD portal...
    docker-compose down
) else if "%choice%"=="4" (
    echo Container status:
    docker-compose ps
) else if "%choice%"=="5" (
    echo Showing logs...
    docker-compose logs -f
) else if "%choice%"=="6" (
    echo Rebuilding container...
    docker-compose build --no-cache
) else if "%choice%"=="7" (
    echo Goodbye!
    exit
) else (
    echo Invalid choice. Please try again.
    pause
    goto :start
)

echo.
pause
