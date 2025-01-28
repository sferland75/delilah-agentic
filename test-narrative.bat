@echo off
echo Running narrative component tests...

echo.
echo Testing NarrativeEngine...
npm test src/components/ReportGeneration/narrative/__tests__/NarrativeEngine.test.ts

echo.
echo Testing narrative utilities...
npm test src/components/ReportGeneration/testing/narrative-test-utils.test.ts