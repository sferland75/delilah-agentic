import { z } from 'zod';

export const functionalCapacitySchema = z.object({
  activity: z.string().min(1, 'Activity is required'),
  difficulty: z.number().min(0).max(10),
  limitations: z.string().optional(),
  adaptations: z.string().optional(),
});

export const functionalAssessmentSchema = z.object({
  capacities: z.array(functionalCapacitySchema),
  overallNotes: z.string().optional(),
  recommendedAccommodations: z.array(z.string()),
  followUpNeeded: z.boolean(),
  followUpNotes: z.string().optional().or(z.literal('')),
  
  // Existing fields validation
  rangeOfMotion: z.object({
    measurements: z.array(z.object({
      joint: z.string(),
      movement: z.string(),
      normalROM: z.string(),
      left: z.object({
        active: z.string().optional(),
        passive: z.string().optional(),
      }).optional(),
      right: z.object({
        active: z.string().optional(),
        passive: z.string().optional(),
      }).optional(),
      painLeft: z.boolean().optional(),
      painRight: z.boolean().optional(),
      notes: z.string().optional(),
    })),
    generalNotes: z.string().optional(),
  }),
  
  manualMuscleTesting: z.object({
    grades: z.record(z.string()),
    generalNotes: z.string().optional(),
  }),
  
  bergBalance: z.object({
    items: z.record(z.object({
      score: z.number(),
      notes: z.string().optional(),
    })),
    generalNotes: z.string().optional(),
    totalScore: z.number(),
  }),
  
  posturalTolerances: z.object({
    standing: z.string().optional(),
    walking: z.string().optional(),
  }).optional(),
  
  transfers: z.record(z.object({
    independence: z.string().optional(),
    notes: z.string().optional(),
  })).optional(),
});