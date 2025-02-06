@echo off
echo Current branch status:
git status

echo Branch information:
git branch -vv

echo Recent commits:
git log --oneline -n 5

echo Done!
pause