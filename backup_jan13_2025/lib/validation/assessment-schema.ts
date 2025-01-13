import { z } from "zod";

// Common Enums and Constants
export const AssessmentLevels = {
  No_Concerns: 'No concerns',
  Minor_Concerns: 'Minor concerns',
  Major_Concerns: 'Major concerns',
  Unsafe: 'Unsafe'
} as const;

export const AccessibilityLevels = {
  Fully_Accessible: 'Fully accessible',
  Partially_Accessible: 'Partially accessible',
  Limited_Accessibility: 'Limited accessibility',
  Not_Accessible: 'Not accessible',
  No_Barriers: 'No barriers',
  Minor_Barriers: 'Minor barriers',
  Major_Barriers: 'Major barriers'
} as const;

// Demographics Schema
export const demographicsSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  emergencyContact: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    relationship: z.string().optional()
  }),
  maritalStatus: z.string().optional(),
  numberOfChildren: z.number().optional(),
  childrenDetails: z.string().optional(),
  householdMembers: z.array(z.object({
    name: z.string().optional(),
    relationship: z.string().optional(),
    notes: z.string().optional()
  })).optional(),
  livingArrangementNotes: z.string().optional()
});

// Documentation Schema
export const documentationSchema = z.object({
  medicalDocumentation: z.array(z.object({
    title: z.string().optional(),
    date: z.string().optional(),
    type: z.string().optional(),
    notes: z.string().optional()
  })).optional(),
  legalDocumentation: z.array(z.object({
    title: z.string().optional(),
    date: z.string().optional(),
    type: z.string().optional(),
    notes: z.string().optional()
  })).optional()
});

// Medical History Schema
export const medicalHistorySchema = z.object({
  preExisting: z.string().optional(),
  currentConditions: z.string().optional(),
  medications: z.array(z.object({
    name: z.string().optional(),
    dosage: z.string().optional(),
    frequency: z.string().optional(),
    purpose: z.string().optional()
  })).optional(),
  allergies: z.array(z.string()).optional(),
  treatments: z.array(z.string()).optional(),
  surgeries: z.array(z.string()).optional(),
  injury: z.object({
    date: z.string().optional(),
    type: z.string().optional(),
    mechanism: z.string().optional(),
    immediateSymptoms: z.string().optional(),
    initialTreatment: z.string().optional(),
    subsequentCare: z.string().optional()
  }).optional()
});

// Typical Day Schema - Daily Schedule
const dailyScheduleSchema = z.object({
  sleepSchedule: z.object({
    wakeTime: z.string().optional(),
    bedTime: z.string().optional()
  }).optional(),
  routines: z.object({
    morning: z.object({
      activities: z.string().optional(),
      challenges: z.string().optional()
    }).optional(),
    afternoon: z.object({
      activities: z.string().optional(),
      challenges: z.string().optional()
    }).optional(),
    evening: z.object({
      activities: z.string().optional(),
      challenges: z.string().optional()
    }).optional(),
    night: z.object({
      activities: z.string().optional(),
      challenges: z.string().optional()
    }).optional()
  }).optional(),
  generalNotes: z.string().optional()
});

// Typical Day Schema - Weekly Schedule
const weeklyScheduleSchema = z.object({
  monday: z.string().optional(),
  mondayNotes: z.string().optional(),
  tuesday: z.string().optional(),
  tuesdayNotes: z.string().optional(),
  wednesday: z.string().optional(),
  wednesdayNotes: z.string().optional(),
  thursday: z.string().optional(),
  thursdayNotes: z.string().optional(),
  friday: z.string().optional(),
  fridayNotes: z.string().optional(),
  saturday: z.string().optional(),
  saturdayNotes: z.string().optional(),
  sunday: z.string().optional(),
  sundayNotes: z.string().optional(),
  appointments: z.array(z.object({
    type: z.string().optional(),
    frequency: z.string().optional(),
    details: z.string().optional()
  })).optional(),
  notes: z.string().optional()
});

// Complete Typical Day Schema
export const typicalDaySchema = z.object({
  preAccident: z.object({
    daily: dailyScheduleSchema.optional(),
    weekly: weeklyScheduleSchema.optional()
  }).optional(),
  current: z.object({
    daily: dailyScheduleSchema.optional(),
    weekly: weeklyScheduleSchema.optional()
  }).optional()
});

// Functional Assessment Schema
export const functionalAssessmentSchema = z.object({
  rangeOfMotion: z.object({
    assessment: z.string().optional(),
    measurements: z.record(z.any()).optional(),
    generalNotes: z.string().optional()
  }).optional(),
  manualMuscleTesting: z.object({
    assessment: z.string().optional(),
    grades: z.record(z.any()).optional()
  }).optional(),
  bergBalanceTest: z.object({
    score: z.number().optional(),
    notes: z.string().optional()
  }).optional(),
  posturalTolerances: z.record(z.any()).optional(),
  transfers: z.record(z.any()).optional()
});

// Symptoms Schema
export const symptomsSchema = z.object({
  generalNotes: z.string().optional(),
  physical: z.array(z.any()).optional(),
  cognitive: z.array(z.any()).optional(),
  emotional: z.array(z.any()).optional()
});

// Environmental Schema
export const environmentalSchema = z.object({
  propertyOverview: z.object({
    type: z.string().optional(),
    groundType: z.string().optional(),
    groundCondition: z.string().optional(),
    accessType: z.string().optional(),
    generalNotes: z.string().optional(),
    recommendedModifications: z.array(z.string()).optional(),
    identifiedHazards: z.array(z.string()).optional()
  }).optional(),
  rooms: z.array(z.any()).optional(),
  exterior: z.array(z.any()).optional(),
  safety: z.object({
    hazards: z.array(z.string()).optional(),
    features: z.string().optional(),
    concerns: z.string().optional(),
    recommendations: z.array(z.string()).optional()
  }).optional()
});

// Complete Assessment Schema
export const assessmentSchema = z.object({
  demographics: demographicsSchema,
  documentation: documentationSchema,
  medicalHistory: medicalHistorySchema,
  typicalDay: typicalDaySchema,
  functionalAssessment: functionalAssessmentSchema,
  symptoms: symptomsSchema,
  environmental: environmentalSchema
});

export type AssessmentLevel = typeof AssessmentLevels[keyof typeof AssessmentLevels];
export type AccessibilityLevel = typeof AccessibilityLevels[keyof typeof AccessibilityLevels];
export type Assessment = z.infer<typeof assessmentSchema>;