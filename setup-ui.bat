@echo off
echo Installing shadcn/ui components...
echo.

:: Install base dependencies
call npm install tailwindcss-animate class-variance-authority clsx tailwind-merge
call npm install @radix-ui/react-checkbox @radix-ui/react-dialog @radix-ui/react-label
call npm install @radix-ui/react-radio-group @radix-ui/react-scroll-area @radix-ui/react-select
call npm install @radix-ui/react-separator @radix-ui/react-slot @radix-ui/react-tabs
call npm install @radix-ui/react-toast lucide-react

:: Remove accordion if it exists
rd /s /q "src\components\ui\accordion.tsx"

echo Cleaning up node_modules...
rd /s /q node_modules
del package-lock.json

echo Running fresh install...
call npm install

echo Starting development server...
call npm run dev

pause