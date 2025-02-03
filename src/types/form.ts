import { z } from 'zod';
import { assessmentSchema } from '@/lib/validation/assessment-schema';

export type AssessmentForm = z.infer<typeof assessmentSchema>;
export { assessmentSchema as AssessmentSchema };

// Re-export other types from validation
export * from '@/lib/validation/assessment-schema';