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