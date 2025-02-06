Write-Host "Adding files..."
git add .

Write-Host "`nCreating commit..."
git commit -m "feat(bodymap): Complete symptom tracking integration

- Fixed pain assessment saving functionality
- Added proper symptom tracking for all body regions
- Implemented proper color-coded pain visualization
- Added head and neck region support
- Fixed missing save buttons in assessments
- Added proper data persistence between tabs
- Enhanced symptom display and recording
- Fixed region-specific pain assessments
- Updated integration progress documentation"

Write-Host "`nDone! Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')