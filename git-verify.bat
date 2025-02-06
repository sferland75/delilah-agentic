@echo off
echo Checking git status...
git status

echo Checking recent commits...
git log --oneline -n 5

echo Verifying branch status...
git branch -vv

echo Done!
pause