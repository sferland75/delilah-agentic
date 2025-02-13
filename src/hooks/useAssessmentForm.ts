<<<<<<< HEAD
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
=======
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type AssessmentForm, AssessmentSchema } from '@/types/form';

const DEFAULT_VALUES: AssessmentForm = {
  id: crypto.randomUUID(),
  medicalHistory: {
    preAccidentHistory: '',
    mechanismOfInjury: '',
    natureOfInjury: '',
    currentTreatments: [],
    medications: []
  },
  rangeOfMotion: [],
  environmental: {
    spaces: []
  }
};

export function useAssessmentForm(defaultValues: Partial<AssessmentForm> = {}) {
  return useForm<AssessmentForm>({
    resolver: zodResolver(AssessmentSchema),
    defaultValues: {
      ...DEFAULT_VALUES,
      ...defaultValues
    }
  });
}
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
