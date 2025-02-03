import React from 'react';
import { FormProvider as RHFFormProvider, useForm } from 'react-hook-form';
import { useFormContext as useStateContext } from './FormContext';
import { toast } from '@/components/ui/use-toast';

const defaultValues = {
  assessment: {
    rom: {},
    mmt: {},
    personal: {},
    medical: {},
    typicalDay: {},
    functionalAssessment: {
      capacities: [],
      overallNotes: '',
      recommendedAccommodations: [],
      followUpNeeded: false,
      followUpNotes: '',
      rangeOfMotion: {
        measurements: [],
        generalNotes: ''
      },
      manualMuscleTesting: {
        grades: {},
        generalNotes: ''
      },
      bergBalance: {
        items: {},
        generalNotes: '',
        totalScore: 0
      }
    }
  }
};

export function FormProvider({ children }: { children: React.ReactNode }) {
  const { formData, updateFormData } = useStateContext();
  
  const methods = useForm({
    defaultValues: { ...defaultValues, ...formData },
    mode: 'onChange'
  });

  // Subscribe to form changes and update context
  React.useEffect(() => {
    const subscription = methods.watch((value) => {
      console.log('Form value changed:', value);
      updateFormData(value);
    });
    return () => subscription.unsubscribe();
  }, [methods.watch, updateFormData]);

  return (
    <RHFFormProvider {...methods}>
      {children}
    </RHFFormProvider>
  );
}