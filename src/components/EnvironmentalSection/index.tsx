import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { PropertyOverview } from './components/property-overview';
import { SafetyAssessment } from './components/safety-assessment';

export function EnvironmentalSection() {
  const { setValue, getValues } = useFormContext();
  const currentValues = getValues('environmental');

  useEffect(() => {
    // Only set values if they don't exist
    if (!currentValues) {
      const initialValues = {
        propertyOverview: {
          type: '',
          levels: '',
          exteriorAccess: '',
          interiorAccess: '',
          rooms: {},
          generalNotes: ''
        },
        safety: {
          hazards: [],
          concerns: '',
          recommendations: ''
        }
      };
      
      setValue('environmental', initialValues, {
        shouldDirty: false,
        shouldTouch: false
      });
    }
  }, []); // Empty dependency array as this should only run once

  return (
    <div className="space-y-6">
      <PropertyOverview />
      <SafetyAssessment />
    </div>
  );
}