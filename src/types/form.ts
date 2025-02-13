<<<<<<< HEAD
import { z } from 'zod';
import { assessmentSchema } from '@/lib/validation/assessment-schema';

export type AssessmentForm = z.infer<typeof assessmentSchema>;
export { assessmentSchema as AssessmentSchema };

// Re-export other types from validation
export * from '@/lib/validation/assessment-schema';
=======
// Redirect to lib/validation
export * from '@/lib/validation/assessment-schema';
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
