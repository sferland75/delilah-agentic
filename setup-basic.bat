@echo off
echo Setting up basic development environment...
echo.

:: Change to the correct directory
cd /d "%~dp0"

echo Current directory: %CD%

echo Cleaning up previous installation...
rd /s /q node_modules 2>nul
del package-lock.json 2>nul

echo Installing dependencies...
call npm install

echo Starting development server...
call npm run dev

pause