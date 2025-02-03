import React from 'react';
import { useForm } from 'react-hook-form';
import { FormProvider as HookFormProvider } from 'react-hook-form';
import { useFormContext as useDelilahForm } from '@/context/FormContext';

export function FormProvider({ children }: { children: React.ReactNode }) {
  const { formData } = useDelilahForm();
  
  // Initialize form with current data
  const methods = useForm({
    defaultValues: formData
  });

  // Update form whenever formData changes
  React.useEffect(() => {
    if (formData) {
      console.log('FormProvider - Resetting form with new data:', formData);
      methods.reset(formData);
    }
  }, [formData, methods]);

  return (
    <HookFormProvider {...methods}>
      {children}
    </HookFormProvider>
  );
}
