interface SummaryContext {
  name: string;
  age: number;
  gender: string;
  injury: {
    circumstance: string;
    immediateResponse: string;
    subsequentCare: string;
  };
  symptoms: {
    physical: string;
    cognitive: string;
    emotional: string;
  };
}

export const generateSummaryPrompt = (context: SummaryContext): string => {
  return `Generate a detailed SUMMARY OF FINDINGS section for an occupational therapy report that thoroughly analyzes this client's presentation:

DEMOGRAPHICS AND INJURY:
${context.name}, a ${context.age}-year-old ${context.gender}
Injury Circumstances: ${context.injury.circumstance}

MEDICAL RESPONSE:
Initial Response: ${context.injury.immediateResponse}
Subsequent Care: ${context.injury.subsequentCare}

CURRENT SYMPTOM PRESENTATION:
Physical Symptoms:
${context.symptoms.physical}

Cognitive Symptoms:
${context.symptoms.cognitive}

Emotional/Psychological Symptoms:
${context.symptoms.emotional}

Generate a comprehensive clinical analysis that:
1. Provides a detailed introduction of the client and mechanism of injury
2. Analyses the adequacy and appropriateness of initial medical response
3. Documents the progression of care and key interventions
4. Examines the interrelationship between physical, cognitive, and emotional symptoms
5. Evaluates functional impacts using the AMA Guides four spheres:
   - Activities of Daily Living
   - Social Functioning
   - Concentration, Persistence and Pace
   - Adaptation to Work or Work-like Settings
6. Identifies patterns in symptom presentation and aggravating/alleviating factors
7. Notes any discrepancies or areas requiring further investigation
8. Considers the overall impact on quality of life and relationships

Use professional medical-legal terminology while maintaining clarity. Support observations with specific examples from the assessment data.

The summary should be structured as:
1. Introduction and Injury Overview (1 paragraph)
2. Medical Response and Treatment Course (1-2 paragraphs)
3. Current Symptom Analysis (2-3 paragraphs)
4. Functional Impact Assessment (1-2 paragraphs)
5. Clinical Implications (1 paragraph)`;
};

export const generateMedicalHistoryPrompt = (medicalHistory: any): string => {
  return `Generate a detailed PRE-ACCIDENT MEDICAL HISTORY and MECHANISM OF INJURY section incorporating this clinical data:

${JSON.stringify(medicalHistory, null, 2)}

Analyze and document:

PRE-EXISTING CONDITIONS
1. Chronological history of medical conditions
2. Previous injuries or surgeries
3. Baseline functional status
4. Pre-existing limitations or accommodations
5. Ongoing treatments or interventions

MECHANISM OF INJURY
1. Detailed accident analysis
2. Biomechanical forces involved
3. Initial presentation and injuries
4. Immediate medical response
5. Treatment timeline and progression

MEDICAL COURSE
1. Hospital admission and acute care
2. Surgical interventions
3. Rehabilitation course
4. Complications or setbacks
5. Response to treatments

CURRENT MEDICAL STATUS
1. Active diagnoses
2. Medication regimen and response
3. Ongoing treatments
4. Current providers
5. Planned interventions

Format with clear headings and subheadings. Use appropriate medical terminology while maintaining clarity. Focus on aspects that impact current function or influence treatment planning.`;
};

export const generateFunctionalAssessmentPrompt = (assessment: any): string => {
  return `Create a comprehensive FUNCTIONAL ASSESSMENT section analyzing these objective findings and clinical observations:

${JSON.stringify(assessment, null, 2)}

Structure the analysis into these detailed subsections:

PHYSICAL ASSESSMENT
1. Range of Motion
   - Joint-specific measurements
   - Comparison to normal values
   - Functional implications
   - Pain responses

2. Muscle Strength
   - Manual muscle testing results
   - Patterns of weakness
   - Impact on function
   - Compensatory mechanisms

3. Balance and Mobility
   - Static and dynamic balance
   - Gait analysis
   - Fall risk assessment
   - Safety considerations

FUNCTIONAL PERFORMANCE
1. Basic ADLs
   - Self-care activities
   - Transfers
   - Mobility
   - Independence levels

2. Instrumental ADLs
   - Home management
   - Community mobility
   - Safety awareness
   - Complex task completion

3. Work/Productivity
   - Physical demands
   - Cognitive demands
   - Environmental considerations
   - Required modifications

ANALYSIS AND IMPLICATIONS
1. Identify key limitations
2. Document functional impacts
3. Note safety concerns
4. Describe compensatory strategies
5. Consider environmental factors

Use specific measurements and clinical terminology. Emphasize the relationship between impairments and functional limitations. Support conclusions with objective findings.`;
};

export const generateRecommendationsPrompt = (data: any): string => {
  return `Generate a detailed RECOMMENDATIONS section based on these comprehensive assessment findings:

${JSON.stringify(data, null, 2)}

Structure recommendations into these categories:

REHABILITATION INTERVENTIONS
1. Physical Therapy
   - Treatment frequency
   - Specific focus areas
   - Expected duration
   - Outcome measures

2. Occupational Therapy
   - ADL training
   - Work hardening
   - Cognitive strategies
   - Environmental modifications

3. Additional Therapies
   - Psychological support
   - Pain management
   - Cognitive rehabilitation
   - Other specialties

ENVIRONMENTAL MODIFICATIONS
1. Home Modifications
   - Safety improvements
   - Accessibility changes
   - Equipment needs
   - Installation timeline

2. Workplace Modifications
   - Ergonomic adjustments
   - Schedule modifications
   - Task adaptations
   - Required equipment

SUPPORT SERVICES
1. Personal Care
   - Level of assistance
   - Frequency
   - Specific tasks
   - Provider requirements

2. Home Management
   - Required services
   - Frequency
   - Specific tasks
   - Service coordination

FOLLOW-UP CARE
1. Medical Monitoring
   - Specialist appointments
   - Regular assessments
   - Progress review
   - Outcome measures

2. Care Coordination
   - Team communication
   - Progress reporting
   - Plan adjustments
   - Documentation needs

Format recommendations in clear, actionable items with specific details about implementation. Prioritize interventions based on:
1. Safety concerns
2. Functional impact
3. Client goals
4. Available resources
5. Expected outcomes

Include rationale for each recommendation and specify expected outcomes or goals.`;
};