@echo off
echo Updating Delilah repository...

REM Save any local changes
git stash

REM Switch to version-2.0 branch if not already on it
git checkout version-2.0

REM Pull latest changes
git pull origin version-2.0

REM Restore local changes if any
git stash pop

REM Update dependencies
npm install

echo.
echo Update complete! You can now run:
echo npm run dev

pause