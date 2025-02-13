<<<<<<< HEAD
import { useCallback, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import type { AssessmentFormData } from '@/lib/validation/assessment-schema';

export const useAssessmentProgress = () => {
  const { formState: { dirtyFields }, getValues } = useFormContext<AssessmentFormData>();

  const getRequiredFields = useCallback((section: keyof AssessmentFormData) => {
    const formData = getValues();
    switch (section) {
      case 'initial':
        return [
          formData.initial?.personal?.firstName,
          formData.initial?.personal?.lastName,
          formData.initial?.personal?.dateOfBirth
        ];
      case 'medical':
        return [
          formData.medical?.injury?.circumstance,
          formData.medical?.injury?.date,
          formData.medical?.injury?.description
        ];
      case 'functional':
        return [
          formData.functional?.overallNotes,
          Object.keys(formData.functional?.tolerances || {}).length > 0,
          Object.keys(formData.functional?.rangeOfMotion || {}).length > 0
        ];
      case 'environmental':
        return [
          formData.environmental?.propertyOverview?.layoutDescription,
          formData.environmental?.safety?.concerns,
          formData.environmental?.safety?.recommendations
        ];
      case 'adl':
        return [
          Object.keys(formData.adl?.basicADL || {}).length > 0,
          Object.keys(formData.adl?.instrumentalADL || {}).length > 0
        ];
      default:
        return [];
    }
  }, [getValues]);

  const getSectionProgress = useCallback((section: keyof AssessmentFormData) => {
    const requiredFields = getRequiredFields(section);
    const completedFields = requiredFields.filter(Boolean).length;
    return requiredFields.length ? Math.round((completedFields / requiredFields.length) * 100) : 0;
  }, [getRequiredFields]);

  const totalProgress = useMemo(() => {
    const sections: (keyof AssessmentFormData)[] = ['initial', 'medical', 'functional', 'environmental', 'adl'];
    const sectionProgress = sections.map(getSectionProgress);
    const totalProgress = sectionProgress.reduce((acc, curr) => acc + curr, 0);
    return Math.round(totalProgress / sections.length);
  }, [getSectionProgress]);

  const getDirtyFieldCount = useCallback((section: keyof AssessmentFormData) => {
    return Object.keys(dirtyFields[section] || {}).length;
  }, [dirtyFields]);

  return {
    getSectionProgress,
    totalProgress,
    getDirtyFieldCount
  };
};

export default useAssessmentProgress;
=======
import { useState, useEffect } from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { AssessmentSchema } from '@/types/assessment-schema';
import type { AssessmentForm } from '@/types/form';

const REQUIRED_SECTIONS = [
  'personalInfo',
  'medicalHistory',
  'currentStatus',
  'functionalAssessment',
  'environmentalAssessment',
  'adlAssessment',
  'careRequirements',
  'summary'
] as const;

function isSectionComplete(data: any, section: string): boolean {
  if (!data || !data[section]) return false;
  
  const sectionData = data[section];
  
  // Check if object has any filled values
  if (typeof sectionData === 'object') {
    return Object.values(sectionData).some(value => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(v => Boolean(v));
      }
      return Boolean(value);
    });
  }
  
  return false;
}

export function useAssessmentProgress(form: UseFormReturn<AssessmentForm>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const subscription = form.watch((data?: AssessmentForm) => {
      if (!data) return;

      try {
        // Validate data against schema
        AssessmentSchema.parse(data);

        // Calculate progress based on completed sections
        const completedSections = REQUIRED_SECTIONS.filter(section => 
          isSectionComplete(data, section)
        ).length;

        setProgress(Math.round((completedSections / REQUIRED_SECTIONS.length) * 100));
      } catch (error) {
        console.error('Form validation error:', error);
        // Set progress to 0 if validation fails
        setProgress(0);
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  return progress;
}
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
