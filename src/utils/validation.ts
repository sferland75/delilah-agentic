// Basic schema structure for validation
const requiredSections = [
  'demographics',
  'documentation',
  'medicalHistory',
  'typicalDay',
  'functionalAssessment',
  'symptoms',
  'environmental',
  'adl',
  'care',
  'amaGuides'
];

export const validateAssessmentData = (data: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Check if it's an object
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { valid: false, errors: ['Invalid data format: Expected an object'] };
  }

  // If data has metadata/assessment structure, use the assessment part
  const assessmentData = data.metadata && data.assessment ? data.assessment : data;

  // Log the structure being validated
  console.log('Validating structure:', Object.keys(assessmentData));

  // Check for required sections
  for (const section of requiredSections) {
    if (!assessmentData[section]) {
      errors.push(`Missing required section: ${section}`);
    }
  }

  // Check for obvious data corruption
  for (const [key, value] of Object.entries(assessmentData)) {
    if (value === null || value === undefined) {
      errors.push(`Invalid value in section: ${key}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
};