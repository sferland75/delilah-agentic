@echo off
echo Closing Node processes...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM npm.exe >nul 2>&1

echo Waiting for processes to close...
timeout /t 5 /nobreak

echo Removing node_modules...
rd /s /q node_modules
del /f /q package-lock.json

echo Installing dependencies...
call npm cache clean --force
call npm install

echo Done!
