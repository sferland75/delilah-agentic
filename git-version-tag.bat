@echo off
echo Creating version 3.0.0 tag...
git tag -a v3.0.0 -m "Form system complete - Ready for report module"

echo Pushing tags...
git push origin v3.0.0

echo Version tagged successfully!
pause