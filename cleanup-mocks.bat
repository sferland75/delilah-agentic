@echo off
echo Cleaning up duplicate mock files...

rem Remove duplicate mocks from dist directory
del /Q "dist\src\__mocks__\fileMock.js"
del /Q "dist\src\__mocks__\lucide-react.js"
del /Q "dist\src\__mocks__\mockComponents.js"
del /Q "dist\src\components\ReportGeneration\__mocks__\mockData.js"
del /Q "dist\src\components\ReportGeneration\__tests__\__mocks__\mockFormData.js"

echo Mock cleanup complete!