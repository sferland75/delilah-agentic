@echo off
echo Adding final bodymap updates...
git add src/components/BodyMap/* src/components/forms/sections/SymptomsSection.tsx INTEGRATION_PROGRESS.md

echo Creating commit with updates...
git commit -m "feat(bodymap): finalize pain assessment integration

- Fixed saving functionality across all assessments
- Cleaned up symptom tracking implementation
- Improved head, hand and pain region assessments
- Updated integration documentation"

echo Pushing to GitHub...
git push origin version-2.0

echo Done!
pause