# Integration Reference: Report Generation System

## Overview
This document outlines the simplified approach to report generation using direct Claude API integration per section.

## Core Flow
```typescript
// Basic flow example
async function generateSection(sectionData: any, sectionType: string) {
  // 1. Get section prompt
  const prompt = getSectionPrompt(sectionType);
  
  // 2. Call Claude API
  const response = await callClaude(prompt, sectionData);
  
  // 3. Process response
  return formatSection(response);
}
```

## Section Types
1. Demographics
2. Medical History
3. Current Treatment
4. Functional Assessment
5. ADL Assessment
6. Environmental Assessment
7. Recommendations

## Basic Implementation

1. Section Prompts
```typescript
const SECTION_PROMPTS = {
  demographics: \`You are writing the demographics section of an OT report.
Data: \${JSON.stringify(data, null, 2)}
Generate a professional demographics section.\`,
  
  medicalHistory: \`You are writing the medical history section....\`,
  // etc.
};
```

2. API Integration
```typescript
async function callClaude(prompt: string, data: any) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
      'x-api-key': process.env.ANTHROPIC_API_KEY
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      messages: [{
        role: 'user',
        content: prompt
      }]
    })
  });
  return response.json();
}
```

3. Report Assembly
```typescript
async function generateReport(data: AssessmentData) {
  const sections = [];
  
  for (const section of SECTION_ORDER) {
    const content = await generateSection(data[section], section);
    sections.push(content);
  }
  
  return sections.join('\\n\\n');
}
```

## Testing Approach
1. Form Tests
   ```typescript
   test('captures demographics data', () => {
     // Test form data capture
   });
   ```

2. API Tests
   ```typescript
   test('calls Claude API correctly', async () => {
     // Test API integration
   });
   ```

3. Assembly Tests
   ```typescript
   test('assembles report sections', async () => {
     // Test report assembly
   });
   ```

## Key Questions
1. Is form capturing correct data?
2. Are Claude prompts effective?
3. Is report assembly clean?
4. Are errors handled properly?

## Resources
1. Claude API documentation
2. Assessment templates
3. Section examples