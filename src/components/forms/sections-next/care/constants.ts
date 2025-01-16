export const CARE_RATES = {
  LEVEL_1: 14.90, // Routine personal care
  LEVEL_2: 14.00, // Basic supervision
  LEVEL_3: 21.11, // Complex care
} as const;

export const WEEKLY_TO_MONTHLY = 4.3; // Conversion factor for weekly to monthly hours

export const DEFAULT_ACTIVITY = {
  minutes: 0,
  timesPerWeek: 0,
  totalMinutes: 0,
};

// Form 1 section descriptions
export const LEVEL_DESCRIPTIONS = {
  LEVEL_1: "Level 1 attendant care is for routine personal care. Please assess the care requirements of the applicant for each activity listed. Estimate the time it takes to perform each activity, and the number of times each week it should be performed.",
  LEVEL_2: "Level 2 Attendant Care is for basic supervisory functions. Please assess the care requirements of the applicant for each activity listed. Estimate the time it takes to perform each activity, and the number of times each week it should be performed.",
  LEVEL_3: "Level 3 attendant care is for complex health/care and hygiene functions. Please assess the care requirements of the applicant for each activity listed. Estimate the time it takes to perform each activity, and the number of times each week it should be performed.",
} as const;