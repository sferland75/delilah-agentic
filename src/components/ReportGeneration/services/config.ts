export const CLAUDE_CONFIG = {
  API_URL: '/api/claude',  // Will be configured in the application's API routes
  MODEL: 'claude-3-opus-20240229',
  MAX_TOKENS: 4096,
  TEMPERATURE: 0.7
};

export const SECTION_WEIGHTS = {
  'Demographics and Background': 0.05,
  'Summary of Findings': 0.10,
  'Medical History': 0.10,
  'Course of Recovery': 0.10,
  'Current Status': 0.10,
  'Functional Assessment': 0.15,
  'Environmental Assessment': 0.10,
  'Activities of Daily Living': 0.15,
  'AMA Spheres Assessment': 0.15
};