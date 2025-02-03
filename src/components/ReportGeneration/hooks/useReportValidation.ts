import type { AssessmentForm } from '@/lib/validation/assessment-schema';

export function useReportValidation() {
  const validateForm = (formData: AssessmentForm): string[] => {
    const errors: string[] = [];

    // Add validation rules
    if (!formData.assessment?.type) {
      errors.push('Assessment type is required');
    }
    
    if (!formData.personal?.firstName || !formData.personal?.lastName) {
      errors.push('Patient name is required');
    }

    if (!formData.medical?.injury?.circumstance) {
      errors.push('Injury circumstance is required');
    }

    return errors;
  };

  return { validateForm };
}