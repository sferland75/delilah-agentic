# Report Generation System

## Overview
The report generation system converts raw OT assessment data into formatted clinical reports. It processes activities of daily living (ADLs), symptoms, and environmental factors to produce comprehensive assessment documentation.

## Architecture
```
ReportGeneration/
├── agents/                 # Data analysis modules
│   ├── adl/               # ADL processing
│   ├── symptoms/          # Symptom analysis
│   └── core/              # Base classes
├── narrative/             # Text generation
│   ├── ADLAnalyzer       # ADL pattern analysis
│   ├── SymptomAnalyzer   # Symptom impact analysis
│   └── FormatService     # Output formatting
└── templates/            # Report templates
```

## Key Components

### 1. Data Analysis (agents/)
- ADL Analysis
  - Basic ADLs (self-care activities)
  - Instrumental ADLs (community activities)
  - Independence levels and modifications

- Symptom Analysis
  - Physical symptoms
  - Impact on function
  - Equipment needs

### 2. Output Formatting (narrative/)
Each section uses an appropriate format:
- Tables: Medications, Range of Motion
- Narratives: Symptom descriptions, ADL summaries
- Structured: Demographics, Equipment recommendations

### 3. Report Templates (templates/)
- Standard templates for different report types
- Customizable sections
- Professional formatting

## Development Status

✅ Complete:
- Base agent architecture
- ADL analysis system
- Medication formatting
- Test framework

🔄 In Progress:
- Symptom analyzer
- Output formatting
- Template integration

⏳ Planned:
- Equipment recommendations
- Environmental analysis
- Report customization

## Testing
Tests are organized by component:
```bash
# ADL Analysis
npm test src/components/ReportGeneration/narrative/__tests__/ADLAnalyzer.test.ts

# Symptom Analysis
npm test src/components/ReportGeneration/narrative/__tests__/SymptomAnalyzer.test.ts

# Format Service
npm test src/components/ReportGeneration/narrative/__tests__/FormatService.test.ts
```

## Next Steps
1. Complete SymptomAnalyzer implementation
2. Integrate FormatService with all analyzers
3. Implement report templates
4. Add customization options

See QUICKSTART.md for development setup.