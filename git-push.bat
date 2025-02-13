@echo off
echo Adding changes to git...
git add .

echo Creating commit...
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
git commit -m "feat: Add collapsible cognitive symptoms section with severity ratings and observations"
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801

echo Pushing to GitHub...
git push origin main

echo Done!
pause