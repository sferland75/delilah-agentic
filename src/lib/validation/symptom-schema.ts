import { z } from "zod";

// Base schema for any symptom that can have severity
export const baseSymptomSchema = z.object({
  present: z.boolean().default(false),
  severity: z.number().min(0).max(10).optional(),
  notes: z.string().optional().default(""),
});

// Schema for general symptoms (simple boolean flags)
export const generalSymptomsSchema = z.object({
  dizziness: z.boolean().default(false),
  photophobia: z.boolean().default(false),
  phonophobia: z.boolean().default(false),
  smell_sensitivity: z.boolean().default(false),
  fatigue: z.boolean().default(false),
  headache: z.boolean().default(false),
  mood_changes: z.boolean().default(false),
  anxiety: z.boolean().default(false),
  depression: z.boolean().default(false),
  notes: z.string().optional().default(""),
});

// Pain data schema
export const painQualifiersSchema = z.object({
  Sharp: z.boolean().default(false),
  Dull: z.boolean().default(false),
  "Muscle Spasm": z.boolean().default(false),
  "With Movement": z.boolean().default(false),
  "With Breathing": z.boolean().default(false),
  Postural: z.boolean().default(false),
  Radiating: z.boolean().default(false),
});

export const painDataSchema = z.object({
  severity: z.number().min(0).max(10),
  qualifiers: painQualifiersSchema,
  comments: z.string().optional().default(""),
  timestamp: z.string(),
});

// Physical symptoms schema
export const physicalSymptomsSchema = z.object({
  pain: z.record(painDataSchema).optional(),
  notes: z.string().optional().default(""),
});

// Cognitive symptoms categories
export const cognitiveSymptomCategories = {
  attention: ["sustained_attention", "divided_attention", "distractibility", "mental_fatigue"],
  memory: ["short_term", "working_memory", "recall", "prospective"],
  processing: ["processing_speed", "reaction_time", "decision_making", "problem_solving"],
  executive: ["planning", "initiation", "sequencing", "mental_flexibility"],
  language: ["word_finding", "verbal_fluency", "comprehension", "expression"],
} as const;

// Emotional symptoms categories
export const emotionalSymptomCategories = {
  emotional_control: ["depression", "anxiety", "mood_swings", "irritability", "emotional_lability", "impulsivity", "aggression", "emotional_numbness"],
  motivation: ["apathy", "reduced_motivation", "anhedonia", "initiative"],
  social: ["social_withdrawal", "relationship_changes", "empathy", "social_anxiety"],
  regulation: ["self_monitoring", "coping", "emotional_awareness", "self_regulation"],
} as const;

// Create the cognitive symptoms schema dynamically
export const cognitiveSymptomGroupSchema = z.object(
  Object.keys(cognitiveSymptomCategories).reduce((acc, category) => ({
    ...acc,
    [`${category}_observations`]: z.string().optional().default(""),
    ...(cognitiveSymptomCategories[category as keyof typeof cognitiveSymptomCategories].reduce((inner, symptom) => ({
      ...inner,
      [symptom]: baseSymptomSchema,
    }), {})),
  }), {
    general_observations: z.string().optional().default(""),
  })
);

// Create the emotional symptoms schema dynamically
export const emotionalSymptomGroupSchema = z.object(
  Object.keys(emotionalSymptomCategories).reduce((acc, category) => ({
    ...acc,
    [`${category}_observations`]: z.string().optional().default(""),
    ...(emotionalSymptomCategories[category as keyof typeof emotionalSymptomCategories].reduce((inner, symptom) => ({
      ...inner,
      [symptom]: baseSymptomSchema,
    }), {})),
  }), {
    general_observations: z.string().optional().default(""),
    mood_observations: z.string().optional().default(""),
  })
);

// Complete symptoms schema
export const symptomsSchema = z.object({
  general: generalSymptomsSchema,
  physical: physicalSymptomsSchema,
  cognitive: cognitiveSymptomGroupSchema,
  emotional: emotionalSymptomGroupSchema,
});

export type Symptoms = z.infer<typeof symptomsSchema>;
export type BaseSymptom = z.infer<typeof baseSymptomSchema>;
export type PainData = z.infer<typeof painDataSchema>;
export type GeneralSymptoms = z.infer<typeof generalSymptomsSchema>;
export type PhysicalSymptoms = z.infer<typeof physicalSymptomsSchema>;
export type CognitiveSymptoms = z.infer<typeof cognitiveSymptomGroupSchema>;
export type EmotionalSymptoms = z.infer<typeof emotionalSymptomGroupSchema>;