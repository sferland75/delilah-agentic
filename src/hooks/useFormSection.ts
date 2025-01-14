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