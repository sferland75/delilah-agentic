# Developer Prompt for Report Generation Module

## Context
You are developing a medical-legal report generation system for occupational therapy assessments. The system combines structured assessment data with AI-enhanced narrative generation to create professional clinical reports.

## Current State
The basic architecture and Claude API integration are complete. The system can generate reports section by section, with progress tracking and error handling. Core UI components are created but not yet integrated.

## Key Files
- `src/components/ReportGeneration/services/claudeReportGenerator.ts` - Main Claude integration
- `src/components/ReportGeneration/services/reportTemplates.ts` - Report templates
- `src/components/ReportGeneration/components/ReportDialog.tsx` - Progress UI
- `src/lib/claude.ts` - Claude API client

## Sample Report Structure
```typescript
interface ReportSection {
  title: string;
  content: string;
  subsections?: ReportSection[];
}

interface Report {
  metadata: {
    clientName: string;
    dateOfAssessment: string;
    assessor: string;
  };
  sections: ReportSection[];
}
```

## Example JSON Assessment Data
```typescript
interface AssessmentData {
  demographics: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    // ...
  };
  medicalHistory: {
    preExisting: string;
    medications: Medication[];
    // ...
  };
  // ... other sections
}
```

## Sample Claude Prompt
When enhancing report sections, use prompts that:
1. Emphasize professional medical terminology
2. Maintain objective clinical tone
3. Focus on functional impacts
4. Include specific examples from assessment data

Example:
```typescript
const prompt = {
  system: `You are an experienced occupational therapist writing a medical-legal report.
Generate professional clinical content focusing on functional impacts.`,
  human: `Based on this assessment data, generate a section addressing...`
};
```

## Development Priority
1. Complete section templates
2. Implement report preview
3. Add template customization
4. Integrate with main form

## Style Guide
- Use TypeScript for type safety
- Follow React hooks pattern
- Implement error boundaries
- Add detailed comments
- Include unit tests

## Available Tools
- Claude API (integrated)
- React with TypeScript
- shadcn/ui components
- File system access

## Notes
- Report generation is asynchronous
- Each section can be generated independently
- Error recovery is built in
- Progress tracking is percentage-based

## Testing
Run tests with:
```bash
npm run test:claude     # API integration
npm run test:templates  # Template generation
npm run test:report     # Full report generation
```