import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import type { AssessmentFormData } from '@/lib/validation/assessment-schema';

export const useFormSection = <T extends keyof AssessmentFormData>(section: T) => {
  const { watch, setValue, formState: { errors } } = useFormContext<AssessmentFormData>();
  const sectionData = watch(section);

  const updateField = useCallback(<K extends keyof AssessmentFormData[T]>(
    field: K,
    value: AssessmentFormData[T][K]
  ) => {
    setValue(`${section}.${String(field)}`, value, {
      shouldValidate: true,
      shouldDirty: true
    });
  }, [section, setValue]);

  const getSectionErrors = useCallback(() => {
    return errors[section];
  }, [errors, section]);

  return {
    data: sectionData,
    updateField,
    errors: getSectionErrors()
  };
};

export default useFormSection;