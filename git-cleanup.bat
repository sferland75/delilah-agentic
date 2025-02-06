@echo off
echo Stashing current changes...
git stash

echo Removing large file...
git rm --cached IHAs/delilah-agentic.exe
git rm --cached delilah-agentic.exe
git rm -r --cached IHAs/*.exe

echo Creating backup branch...
git checkout -b backup-main
git checkout version-2.0

echo Cleaning git history...
git filter-repo --invert-paths --path IHAs/delilah-agentic.exe --path delilah-agentic.exe

echo Adding updated gitignore...
git add .gitignore

echo Creating clean commit...
git commit -m "chore: remove large binary files and update gitignore"

echo Force pushing clean history...
git push origin version-2.0 --force

echo Done! Check the repo and then delete the backup branch if everything is ok.
pause