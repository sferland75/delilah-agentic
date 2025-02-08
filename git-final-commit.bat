@echo off
echo Adding all changes...
git add .

echo Creating version 3.0 commit...
git commit -F commit_message.txt

echo Pushing final changes...
git push origin main

echo Done! Repository is now at version 3.0
pause