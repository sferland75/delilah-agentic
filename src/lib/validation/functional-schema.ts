import { z } from 'zod';

// Define capability levels
export const CapabilityLevel = {
  INDEPENDENT: 'independent',
  INDEPENDENT_WITH_DEVICE: 'independent_with_device',
  PARTIAL_ASSISTANCE: 'partial_assistance',
  UNABLE: 'unable'
} as const;

// Define stair climbing patterns
export const StairPattern = {
  RECIPROCAL: 'reciprocal',
  RECIPROCAL_RAIL: 'reciprocal_with_rail',
  STEP_STEP: 'step_step',
  STEP_STEP_RAIL: 'step_step_with_rail',
  STEP_STEP_ASSIST: 'step_step_with_assistance',
  UNABLE: 'unable'
} as const;

// Time-based activity schema
export const timeBasedActivitySchema = z.object({
  timeLimit: z.string().optional(),
  timeUnit: z.enum(['seconds', 'minutes', 'hours']).optional(),
  limitations: z.string().optional(),
  modifications: z.string().optional(),
  notes: z.string().optional()
});

// Posture-based activity schema
export const postureActivitySchema = z.object({
  capability: z.enum([
    CapabilityLevel.INDEPENDENT,
    CapabilityLevel.INDEPENDENT_WITH_DEVICE,
    CapabilityLevel.PARTIAL_ASSISTANCE,
    CapabilityLevel.UNABLE
  ]),
  device: z.string().optional(),
  assistanceType: z.string().optional(),
  limitations: z.string().optional(),
  notes: z.string().optional()
});

// Stair assessment schema
export const stairAssessmentSchema = z.object({
  pattern: z.enum([
    StairPattern.RECIPROCAL,
    StairPattern.RECIPROCAL_RAIL,
    StairPattern.STEP_STEP,
    StairPattern.STEP_STEP_RAIL,
    StairPattern.STEP_STEP_ASSIST,
    StairPattern.UNABLE
  ]),
  limitations: z.string().optional(),
  notes: z.string().optional(),
  flightsCompleted: z.number().optional(),
  assistiveDevice: z.string().optional()
});

// Define activity types mapping
export const ActivityTypes = {
  TIME_BASED: [
    'walking',
    'standing',
    'sitting'
  ],
  POSTURE_BASED: [
    'kneeling',
    'crouching',
    'lying',
    'reaching_overhead',
    'reaching_floor'
  ]
} as const;

export const functionalSchema = z.object({
  timeBasedActivities: z.record(timeBasedActivitySchema),
  postureActivities: z.record(postureActivitySchema),
  stairAssessment: stairAssessmentSchema,
  notes: z.string().optional()
});

export type FunctionalAssessment = z.infer<typeof functionalSchema>;