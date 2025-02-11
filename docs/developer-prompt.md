# Developer Documentation: Report Generation System

## Overview
The report generation system combines structured assessment data with Claude AI to create professional medical-legal occupational therapy reports. The system features section-by-section generation, custom prompts, version control, and real-time preview.

## Architecture

### Core Components
```typescript
// Report Generator
const generator = new ReportGenerator(assessment);
const report = await generator.generateReport({
  onProgress: (progress) => updateUI(progress),
  onValidationError: (errors) => handleErrors(errors)
});

// Section Generation
const narrative = await claudeGenerator.generateNarrative(
  'demographics',
  sectionContent,
  subsections
);

// Preview Component
<ReportPreview
  assessment={assessment}
  onComplete={handleComplete}
  onClose={handleClose}
/>
```

### Data Flow
1. Assessment → Transformer → Sections
2. Sections → Validator → Claude API
3. Claude API → Cache → UI
4. UI → History → Version Control

## Component Integration

### Report Preview
```tsx
import { ReportPreview } from '@/components/ReportGeneration';

function AssessmentForm() {
  const handleReportGeneration = async () => {
    setShowPreview(true);
  };

  return (
    <>
      <Button onClick={handleReportGeneration}>
        Generate Report
      </Button>

      {showPreview && (
        <ReportPreview
          assessment={assessmentData}
          onComplete={handleComplete}
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  );
}
```

### Section Customization
```tsx
import { SectionPreview } from '@/components/ReportGeneration';

function ReportSection({ section, onUpdate }) {
  return (
    <SectionPreview
      sectionKey={section.key}
      title={section.title}
      content={section.content}
      originalPrompt={section.prompt}
      onRegenerateSection={handleRegenerate}
      onLockSection={handleLock}
      onUpdateContent={onUpdate}
    />
  );
}
```

### Progress Tracking
```tsx
import { GenerationProgressUI } from '@/components/ReportGeneration';

function ProgressDisplay({ sections, current }) {
  return (
    <GenerationProgressUI
      sections={sections}
      currentSection={current}
      error={error}
    />
  );
}
```

## Claude Integration

### Prompt Structure
```typescript
interface PromptTemplate {
  system: string;  // System context
  human: string;   // Human prompt
}

const promptTemplates = {
  demographics: {
    system: `You are an experienced occupational therapist...`,
    human: `Based on the following data, generate...`
  },
  // ... other sections
};
```

### Custom Prompts
```typescript
// Customize prompt
const customPrompt = {
  system: 'Modified system prompt...',
  human: 'Modified human prompt...'
};

// Generate with custom prompt
const content = await generator.regenerateSection(
  'demographics',
  customPrompt
);
```

### Error Handling
```typescript
try {
  const response = await claudeClient.chat({
    messages: [{ role: 'user', content: prompt.human }],
    model: CLAUDE_CONFIG.MODEL,
    temperature: CLAUDE_CONFIG.TEMPERATURE,
    system: prompt.system
  });

  if (response.error) {
    throw new Error(response.error);
  }

  return { content: response.content };
} catch (error) {
  console.error('Claude API error:', error);
  throw error;
}
```

## Testing

### Component Tests
```typescript
describe('ReportPreview', () => {
  it('generates report correctly', async () => {
    render(<ReportPreview assessment={mockAssessment} />);
    
    await waitFor(() => {
      expect(screen.getByText('Report Complete')).toBeInTheDocument();
    });
  });
});
```

### API Tests
```typescript
describe('ClaudeReportGenerator', () => {
  it('generates narrative using Claude API', async () => {
    const result = await generator.generateNarrative(
      'demographics',
      'Test content',
      { personal: 'Client info' }
    );

    expect(result).toBe('Generated content');
  });
});
```

### Mock Data
```typescript
const mockAssessment = {
  demographics: {
    firstName: 'John',
    lastName: 'Doe'
  },
  // ... other sections
};
```

## Performance

### Caching
```typescript
// Check cache
const cachedResult = cache.get(cacheKey);
if (cachedResult) {
  return cachedResult;
}

// Generate and cache
const result = await generateContent();
cache.set(cacheKey, result);
```

### Rate Limiting
```typescript
const rateLimiter = new RateLimiter({
  maxRequests: 10,
  perSecond: 1
});

await rateLimiter.wait();
const result = await makeRequest();
```

## Development Workflow
1. Run tests: `npm test`
2. Check coverage: `npm test -- --coverage`
3. Start dev server: `npm run dev`
4. Build: `npm run build`

## Best Practices
1. Always validate data before sending to Claude
2. Use type-safe interfaces
3. Handle all async states
4. Implement proper error boundaries
5. Add comprehensive tests
6. Document any prompt changes
7. Monitor API rate limits