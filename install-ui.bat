@echo off
echo Installing UI components...
echo.

echo Installing Radix UI components...
call npm install @radix-ui/react-accordion
call npm install @radix-ui/react-collapsible
call npm install @radix-ui/react-progress
call npm install @radix-ui/react-slider
call npm install @radix-ui/react-switch
call npm install @radix-ui/react-tooltip

echo Installing additional required dependencies...
call npm install @radix-ui/react-dialog
call npm install @radix-ui/react-label
call npm install @radix-ui/react-select
call npm install @radix-ui/react-separator
call npm install @radix-ui/react-slot
call npm install @radix-ui/react-tabs

echo Starting development server...
call npm run dev

pause