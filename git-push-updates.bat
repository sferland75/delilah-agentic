@echo off
<<<<<<< HEAD
echo Pushing changes to repository...
git push origin version-2.0
=======
echo Running tests...
call npm test src/components/ReportGeneration/agents/adl/__tests__

if %errorlevel% neq 0 (
    echo Tests failed! Aborting push...
    pause
    exit /b %errorlevel%
)

echo Tests passed! Proceeding with git updates...

echo.
echo Adding files to git...
git add .

echo.
echo Creating commit...
set /p commit_msg=Enter commit message (or press Enter for default): 
if "%commit_msg%"=="" (
    set commit_msg=Updated IADL agent implementation with improved barrier extraction and type safety
)
git commit -m "%commit_msg%"

echo.
echo Pushing to remote...
git push

echo.
echo Process completed!
pause
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
