# Delilah Agentic - Assessment System
Date: January 13, 2025

## Quick Start for Offline Assessment
1. Clone the repository locally
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run in electron mode:
   ```bash
   npm run electron:dev
   ```
4. Save progress using built-in JSON export (top right menu)

## Offline Assessment Tips
- Form auto-saves to localStorage every 30 seconds
- Use Ctrl+S/Cmd+S to force save
- Export to JSON at any time using the export button
- All components work offline - no internet required

## Running on Your Laptop
1. Clone repo and switch to `electron` branch
2. Install core dependencies only:
   ```bash
   npm install react react-dom @hookform/resolvers zod react-hook-form @radix-ui/react-tabs electron
   ```
3. Install minimal UI components:
   ```bash
   npm install @radix-ui/react-form @radix-ui/react-select lucide-react
   ```
4. Start the application:
   ```bash
   npm run electron:dev
   ```

## Exporting Data for LLM Processing
1. Complete the assessment
2. Click 'Export' in top menu
3. Save the JSON file
4. The exported JSON contains all form data in a structured format ready for LLM processing

## Component Structure
[Previous component documentation remains the same...]

## Dependencies
### Core (Required)
- react
- react-hook-form
- zod
- electron

### UI (Minimal Set)
- @radix-ui/react-tabs
- @radix-ui/react-form
- @radix-ui/react-select
- lucide-react

## Offline Storage
- Uses electron-store for persistent storage
- Automatic backups every 30 seconds
- Manual save option (Ctrl+S/Cmd+S)
- Export to JSON at any time

## Last Updated
January 13, 2025 - Added offline usage and export documentation