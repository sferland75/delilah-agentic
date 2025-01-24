@echo off
echo Adding changes to git...
git add .

echo Creating commit...
git commit -m "fix: Improve form clear functionality and ensure proper state reset"

echo Pushing to GitHub...
git push origin main

echo Done!
pause