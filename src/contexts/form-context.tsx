import { createContext, useContext, ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AssessmentSchema } from '@/types/assessment-schema';
import type { AssessmentForm } from '@/types/form';
import { storageService } from '@/services/storageService';

const FormContext = createContext<{
  save: () => Promise<void>;
  reset: () => void;
} | null>(null);

interface FormProviderProps {
  children: ReactNode;
  defaultValues?: Partial<AssessmentForm>;
  onSave?: (data: AssessmentForm) => Promise<void>;
}

export function AssessmentFormProvider({ 
  children, 
  defaultValues,
  onSave 
}: FormProviderProps) {
  const form = useForm<AssessmentForm>({
    resolver: zodResolver(AssessmentSchema),
    defaultValues: {
      id: crypto.randomUUID(),
      status: 'draft',
      ...defaultValues
    }
  });

  const contextValue = {
    save: async () => {
      const data = form.getValues();
      if (onSave) {
        await onSave(data);
      } else {
        await storageService.save(data);
      }
    },
    reset: () => form.reset(defaultValues)
  };

  return (
    <FormContext.Provider value={contextValue}>
      <FormProvider {...form}>
        {children}
      </FormProvider>
    </FormContext.Provider>
  );
}

export function useFormActions() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormActions must be used within AssessmentFormProvider');
  }
  return context;
}