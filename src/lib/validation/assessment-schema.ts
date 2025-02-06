import { z } from 'zod';

// AMA Schema
const amaImpairmentSchema = z.object({
  category: z.string().min(1, "Category is required"),
  diagnosisCode: z.string().min(1, "Diagnosis code is required"),
  diagnosisDescription: z.string().min(1, "Diagnosis description is required"),
  bodyPart: z.string().min(1, "Body part is required"),
  impairmentRating: z.string().min(1, "Impairment rating is required"),
  rationale: z.string().min(1, "Rationale is required"),
  guideReference: z.string().min(1, "Guide reference is required"),
  notes: z.string().optional()
});

const amaGuidesSchema = z.object({
  edition: z.string().min(1, "AMA Guides edition is required"),
  assessmentDate: z.string().min(1, "Assessment date is required"),
  diagnosisCategories: z.array(amaImpairmentSchema),
  totalImpairment: z.string().min(1, "Total impairment rating is required"),
  methodology: z.string().min(1, "Combined values methodology is required"),
  recommendations: z.array(z.string()),
  additionalNotes: z.string().optional()
});

// Attendant Care Schema
const careTaskSchema = z.object({
  taskName: z.string().min(1, "Task name is required"),
  frequency: z.string().min(1, "Frequency is required"),
  timeRequired: z.string().min(1, "Time required is required"),
  assistanceLevel: z.string().min(1, "Assistance level is required"),
  equipmentNeeded: z.array(z.string()),
  specialConsiderations: z.string().optional(),
  trainingRequired: z.boolean(),
  trainingDescription: z.string().optional()
});

const careScheduleSchema = z.object({
  timeOfDay: z.string().min(1, "Time of day is required"),
  tasks: z.array(z.string()),
  duration: z.string().min(1, "Duration is required"),
  caregiverType: z.string().min(1, "Caregiver type is required")
});

const attendantCareSchema = z.object({
  overview: z.object({
    totalHoursPerDay: z.string().min(1, "Total hours per day is required"),
    caregiverTypes: z.array(z.string()),
    supervisedCare: z.boolean(),
    specializedTraining: z.boolean(),
    scheduleFlexibility: z.string().min(1, "Schedule flexibility is required")
  }),
  tasks: z.array(careTaskSchema),
  schedule: z.array(careScheduleSchema),
  equipment: z.array(z.string()),
  training: z.object({
    required: z.boolean(),
    topics: z.array(z.string()),
    duration: z.string().optional(),
    provider: z.string().optional(),
    specialConsiderations: z.string().optional()
  }),
  recommendations: z.array(z.string()),
  notes: z.string().optional()
});

// Basic schemas (existing)
const personSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  phone: z.string().optional(),
  email: z.string().email().optional(),
});

const injurySchema = z.object({
  circumstance: z.string().min(1, "Circumstance is required"),
  date: z.string().min(1, "Date is required"),
  description: z.string().min(1, "Description is required"),
  notes: z.string().optional(),
});

const symptomSchema = z.object({
  location: z.string().min(1, "Location is required"),
  type: z.string().min(1, "Type is required"),
  severity: z.string().min(1, "Severity is required"),
  frequency: z.string().min(1, "Frequency is required"),
  aggravating: z.array(z.string()),
  relieving: z.array(z.string()),
  description: z.string().min(1, "Description is required"),
  additional: z.string().optional(),
});

const toleranceSchema = z.object({
  painLevel: z.number().min(0).max(10),
  limitations: z.string().min(1, "Limitations description is required"),
  adaptations: z.string().min(1, "Adaptations description is required"),
});

const assessmentItemSchema = z.object({
  score: z.string(),
  notes: z.string().optional(),
  type: z.string(),
  label: z.string(),
});

// Section schemas (existing)
const initialSectionSchema = z.object({
  personal: personSchema,
});

const medicalSectionSchema = z.object({
  injury: injurySchema,
  symptoms: z.array(symptomSchema),
  treatments: z.array(z.string()),
  medications: z.array(z.object({
    name: z.string().min(1, "Medication name is required"),
    dosage: z.string().min(1, "Dosage is required"),
    frequency: z.string().min(1, "Frequency is required"),
    purpose: z.string().min(1, "Purpose is required"),
  })),
  imaging: z.array(z.object({
    type: z.string().min(1, "Type is required"),
    date: z.string().min(1, "Date is required"),
    region: z.string().min(1, "Region is required"),
    findings: z.string().min(1, "Findings are required"),
  })),
});

const functionalSectionSchema = z.object({
  tolerances: z.record(toleranceSchema),
  rangeOfMotion: z.record(assessmentItemSchema),
  manualMuscleTesting: z.record(assessmentItemSchema.extend({
    pain: z.boolean(),
  })),
  overallNotes: z.string().min(1, "Overall notes are required"),
  recommendations: z.array(z.string()),
  followUpNeeded: z.boolean(),
  followUpNotes: z.string().optional(),
});

const environmentalSectionSchema = z.object({
  propertyOverview: z.object({
    propertyType: z.string().min(1, "Property type is required"),
    layoutDescription: z.string().min(1, "Layout description is required"),
    access: z.object({
      exterior: z.object({
        description: z.string().min(1, "Exterior access description is required"),
      }),
      interior: z.object({
        description: z.string().min(1, "Interior access description is required"),
        hasStairs: z.boolean(),
        numberOfStairs: z.number(),
      }),
    }),
    recommendedModifications: z.array(z.string()),
    identifiedHazards: z.array(z.string()),
  }),
  safety: z.object({
    hazards: z.array(z.string()),
    concerns: z.string().min(1, "Safety concerns are required"),
    recommendations: z.string().min(1, "Safety recommendations are required"),
  }),
});

// Main assessment schema
export const assessmentSchema = z.object({
  initial: initialSectionSchema,
  medical: medicalSectionSchema,
  functional: functionalSectionSchema,
  environmental: environmentalSectionSchema,
  ama: amaGuidesSchema,
  attendantCare: attendantCareSchema
});

// Export types
export type AssessmentFormData = z.infer<typeof assessmentSchema>;
export type AMAGuidesData = z.infer<typeof amaGuidesSchema>;
export type AttendantCareData = z.infer<typeof attendantCareSchema>;
