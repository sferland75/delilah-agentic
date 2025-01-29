@echo off
echo Adding all changed files...
git add .

echo Creating commit...
git commit -m "feat: Major assessment improvements and bug fixes

Key Changes:
- Fixed MMT & ROM assessments with correct color mapping
- Implemented form reset functionality for new assessments
- Enhanced pain assessment integration
- Improved data synchronization between components
- Updated documentation with recent changes
- Fixed dialog error handling and exports
- Enhanced UI feedback and validation
- Synchronized component state management
- Added extensive debug logging
- Fixed component exports and imports"

echo Pushing to version-2.0...
git push origin version-2.0