# Quick Start Guide - Report Generation Development

## Setup
1. Clone and install:
```bash
git clone [repository]
cd delilah
npm install
```

2. Run tests:
```bash
npm test src/components/ReportGeneration/**/*.test.ts
```

## Key Files to Understand

### 1. Core Architecture
- `agents/core/BaseAgent.ts` - Base class for all analyzers
- `narrative/FormatService.ts` - Output formatting system
- `types/report.ts` - Data structure definitions

### 2. Analysis Components
- `narrative/ADLAnalyzer.ts` - ADL pattern analysis
- `narrative/SymptomAnalyzer.ts` - Symptom impact analysis
- `agents/adl/BasicADLAgent.ts` - ADL processing

### 3. Test Files
- `__tests__/ADLAnalyzer.test.ts` - ADL analysis tests
- `__tests__/FormatService.test.ts` - Format tests

## Development Workflow

1. Choose a component to work on (e.g., SymptomAnalyzer)
2. Run relevant tests:
```bash
npm test src/components/ReportGeneration/narrative/__tests__/SymptomAnalyzer.test.ts
```

3. Make changes and ensure tests pass
4. Update documentation if needed

## Common Tasks

### Adding a New Analyzer
1. Create new file in `narrative/` or `agents/`
2. Implement required interfaces
3. Add test file in `__tests__/`
4. Update FormatService if needed

### Modifying Output Format
1. Update `OutputFormat.ts` configuration
2. Modify relevant formatter in `FormatService.ts`
3. Update tests
4. Verify output

### Testing
```bash
# Run all tests
npm test src/components/ReportGeneration/**/*.test.ts

# Run specific test
npm test path/to/test.ts

# Check coverage
npm test -- --coverage
```

## Tips
1. Use `test-output.txt` for sample data
2. Check `TEST_ERRORLOG.txt` for issues
3. Keep coverage above 80%
4. Update README.md with major changes