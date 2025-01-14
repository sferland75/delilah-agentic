import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import type { AssessmentFormData } from '@/lib/validation/assessment-schema';

export function useAssessmentPersistence(form: UseFormReturn<AssessmentFormData>, key: string) {
  useEffect(() => {
    // Load saved data on mount
    const savedData = localStorage.getItem(key);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        form.reset(parsedData);
      } catch (error) {
        console.error('Error loading saved form data:', error);
      }
    }

    // Save data on changes
    const subscription = form.watch((value) => {
      if (value) {
        localStorage.setItem(key, JSON.stringify(value));
      }
    });

    return () => {
      if (typeof subscription?.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    };
  }, [form, key]);
}