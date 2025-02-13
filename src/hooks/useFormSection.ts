<<<<<<< HEAD
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
=======
import { useFormContext } from 'react-hook-form';
import type { AssessmentForm, AssessmentFormPath } from '@/types/form';

interface UseFormSectionOptions<T> {
  path: AssessmentFormPath;
  defaultValue: T;
}

export function useFormSection<T>({ path, defaultValue }: UseFormSectionOptions<T>) {
  const { register, watch, setValue } = useFormContext<AssessmentForm>();
  const value = watch(path as any) || defaultValue;

  const updateField = (fieldValue: T) => {
    setValue(path as any, fieldValue, {
      shouldValidate: true,
      shouldDirty: true
    });
  };

  const registerField = (subPath: keyof T) => {
    return register(`${path}.${String(subPath)}` as any);
  };

  return {
    value,
    updateField,
    registerField,
    defaultValue
  };
}
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
