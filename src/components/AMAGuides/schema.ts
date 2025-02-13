import { z } from 'zod';

<<<<<<< HEAD
// Direct AMA Guide quotes for each functional area
export const amaQuotes = {
  activitiesOfDailyLiving: {
    title: 'Activities of Daily Living',
    description: "Activities of Daily Living refers to: self-care, personal hygiene, communication, normal living postures, travel, non-specialized hand activities, sexual function, sleep, and social and recreational activities. More specific activities include cleaning, shopping, cooking, paying bills, maintaining a residence, caring appropriately for one's grooming and clothing, using the telephone and other communication devices, using private and public transportation, paying attention to personal hygiene, and using the toilet alone. Sexual function may be influenced by physical as well as emotional factors.",
    categories: [
      'Self-care and hygiene',
      'Communication',
      'Normal living postures',
      'Travel and transportation',
      'Non-specialized hand activities',
      'Sexual function',
      'Sleep',
      'Social and recreational activities'
    ]
  },
  socialFunctioning: {
    title: 'Social Functioning',
    description: "Social Functioning refers to: an individual's capacity to interact appropriately and communicate effectively with other individuals. It includes the ability to get along with others, such as family members, friends, neighbors, grocery clerks, landlords, or bus drivers. Impaired social functioning may be demonstrated by a history of altercations, evictions, firings, fear of strangers, avoidance of relationships, and social isolation.",
    categories: [
      'Interpersonal interactions',
      'Communication effectiveness',
      'Family relationships',
      'Community interactions',
      'Social engagement',
      'Behavioral regulation'
    ]
  },
  concentrationPersistencePace: {
    title: 'Concentration, Persistence and Pace',
    description: "Concentration, Persistence and Pace refers to: the ability to sustain focused attention long enough to permit the timely completion of tasks commonly found in work settings. Activities that may be analyzed include the ability to focus attention, maintain appropriate pace, complete tasks in a timely manner, and adapt to stressful situations in work settings.",
    categories: [
      'Attention span',
      'Task completion',
      'Work pace',
      'Time management',
      'Stress adaptation'
    ]
  },
  adaptationToWork: {
    title: 'Adaptation',
    description: "Adaptation refers to: the ability to respond appropriately to changes in the environment such as the ability to make decisions, exercise judgment, adapt to workplace changes, and maintain personal hygiene. Impaired adaptation is demonstrated by anxiety, depression, affective lability, or social withdrawal.",
    categories: [
      'Decision-making',
      'Judgment',
      'Change management',
      'Emotional regulation',
      'Personal hygiene maintenance'
    ]
  }
} as const;

// Assessment schema for functional areas
const assessmentAreaSchema = z.object({
  clinicalFindings: z.string().min(1, 'Clinical findings documentation is required'),
  functionalObservations: z.string().min(1, 'Functional observations documentation is required'),
  contextualFactors: z.string().min(1, 'Contextual factors documentation is required'),
  adaptiveStrategies: z.string().min(1, 'Adaptive strategies documentation is required'),
  recommendations: z.string().min(1, 'Recommendations are required')
=======
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
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
});

export const amaGuideSchema = z.object({
  activitiesOfDailyLiving: assessmentAreaSchema,
  socialFunctioning: assessmentAreaSchema,
  concentrationPersistencePace: assessmentAreaSchema,
  adaptationToWork: assessmentAreaSchema,
  // Overall assessment
  overallAssessment: z.object({
<<<<<<< HEAD
    rationale: z.string().min(1, 'Overall assessment rationale is required'),
    recommendations: z.string().min(1, 'Overall recommendations are required'),
    contextualFactors: z.string().min(1, 'Contextual factors documentation is required'),
    treatmentResponse: z.string().optional(),
=======
    highestClass: classSchema,
    justification: z.string().min(1, 'Overall assessment justification is required'),
    additionalFactors: z.string().optional(),
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
  }),
});

export type AMAGuideFormData = z.infer<typeof amaGuideSchema>;