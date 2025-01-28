@echo off
echo Forcing Git to recognize changes...

git update-index --no-skip-worktree src/components/forms/EnvironmentalAssessment.tsx
git update-index --no-assume-unchanged src/components/forms/EnvironmentalAssessment.tsx
git add -f src/components/forms/EnvironmentalAssessment.tsx
git update-index --no-skip-worktree src/components/EnvironmentalSection/environmental-values.ts
git add -f src/components/EnvironmentalSection/environmental-values.ts

echo.
echo Git Status:
git status