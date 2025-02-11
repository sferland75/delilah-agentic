import React from 'react';
import { useFormContext } from "react-hook-form";
import { type AssessmentFormData } from '@/lib/validation/assessment-schema';
import { MedicalHistorySection } from '@/components/MedicalHistory';

export const MedicalSection = () => {
  const { control } = useFormContext<AssessmentFormData>();

  return (
    <div className="space-y-6">
      <MedicalHistorySection />
    </div>
  );
};