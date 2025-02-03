# Report Generation Module Documentation

## Overview
The report generation module provides automated generation of medical-legal reports from assessment data using a combination of templated content and AI-enhanced narrative generation via Claude API.

## Current Status
- ✅ Basic architecture implemented
- ✅ Claude API integration confirmed
- ✅ Core components created
- ✅ Basic test coverage
- 🚧 Template implementation in progress
- 🚧 Full report generation pending
- 📋 UI integration pending

## Directory Structure
```
src/components/ReportGeneration/
├── components/
│   ├── ReportButton.tsx      # Trigger button for report generation
│   └── ReportDialog.tsx      # Progress dialog component
├── services/
│   ├── claudeReportGenerator.ts  # Claude API integration
│   ├── reportTemplates.ts    # Base report templates
│   └── config.ts            # Configuration settings
├── hooks/
│   ├── useReportDialog.ts   # Dialog state management
│   └── useReportGeneration.ts # Report generation logic
└── utils/
    ├── formatters.ts        # Data formatting utilities
    ├── transformations.ts   # Data transformation logic
    ├── fileSaver.ts        # File handling utilities
    └── test-claude.ts      # API integration tests
```

## Key Features
1. **Report Sections**
   - Demographics and Background
   - Medical History
   - Physical Assessment
   - Functional Assessment
   - Environmental Factors
   - Recommendations
   - AMA Guides Assessment

2. **Data Processing**
   - JSON data extraction
   - Clinical data formatting
   - Professional narrative generation

3. **File Handling**
   - DOCX format output
   - Draft and final versions
   - Automatic file naming

4. **UI Components**
   - Progress tracking
   - Error handling
   - Status updates

## Environment Setup
Required environment variables:
```env
ANTHROPIC_API_KEY=your-api-key-here
```

## Testing
Run integration test:
```bash
npm run test:claude
```

## Next Steps
1. **Template Development**
   - Complete section templates
   - Add narrative enhancement prompts
   - Implement section linking

2. **UI Integration**
   - Add ReportButton to form header
   - Implement progress dialog
   - Add preview functionality

3. **Report Features**
   - Add draft saving
   - Implement section editing
   - Add template customization

4. **Testing**
   - Add unit tests
   - Implement section tests
   - Add report validation