@echo off
echo Removing large file from git history...
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch IHAs/delilah-agentic.exe" --prune-empty --tag-name-filter cat -- --all

echo Forcing git garbage collection...
git gc --prune=now

echo Removing old refs...
git for-each-ref --format="delete %(refname)" refs/original | git update-ref --stdin
git reflog expire --expire=now --all

echo Updating .gitignore...
git add .gitignore
git commit -m "chore: update gitignore to exclude large binary files"

echo Force pushing changes...
git push origin main --force

echo Done!
pause