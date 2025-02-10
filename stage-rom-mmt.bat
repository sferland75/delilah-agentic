@echo off
echo Staging ROM/MMT component changes...
git add src/components/RomMmtMap/utils.ts
git add src/components/RomMmtMap/index.tsx
git add src/components/RomMmtMap/ROMAssessment.tsx
git add src/components/RomMmtMap/MMTAssessment.tsx
git add src/components/BodyMap/joints.ts
git add IMMEDIATE-ACTIONS.md
git add commit_message.txt
git add stage-rom-mmt.bat
git add update-rom-mmt.bat

echo All ROM/MMT changes staged.
git status