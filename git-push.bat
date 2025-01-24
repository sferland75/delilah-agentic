@echo off
echo Initializing git repository...
git init

echo Adding remote origin...
git remote add origin https://github.com/sferland75/delilah.git

echo Adding all files...
git add .

echo Creating initial commit...
git commit -m "Initial commit: Occupational Therapy Assessment System"

echo Pushing to main branch...
git push -u origin main

echo Done!
pause