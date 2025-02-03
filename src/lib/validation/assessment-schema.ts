import { z } from "zod";

// Room Schema
export const roomSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  type: z.string(),
  measurements: z.union([z.string(), z.number()]).optional(),
  accessibility: z.string(),
  safety: z.string(),
  hazards: z.array(z.string()).default([]),
  recommendations: z.array(z.string()).default([])
});

// Symptom Schema
export const symptomSchema = z.object({
  location: z.string(),
  type: z.string(),
  severity: z.string(),
  frequency: z.string(),
  aggravating: z.array(z.string()),
  relieving: z.array(z.string())
});

// Complete Assessment Schema
export const assessmentSchema = z.object({
  personal: z.object({
    firstName: z.string(),
    lastName: z.string(),
    dateOfBirth: z.string(),
    phone: z.string(),
    email: z.string().email()
  }),
  medical: z.object({
    injury: z.object({
      circumstance: z.string(),
      date: z.string(),
      description: z.string()
    }),
    symptoms: z.array(symptomSchema),
    treatments: z.array(z.string()).default([])
  }),
  functional: z.object({
    adl: z.array(z.string()).default([]),
    iadl: z.array(z.string()).default([]),
    mobility: z.array(z.string()).default([]),
    restrictions: z.array(z.string()).default([])
  }),
  environmental: z.object({
    propertyOverview: z.object({
      recommendedModifications: z.array(z.string()).default([]),
      identifiedHazards: z.array(z.string()).default([])
    }).optional(),
    rooms: z.array(roomSchema).default([]),
    exterior: z.array(z.any()).default([]),
    safety: z.object({
      hazards: z.array(z.string()).default([]),
      recommendations: z.array(z.string()).default([])
    }).optional()
  })
}).partial();

export type Assessment = z.infer<typeof assessmentSchema>;