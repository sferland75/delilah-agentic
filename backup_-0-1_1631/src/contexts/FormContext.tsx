import { createContext, useContext } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { AssessmentFormData } from '@/lib/validation/assessment-schema';

export type AssessmentFormContextType = UseFormReturn<AssessmentFormData>;

export const FormContext = createContext<AssessmentFormContextType | null>(null);

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};