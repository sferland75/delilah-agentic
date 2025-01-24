# Remove existing fresh-delilah directory if it exists
if (Test-Path "fresh-delilah") {
    Remove-Item -Recurse -Force "fresh-delilah"
}

# Create fresh directory
New-Item -ItemType Directory -Path "fresh-delilah"
Set-Location "fresh-delilah"

# Initialize git
git init

# Create necessary directories
mkdir -p src/components,src/context,src/contexts,src/hooks,src/lib,src/services,src/types,src/utils,public

# Copy all files with directory structure
Copy-Item -Recurse "..\delilah-agentic\src\*" "src\"
Copy-Item -Recurse "..\delilah-agentic\public\*" "public\"
Copy-Item "..\delilah-agentic\package.json" "."
Copy-Item "..\delilah-agentic\tsconfig.json" "."
Copy-Item "..\delilah-agentic\tsconfig.node.json" "."
Copy-Item "..\delilah-agentic\vite.config.ts" "."
Copy-Item "..\delilah-agentic\.gitignore" "."
Copy-Item "..\delilah-agentic\package-lock.json" "." -ErrorAction SilentlyContinue
Copy-Item "..\delilah-agentic\README.md" "."
Copy-Item "..\delilah-agentic\postcss.config.js" "."
Copy-Item "..\delilah-agentic\tailwind.config.js" "."

# Git setup
git add .
git commit -m "Initial commit: Complete application structure
- Full assessment system with all components
- UI framework and components
- State management
- Data persistence layer
- Form validation
- Build configuration"

git branch -M main
git remote add origin https://github.com/sferland75/delilah-agentic.git
git push -f origin main

Write-Host "`nProject copied and pushed to GitHub. Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')