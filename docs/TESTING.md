# Testing Documentation

## Test Structure
```
src/
├── components/
│   └── ReportGeneration/
│       └── __tests__/
│           ├── GenerationProgress.test.tsx
│           ├── PromptEditor.test.tsx
│           ├── ReportPreview.test.tsx
│           ├── SectionPreview.test.tsx
│           └── e2e/
│               └── reportGeneration.e2e.test.tsx
└── lib/
    └── reports/
        └── __tests__/
            ├── cacheManager.test.ts
            ├── claudeReportGenerator.test.ts
            ├── mockData.ts
            ├── reportUtils.test.ts
            ├── retryManager.test.ts
            ├── sectionTransformer.test.ts
            ├── sectionValidator.test.ts
            └── integration/
                └── reportGeneration.integration.test.ts

```

## Running Tests
```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific tests
npm test -- ReportGeneration
npm test -- integration
npm test -- e2e

# Watch mode
npm test -- --watch
```

## Coverage Requirements
- Components: 100%
- Services: 100%
- Integration: 100%
- E2E: Key user flows

## Test Types

### Unit Tests
- Individual component behavior
- Service functionality
- Utility functions
- Error handling
- State management

### Integration Tests
- Component interactions
- Service pipelines
- Data flow
- Cache management
- Error recovery

### End-to-End Tests
- Full report generation
- User interactions
- Navigation
- State preservation
- Error scenarios

## Mock Data
Standard test data available in `src/lib/reports/__tests__/mockData.ts`

## Adding New Tests
1. Create test file matching component/service name
2. Import required dependencies and mock data
3. Structure tests using describe/it blocks
4. Include positive and negative test cases
5. Test error handling
6. Verify state changes
7. Check component interactions

## Best Practices
1. Use RTL queries appropriately
2. Test user interactions
3. Verify state changes
4. Check error handling
5. Test accessibility
6. Maintain test isolation
7. Use meaningful assertions