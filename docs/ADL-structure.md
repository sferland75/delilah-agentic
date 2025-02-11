# ADL Assessment Structure

## Data Structure
[Previous ADL structure content remains...]

## Report Generation Integration

### ADL Section Template
```typescript
const adlTemplate = {
  system: `You are an experienced occupational therapist writing a medical-legal report.
Focus on functional independence, safety considerations, and comparative analysis
of pre/post accident status for activities of daily living.`,
  human: `Based on the following ADL assessment data, generate a comprehensive analysis:

{data}

Include:
1. Self-care capabilities and limitations
2. Home management activities
3. Community integration
4. Work/productive activities
5. Social/leisure participation
6. Safety considerations
7. Equipment/modification needs`
};

// Usage in report generation
const adlSection = await generator.generateSection('adl', adlAssessmentData);
```

### Data Transformation
```typescript
interface ADLTransform {
  selfCare: {
    preAccident: string[];
    current: string[];
    impact: string;
  };
  homeManagement: {
    preAccident: string[];
    current: string[];
    impact: string;
  };
  community: {
    preAccident: string[];
    current: string[];
    impact: string;
  };
  workProductivity: {
    status: string;
    limitations: string[];
    accommodations: string[];
  };
  socialLeisure: {
    activities: string[];
    limitations: string[];
    adaptations: string[];
  };
}

// Transform assessment data for report
const transformedData = transformADLData(assessment.adl);
```

### Validation Rules
```typescript
const adlValidationSchema = z.object({
  selfCare: z.array(z.string()).min(1),
  homeManagement: z.array(z.string()).min(1),
  community: z.array(z.string()).min(1),
  workProductivity: z.object({
    status: z.string(),
    limitations: z.array(z.string())
  }),
  socialLeisure: z.object({
    activities: z.array(z.string()),
    limitations: z.array(z.string())
  })
});
```

### Report Section Structure
```typescript
interface ADLReportSection {
  title: string;
  content: string;
  subsections: {
    selfCare: string;
    homeManagement: string;
    community: string;
    workProductivity: string;
    socialLeisure: string;
  };
}
```

### Custom Prompts
ADL-specific prompt customization options:
1. Focus Areas
   - Detailed task breakdown
   - Safety considerations
   - Independence levels
   - Equipment needs

2. Analysis Points
   - Pre/post comparison
   - Functional impacts
   - Required assistance
   - Environmental factors

3. Recommendations
   - Equipment suggestions
   - Technique modifications
   - Environmental adaptations
   - Support requirements

### Integration Example
```typescript
// Generate ADL section
const adlSection = await generator.generateSection('adl', {
  title: 'Activities of Daily Living',
  data: assessment.adl,
  customPrompt: {
    system: 'Custom system prompt...',
    human: 'Custom human prompt...'
  }
});

// Preview ADL section
<SectionPreview
  sectionKey="adl"
  title="Activities of Daily Living"
  content={adlSection.content}
  originalPrompt={adlTemplate}
  onRegenerateSection={handleRegenerate}
  onLockSection={handleLock}
  onUpdateContent={handleUpdate}
/>
```