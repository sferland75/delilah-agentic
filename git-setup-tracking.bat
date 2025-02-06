@echo off
echo Fetching latest from remote...
git fetch origin

echo Setting up tracking branch...
git push -u origin version-2.0

echo Verifying remotes...
git remote -v

echo Verifying current branch...
git branch -vv

echo Done!
pause