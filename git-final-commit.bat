@echo off
echo Adding remaining script...
git add git-reconnect.bat

echo Adding bodymap files...
git add "src/components/BodyMap/*"
git add "src/components/forms/sections/SymptomsSection.tsx"
git add "INTEGRATION_PROGRESS.md"

echo Creating final commit...
git commit -m "feat(bodymap): finalize pain assessment functionality

- Complete symptom tracking integration
- Add proper head, hand and pain region assessments
- Fix pain data persistence
- Update integration documentation"

echo Pushing final changes...
git push origin version-2.0

echo Done! Repository is now up to date.
pause