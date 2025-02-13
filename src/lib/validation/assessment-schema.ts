<<<<<<< HEAD
import { z } from 'zod';

// Schema for treatment provider
const treatmentProviderSchema = z.object({
  providerName: z.string().optional().default(''),
  company: z.string().optional().default(''),
  profession: z.string().optional().default(''),  // Added profession field
  frequency: z.string().optional().default(''),
  focus: z.string().optional().default('')
});

// Schema for medications
const medicationSchema = z.object({
  name: z.string().optional().default(''),
  dosage: z.string().optional().default(''),
  frequency: z.string().optional().default(''),
  purpose: z.string().optional().default('')
});

// Medical section schema
const medicalSectionSchema = z.object({
  injury: z.object({
    circumstance: z.string().optional().default(''),
    date: z.string().optional().default(''),
    description: z.string().optional().default(''),
    notes: z.string().optional().default('')
  }).optional().default({}),
  symptoms: z.array(z.string()).optional().default([]),
  pain: z.record(z.any()).optional().default({}),
  treatments: z.array(treatmentProviderSchema).optional().default([]),
  medications: z.array(medicationSchema).optional().default([]),
  imaging: z.array(z.object({
    type: z.string().optional().default(''),
    date: z.string().optional().default(''),
    region: z.string().optional().default(''),
    findings: z.string().optional().default('')
  })).optional().default([])
}).optional().default({});

// Initial section schema
const initialSectionSchema = z.object({
  personal: z.object({
    firstName: z.string().optional().default(''),
    lastName: z.string().optional().default(''),
    dateOfBirth: z.string().optional().default(''),
    phone: z.string().optional().default(''),
    email: z.string().optional().default(''),
    streetAddress: z.string().optional().default(''),
    city: z.string().optional().default(''),
    postalCode: z.string().optional().default('')
  }).optional().default({})
}).optional().default({});

// Room inventory schema for environmental section
const roomSchema = z.object({
  type: z.string(),
  quantity: z.number().min(0),
  floorCovering: z.string().optional(),
  comments: z.string().optional()
}).optional();

// Environmental section schema
const environmentalSchema = z.object({
  rooms: z.array(roomSchema).optional().default([]),
  description: z.string().optional().default(''),
  hazards: z.string().optional().default(''),
  notes: z.string().optional().default(''),
  outdoor: z.object({
    access: z.string().optional().default(''),
    yard: z.string().optional().default('')
  }).optional().default({})
}).optional().default({});

// Main assessment schema
export const assessmentSchema = z.object({
  initial: initialSectionSchema,
  medical: medicalSectionSchema,
  environmental: environmentalSchema,
  functional: z.record(z.any()).optional().default({})
}).partial();

export type AssessmentFormData = z.infer<typeof assessmentSchema>;
=======
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
  })).default([]),
  legalDocumentation: z.array(z.object({
    title: z.string().optional(),
    date: z.string().optional(),
    type: z.string().optional(),
    notes: z.string().optional()
  })).default([])
});

// Medical History Schema
export const medicalHistorySchema = z.object({
  preExisting: z.string().optional(),
  surgeries: z.string().optional(),
  familyHistory: z.string().optional(),
  allergies: z.string().optional(),
  currentConditions: z.string().optional(),
  medications: z.array(z.object({
    name: z.string().optional(),
    dosage: z.string().optional(),
    frequency: z.string().optional(),
    purpose: z.string().optional()
  })).default([]),
  treatments: z.array(z.object({
    provider: z.string().optional(),
    type: z.string().optional(),
    frequency: z.string().optional(),
    notes: z.string().optional()
  })).default([]),
  injury: z.object({
    date: z.string().optional(),
    type: z.string().optional(),
    mechanism: z.string().optional(),
    immediateSymptoms: z.string().optional(),
    initialTreatment: z.string().optional(),
    subsequentCare: z.string().optional()
  }).optional()
});

// Complete Assessment Schema
export const assessmentSchema = z.object({
  demographics: demographicsSchema,
  documentation: documentationSchema,
  medicalHistory: medicalHistorySchema,
  typicalDay: z.object({
    preAccident: z.object({
      daily: z.object({
        sleepSchedule: z.object({}).optional(),
        routines: z.object({
          morning: z.object({}).optional(),
          afternoon: z.object({}).optional(),
          evening: z.object({}).optional(),
          night: z.object({}).optional()
        }).optional()
      }).optional(),
      weekly: z.object({}).optional()
    }).optional(),
    current: z.object({
      daily: z.object({
        sleepSchedule: z.object({}).optional(),
        routines: z.object({
          morning: z.object({}).optional(),
          afternoon: z.object({}).optional(),
          evening: z.object({}).optional(),
          night: z.object({}).optional()
        }).optional()
      }).optional(),
      weekly: z.object({}).optional()
    }).optional()
  }),
  functionalAssessment: z.object({
    rangeOfMotion: z.object({
      measurements: z.array(z.any()).default([]),
      generalNotes: z.string().default('')
    }).optional(),
    manualMuscleTesting: z.object({
      grades: z.record(z.any()).optional(),
      generalNotes: z.string().default('')
    }).optional(),
    bergBalance: z.object({
      items: z.record(z.object({
        score: z.number(),
        notes: z.string()
      })).optional(),
      generalNotes: z.string().optional(),
      totalScore: z.number().optional()
    }).optional(),
    posturalTolerances: z.record(z.any()).optional(),
    transfers: z.record(z.any()).optional()
  }),
  symptoms: z.object({
    physical: z.array(z.any()).default([]),
    cognitive: z.array(z.any()).default([]),
    emotional: z.array(z.any()).default([]),
    generalNotes: z.string().default('')
  }),
  environmental: z.object({
    propertyOverview: z.object({
      recommendedModifications: z.array(z.string()).default([]),
      identifiedHazards: z.array(z.string()).default([])
    }).optional(),
    rooms: z.array(z.any()).default([]),
    exterior: z.array(z.any()).default([]),
    safety: z.object({
      hazards: z.array(z.string()).default([]),
      recommendations: z.array(z.string()).default([])
    }).optional()
  })
});

export type AssessmentLevel = typeof AssessmentLevels[keyof typeof AssessmentLevels];
export type AccessibilityLevel = typeof AccessibilityLevels[keyof typeof AccessibilityLevels];
export type Assessment = z.infer<typeof assessmentSchema>;
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
