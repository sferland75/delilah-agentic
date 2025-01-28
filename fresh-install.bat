@echo off
echo Starting fresh installation...
echo.

echo Cleaning previous installation...
if exist node_modules rd /s /q node_modules
if exist package-lock.json del /f /q package-lock.json

echo Running npm installation...
call npm install

echo Starting development server...
call npm run dev

pause