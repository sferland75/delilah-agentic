import React, { createContext, useContext } from 'react';
import type { FormContextType } from '@/components/ReportGeneration/types';

const FormContext = createContext<FormContextType | undefined>(undefined);

export function useFormContext() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
}

export { FormContext };
export type { FormContextType };