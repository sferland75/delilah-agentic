@echo off
echo Adding git maintenance scripts...
git add git-check-status.bat git-final-updates.bat git-setup-tracking.bat git-finalize.bat

echo Creating maintenance commit...
git commit -m "chore: add repository maintenance scripts"

echo Creating final bodymap update commit...
git add src/components/BodyMap/* src/components/forms/sections/SymptomsSection.tsx INTEGRATION_PROGRESS.md

git commit -m "feat(bodymap): finalize pain assessment functionality

- Complete symptom tracking integration
- Add proper head, hand and pain region assessments
- Fix pain data persistence
- Update integration documentation"

echo Pushing final changes...
git push origin version-2.0

echo ==========================================
echo Completed:
echo - Added repository maintenance scripts
echo - Finalized bodymap functionality
echo - Updated documentation
echo - Pushed all changes to version-2.0
echo ==========================================

echo Done!
pause