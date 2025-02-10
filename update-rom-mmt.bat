@echo off
echo Staging and committing ROM/MMT changes...

REM Stage changes
call stage-rom-mmt.bat

REM Commit changes
git commit -F commit_message.txt

REM Push changes
git push origin version-2.0

echo ROM/MMT updates completed.