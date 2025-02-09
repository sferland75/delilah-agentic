@echo off
echo Installing Radix UI components individually...

set components=react-accordion react-alert-dialog react-checkbox react-collapsible react-dialog react-label react-popover react-progress react-radio-group react-scroll-area react-select react-separator react-slider react-switch react-tabs react-toast

for %%i in (%components%) do (
    echo Installing @radix-ui/%%i
    npm install @radix-ui/%%i --save
    if errorlevel 1 (
        echo Error installing %%i
        pause
    )
)

echo Installing other required packages...
npm install react-icons --save
npm install @phosphor-icons/react --save
npm install tailwindcss-animate --save-dev

echo Done! All components should be installed.
pause