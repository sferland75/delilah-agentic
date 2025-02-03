# Form Integration Task Prompt

## Overview
All report generation templates and tests are complete (45 passing tests). Your task is to integrate this into our form application. The main challenge is bridging our form state to the report generation system while maintaining type safety and error handling.

## Key Files to Review
```
src/
├── components/ReportGeneration/     # ✅ Tested and ready
│   ├── services/
│   │   └── templates/              # All report sections
│   └── utils/
│       └── formTransformer.ts      # Form data conversion
└── types/
    └── assessment.ts               # Required data structure
```

## Main Tasks

1. **Add Report Generation Button**
- Location: Bottom of assessment form
- State: Disabled until form is valid
- Loading state while generating
- Error feedback on issues

2. **Connect Form Data**
```typescript
// Example flow
const handleGenerateReport = async () => {
  const formData = getFormValues();
  const isValid = validateFormData(formData);
  
  if (!isValid) {
    // Show validation UI
    return;
  }

  const assessmentData = transformFormToAssessment(formData);
  const report = await generateReport(assessmentData);
};
```

3. **Progress UI**
- Show which sections are generating
- Display overall progress
- Allow cancellation
- Save partial progress

## Example Integration
```typescript
import { transformFormToAssessment, validateFormData } from './ReportGeneration/utils/formTransformer';
import { ReportGenerator } from './ReportGeneration/services/reportTemplateSystem';

const AssessmentForm = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Add to your existing form
  return (
    <form>
      {/* Existing form fields */}
      
      <ReportDialog
        open={isGenerating}
        progress={progress}
        onCancel={() => setIsGenerating(false)}
      />
      
      <Button
        onClick={handleGenerateReport}
        disabled={!formState.isValid || isGenerating}
      >
        Generate Report
      </Button>
    </form>
  );
};
```

## Testing Focus
- Form validation ↔ AssessmentData conversion
- Progress UI states
- Error handling
- Cancel/retry flows

## Resources
1. Test suite examples in `__tests__/` directories
2. Type definitions in assessment.ts
3. Existing transformations in formTransformer.ts

## Next Steps
1. Start with button UI + basic validation
2. Add progress dialog
3. Implement data transformation
4. Add error handling
5. Write integration tests

## Notes
- Report generation can take 30s+ for full assessment
- Save partial results
- Handle network issues gracefully
- Test with incomplete form data
- Consider mobile layout

## Questions?
Reach out to team about:
- Form state structure questions
- API credentials
- UI component library usage
- Testing setup

## Definition of Done
- [ ] Report button integrated in form
- [ ] Progress UI implemented
- [ ] Error handling complete
- [ ] Form validation working
- [ ] Integration tests passing
- [ ] Type safety maintained
- [ ] Mobile layout working
