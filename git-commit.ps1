Write-Host "Adding files..."
git add .

Write-Host "`nCreating commit..."
<<<<<<< HEAD
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
=======
git commit -m "Update assessment forms and fix bugs

- Simplified ROM assessment with percentages and defaults
- Streamlined MMT for core muscle groups
- Enhanced mobility & transfers section
- Fixed exterior features component
- Updated environmental assessment
- Improved UI with collapsible sections
- Updated README"
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801

Write-Host "`nDone! Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')