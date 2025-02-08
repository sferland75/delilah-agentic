import { z } from 'zod';

// Housekeeping section schemas
const cleaningTaskSchema = z.object({
  preAccident: z.string().optional().default(''),
  postAccident: z.string().optional().default(''),
  frequency: z.string().optional().default(''),
  timeRequired: z.string().optional().default(''),
  clinicalJustification: z.string().optional().default('')
});

const maintenanceTaskSchema = z.object({
  preAccident: z.string().optional().default(''),
  postAccident: z.string().optional().default(''),
  frequency: z.string().optional().default(''),
  timeRequired: z.string().optional().default(''),
  costEstimate: z.string().optional().default(''),
  clinicalJustification: z.string().optional().default('')
});

const replacementTaskSchema = z.object({
  preAccidentStatus: z.string().optional().default(''),
  hoursPerWeek: z.string().optional().default(''),
  annualCost: z.string().optional().default('')
});

const housekeepingSchema = z.object({
  cleaning: z.record(cleaningTaskSchema).optional().default({}),
  maintenance: z.record(maintenanceTaskSchema).optional().default({}),
  replacementHours: z.record(replacementTaskSchema).optional().default({}),
  notes: z.string().optional().default('')
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
  treatments: z.array(z.string()).optional().default([]),
  medications: z.array(z.object({
    name: z.string().optional().default(''),
    dosage: z.string().optional().default(''),
    frequency: z.string().optional().default(''),
    purpose: z.string().optional().default('')
  })).optional().default([]),
  imaging: z.array(z.object({
    type: z.string().optional().default(''),
    date: z.string().optional().default(''),
    region: z.string().optional().default(''),
    findings: z.string().optional().default('')
  })).optional().default([])
}).optional().default({});

// ADL section schema
const adlSectionSchema = z.object({
  activities: z.record(z.any()).optional().default({}),
  notes: z.string().optional().default('')
}).optional().default({});

// AMA section schema
const amaSectionSchema = z.object({
  edition: z.string().optional().default(''),
  assessmentDate: z.string().optional().default(''),
  diagnosisCategories: z.array(z.string()).optional().default([]),
  totalImpairment: z.string().optional().default(''),
  methodology: z.string().optional().default(''),
  recommendations: z.array(z.string()).optional().default([]),
  additionalNotes: z.string().optional().default('')
}).optional().default({});

// Care section schema
const careSectionSchema = z.object({
  overview: z.object({
    totalHoursPerDay: z.string().optional().default(''),
    caregiverTypes: z.array(z.string()).optional().default([]),
    supervisedCare: z.boolean().optional().default(false),
    specializedTraining: z.boolean().optional().default(false),
    scheduleFlexibility: z.string().optional().default('')
  }).optional().default({}),
  tasks: z.array(z.string()).optional().default([]),
  schedule: z.array(z.string()).optional().default([]),
  equipment: z.array(z.string()).optional().default([]),
  training: z.object({
    required: z.boolean().optional().default(false),
    topics: z.array(z.string()).optional().default([]),
    duration: z.string().optional().default(''),
    provider: z.string().optional().default(''),
    specialConsiderations: z.string().optional().default('')
  }).optional().default({}),
  recommendations: z.array(z.string()).optional().default([]),
  notes: z.string().optional().default('')
}).optional().default({});

// Main assessment schema
export const assessmentSchema = z.object({
  initial: initialSectionSchema,
  medical: medicalSectionSchema,
  environmental: environmentalSchema,
  housekeeping: housekeepingSchema,
  functional: z.record(z.any()).optional().default({}),
  adl: adlSectionSchema,
  ama: amaSectionSchema,
  attendantCare: careSectionSchema
}).partial();

export type AssessmentFormData = z.infer<typeof assessmentSchema>;