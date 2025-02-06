import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import type { AssessmentFormData } from '@/lib/validation/assessment-schema';

export const useAssessmentForm = () => {
  const { 
    watch, 
    setValue, 
    formState: { errors, isDirty, dirtyFields }
  } = useFormContext<AssessmentFormData>();

  const formData = watch();

  const updateSection = useCallback(<T extends keyof AssessmentFormData>(
    section: T,
    data: Partial<AssessmentFormData[T]>
  ) => {
    setValue(section, {
      ...formData[section],
      ...data
    }, {
      shouldValidate: true,
      shouldDirty: true
    });
  }, [formData, setValue]);

  const getSectionErrors = useCallback((section: keyof AssessmentFormData) => {
    return errors[section];
  }, [errors]);

  const getSectionProgress = useCallback((section: keyof AssessmentFormData) => {
    const sectionFields = Object.keys(formData[section] || {}).length;
    const sectionDirtyFields = Object.keys(dirtyFields[section] || {}).length;
    return sectionFields ? Math.round((sectionDirtyFields / sectionFields) * 100) : 0;
  }, [formData, dirtyFields]);

  return {
    formData,
    updateSection,
    getSectionErrors,
    getSectionProgress,
    isDirty,
    dirtyFields
  };
};

export default useAssessmentForm;