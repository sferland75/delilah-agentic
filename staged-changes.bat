@echo off
echo Staging Pain Assessment related changes...
git add src/components/BodyMap/PainAssessment.tsx
git add src/components/BodyMap/pain-qualifiers.ts

echo Staging Environmental Assessment changes...
git add src/components/EnvironmentalSection/environmental-config.ts
git add src/components/EnvironmentalSection/property-overview.tsx
git add src/components/forms/EnvironmentalAssessment.tsx

echo Staging Symptoms and Functional components...
git add src/components/SymptomsSection/index.tsx
git add src/components/SymptomsSection/CognitiveSymptoms.tsx
git add src/components/SymptomsSection/EmotionalSymptoms.tsx
git add src/components/FunctionalAssessment/index.tsx

echo Staging new Assessment Map component...
git add src/components/AssessmentMap/

echo Staging git-add.bat changes...
git add git-add.bat

echo All changes staged.
git status