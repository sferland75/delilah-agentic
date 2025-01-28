Write-Host "Adding files..."
git add .

Write-Host "`nCreating commit..."
git commit -m "Update assessment forms and fix bugs

- Simplified ROM assessment with percentages and defaults
- Streamlined MMT for core muscle groups
- Enhanced mobility & transfers section
- Fixed exterior features component
- Updated environmental assessment
- Improved UI with collapsible sections
- Updated README"

Write-Host "`nDone! Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')