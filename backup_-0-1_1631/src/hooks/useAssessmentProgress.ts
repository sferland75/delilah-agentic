import { useState, useEffect } from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { AssessmentSchema } from '@/types/assessment-schema';
import type { AssessmentForm } from '@/types/form';

const REQUIRED_SECTIONS = [
  'personalInfo',
  'medicalHistory',
  'currentStatus',
  'functionalAssessment',
  'environmentalAssessment',
  'adlAssessment',
  'careRequirements',
  'summary'
] as const;

function isSectionComplete(data: any, section: string): boolean {
  if (!data || !data[section]) return false;
  
  const sectionData = data[section];
  
  // Check if object has any filled values
  if (typeof sectionData === 'object') {
    return Object.values(sectionData).some(value => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(v => Boolean(v));
      }
      return Boolean(value);
    });
  }
  
  return false;
}

export function useAssessmentProgress(form: UseFormReturn<AssessmentForm>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const subscription = form.watch((data?: AssessmentForm) => {
      if (!data) return;

      try {
        // Validate data against schema
        AssessmentSchema.parse(data);

        // Calculate progress based on completed sections
        const completedSections = REQUIRED_SECTIONS.filter(section => 
          isSectionComplete(data, section)
        ).length;

        setProgress(Math.round((completedSections / REQUIRED_SECTIONS.length) * 100));
      } catch (error) {
        console.error('Form validation error:', error);
        // Set progress to 0 if validation fails
        setProgress(0);
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  return progress;
}