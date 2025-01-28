@echo off
echo Adding files...
git add src/components/RangeOfMotion/rom-values.ts
git add src/components/RangeOfMotion/ROMAssessment.tsx
git add src/components/RangeOfMotion/index.tsx
git add src/components/ManualMuscle/muscle-groups.ts
git add src/components/ManualMuscle/MMTAssessment.tsx
git add src/components/ManualMuscle/index.tsx
git add src/components/FunctionalAssessment/MobilityAssessment.tsx
git add src/components/FunctionalAssessment/index.tsx
git add src/components/EnvironmentalSection/exterior-features.tsx
git add src/components/forms/EnvironmentalAssessment.tsx
git add README.md

echo.
echo Current Git Status:
git status