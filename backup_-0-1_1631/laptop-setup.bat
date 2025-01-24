@echo off
echo Setting up Delilah Agentic on laptop...
echo.

echo Moving files to project root...
cd ..
xcopy /E /I /Y "backup_-0-1_1631\src" "src\"
copy /Y "backup_-0-1_1631\package.json" .
copy /Y "backup_-0-1_1631\package-lock.json" .
copy /Y "backup_-0-1_1631\tsconfig.json" .
copy /Y "backup_-0-1_1631\tsconfig.node.json" .
copy /Y "backup_-0-1_1631\vite.config.ts" .
copy /Y "backup_-0-1_1631\tailwind.config.js" .
copy /Y "backup_-0-1_1631\postcss.config.js" .
copy /Y "backup_-0-1_1631\.env" .

echo Installing dependencies...
call npm install

echo.
echo Setup complete! Run 'npm run dev' to start development server.
pause