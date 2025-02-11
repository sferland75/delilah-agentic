# Report Generation System Documentation

## Overview
The report generation system provides automated generation of medical-legal occupational therapy reports from assessment data using a combination of templated prompts and AI-enhanced narrative generation via Claude API.

## Architecture

### Core Components
- `ReportGenerator`: Main orchestration of report generation
- `SectionTransformer`: Transforms assessment data into section content
- `ClaudeReportGenerator`: Handles AI narrative generation
- `SectionValidator`: Validates section content and relationships
- `CacheManager`: Caches generated narratives
- `SectionHistory`: Manages version history for sections

### UI Components
- `ReportPreview`: Main container for report generation UI
- `SectionPreview`: Individual section editor with versioning
- `PromptEditor`: Claude prompt customization interface
- `GenerationProgress`: Progress tracking display

### Data Flow
1. Assessment data → Section Transformer
2. Transformed sections → Validator
3. Valid sections → Claude API
4. Generated narratives → Cache
5. Cached content → UI

## Features

### Section Management
- Section-by-section preview
- Custom prompt editing
- Content versioning
- Lock/unlock capability
- Manual editing
- Version history

### Report Generation
- Progress tracking
- Error handling
- Section validation
- Relationship validation
- Cache management
- Rate limiting

### User Interface
- Section navigation
- Progress visualization
- Error display
- Content editing
- Prompt customization
- Version control

## Section Structure
1. Demographics & Header
   - Client information
   - Assessment details
   - File information

2. Purpose & Methodology
   - Assessment purpose
   - Informed consent
   - Documentation review

3. Medical History
   - Pre-accident history
   - Injury mechanism
   - Treatment team
   - Medications

4. Subjective Information
   - Physical symptoms
   - Cognitive symptoms
   - Emotional symptoms
   - Management strategies

5. Functional Assessment
   - Physical tolerances
   - Mobility status
   - Transfer abilities
   - Range of motion
   - Clinical presentation

6. Typical Day
   - Pre-accident routine
   - Current routine
   - Comparative analysis

7. Environmental Assessment
   - Property overview
   - Room analysis
   - Safety considerations

8. Activities of Daily Living
   - Self-care activities
   - Household management
   - Community integration
   - Work status
   - Social participation

9. Attendant Care
   - Level 1: Routine care
   - Level 2: Supervision
   - Level 3: Complex care
   - Care calculations

10. AMA Guides Assessment
    - ADL impairment
    - Social functioning
    - Concentration/persistence
    - Adaptation

## Usage

### Basic Report Generation
```typescript
const generator = new ReportGenerator(assessment);
const report = await generator.generateReport({
  onProgress: (progress) => {
    console.log(`${progress.section}: ${progress.progress}%`);
  }
});
```

### Custom Prompt Generation
```typescript
const generator = new ClaudeReportGenerator();
const narrative = await generator.generateNarrative(
  'demographics',
  sectionContent,
  subsections,
  customPrompt
);
```

### Section Preview
```tsx
<ReportPreview
  assessment={assessmentData}
  onComplete={(report) => {
    console.log('Report generated:', report);
  }}
  onClose={() => {
    console.log('Preview closed');
  }}
/>
```

## Testing
All components and services have comprehensive test coverage:
- Unit tests for all components
- Integration tests for report generation
- Mock data for testing
- Error scenario coverage
- Performance testing

## Error Handling
- API error retry logic
- Validation error display
- Progress error tracking
- Section regeneration
- Content recovery

## Performance
- Response caching
- Rate limiting
- Progress tracking
- Batch processing
- Version management