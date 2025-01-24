@echo off
echo Copying project files...

set SOURCE_DIR=c:\Users\ferla\Desktop\delilah-agentic
set TARGET_DIR=c:\Users\ferla\Desktop\delilah-agentic\fresh-delilah

REM Remove existing directory if it exists
if exist "%TARGET_DIR%" rmdir /s /q "%TARGET_DIR%"

REM Create fresh directory
mkdir "%TARGET_DIR%"
cd "%TARGET_DIR%"

REM Initialize git
git init

REM Create directory structure
mkdir "%TARGET_DIR%\src\components"
mkdir "%TARGET_DIR%\src\context"
mkdir "%TARGET_DIR%\src\contexts"
mkdir "%TARGET_DIR%\src\hooks"
mkdir "%TARGET_DIR%\src\lib"
mkdir "%TARGET_DIR%\src\services"
mkdir "%TARGET_DIR%\src\types"
mkdir "%TARGET_DIR%\src\utils"
mkdir "%TARGET_DIR%\public"

REM Copy all files with explicit paths
xcopy /E /I "%SOURCE_DIR%\src" "%TARGET_DIR%\src"
xcopy /E /I "%SOURCE_DIR%\public" "%TARGET_DIR%\public"
copy "%SOURCE_DIR%\package.json" "%TARGET_DIR%"
copy "%SOURCE_DIR%\tsconfig.json" "%TARGET_DIR%"
copy "%SOURCE_DIR%\tsconfig.node.json" "%TARGET_DIR%"
copy "%SOURCE_DIR%\vite.config.ts" "%TARGET_DIR%"
copy "%SOURCE_DIR%\.gitignore" "%TARGET_DIR%"
copy "%SOURCE_DIR%\package-lock.json" "%TARGET_DIR%"
copy "%SOURCE_DIR%\README.md" "%TARGET_DIR%"
copy "%SOURCE_DIR%\postcss.config.js" "%TARGET_DIR%"
copy "%SOURCE_DIR%\tailwind.config.js" "%TARGET_DIR%"

REM Git setup
cd "%TARGET_DIR%"
git add .
git commit -m "Initial commit: Complete application structure - Full assessment system with all components - UI framework - State management - Data persistence - Form validation"
git branch -M main
git remote add origin https://github.com/sferland75/delilah-agentic.git
git push -f origin main

echo Done! Press any key to continue...
pause