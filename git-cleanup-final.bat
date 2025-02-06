@echo off
echo Adding final maintenance scripts...
git add git-final-commit.bat git-verify.bat git-cleanup-final.bat

echo Creating final maintenance commit...
git commit -m "chore: add final repository maintenance scripts"

echo Pushing final changes...
git push origin version-2.0

echo Cleaning up backup branch...
git branch -D backup-main

echo Status after cleanup:
git status
git branch -vv

echo Done! Repository is now complete and clean.
pause