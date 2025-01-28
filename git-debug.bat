@echo off
echo Checking Git Repository Status...
echo.

echo Git Branch:
git branch

echo.
echo Modified Files:
git ls-files -m

echo.
echo Untracked Files:
git ls-files --others --exclude-standard

echo.
echo All Tracked Files:
git ls-files

echo.
echo Done!