import { z } from 'zod';

// AMA Guides 4th Edition Class Ratings
export const impairmentClass = {
  CLASS_1: 'class1',  // No Impairment (0%)
  CLASS_2: 'class2',  // Mild Impairment (1-14%)
  CLASS_3: 'class3',  // Moderate Impairment (15-29%)
  CLASS_4: 'class4',  // Marked Impairment (30-49%)
  CLASS_5: 'class5',  // Extreme Impairment (50-70%)
} as const;

export const classLabels = {
  [impairmentClass.CLASS_1]: 'Class 1: No Impairment (0%)',
  [impairmentClass.CLASS_2]: 'Class 2: Mild Impairment (1-14%)',
  [impairmentClass.CLASS_3]: 'Class 3: Moderate Impairment (15-29%)',
  [impairmentClass.CLASS_4]: 'Class 4: Marked Impairment (30-49%)',
  [impairmentClass.CLASS_5]: 'Class 5: Extreme Impairment (50-70%)',
} as const;

export const classSchema = z.enum([
  impairmentClass.CLASS_1,
  impairmentClass.CLASS_2,
  impairmentClass.CLASS_3,
  impairmentClass.CLASS_4,
  impairmentClass.CLASS_5,
]);

// Each area requires:
// 1. Class rating
// 2. Clinical findings
// 3. Functional limitations
// 4. Treatment/prognosis
const assessmentAreaSchema = z.object({
  classRating: classSchema,
  clinicalFindings: z.string().min(1, 'Clinical findings documentation is required'),
  functionalLimitations: z.string().min(1, 'Functional limitations documentation is required'),
  treatmentAndPrognosis: z.string().min(1, 'Treatment and prognosis documentation is required'),
});

export const amaGuideSchema = z.object({
  activitiesOfDailyLiving: assessmentAreaSchema,
  socialFunctioning: assessmentAreaSchema,
  concentrationPersistencePace: assessmentAreaSchema,
  adaptationToWork: assessmentAreaSchema,
  // Overall assessment
  overallAssessment: z.object({
    highestClass: classSchema,
    justification: z.string().min(1, 'Overall assessment justification is required'),
    additionalFactors: z.string().optional(),
  }),
});

export type AMAGuideFormData = z.infer<typeof amaGuideSchema>;