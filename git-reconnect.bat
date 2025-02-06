@echo off
echo Reconnecting to GitHub repository...
git remote add origin https://github.com/sferland75/delilah-agentic.git

echo Setting up tracking...
git branch -u origin/version-2.0 version-2.0

echo Adding new files...
git add .gitignore git-cleanup.bat git-fix.bat install-git-filter-repo.bat

echo Creating commit...
git commit -m "chore: add git maintenance scripts"

echo Pushing changes...
git push origin version-2.0

echo Done!
pause