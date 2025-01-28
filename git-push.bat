@echo off
echo Adding changes to git...
git add .

echo Creating commit...
git commit -m "feat: Add collapsible cognitive symptoms section with severity ratings and observations"

echo Pushing to GitHub...
git push origin main

echo Done!
pause