# PowerShell script to capture and push changes

# Store current date for commit message
$date = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

# Ensure we're in the correct directory
Set-Location "D:\delilah"

# Check current status
Write-Host "Checking current git status..." -ForegroundColor Yellow
git status

# Add all changes
Write-Host "`nAdding all changes..." -ForegroundColor Yellow
git add .

# Commit changes with date
Write-Host "`nCommitting changes..." -ForegroundColor Yellow
git commit -m "Integration update - $date - Report generation system planning"

# Pull any remote changes first
Write-Host "`nPulling latest changes from remote..." -ForegroundColor Yellow
git pull origin main

# Push changes
Write-Host "`nPushing changes to remote..." -ForegroundColor Yellow
git push origin main

Write-Host "`nProcess complete!" -ForegroundColor Green