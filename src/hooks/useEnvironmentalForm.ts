import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import type { AssessmentFormData } from '@/lib/validation/assessment-schema';

export const useEnvironmentalForm = () => {
  const { watch, setValue } = useFormContext<AssessmentFormData>();
  const environmentalData = watch('environmental');

  const updateField = useCallback((
    field: keyof AssessmentFormData['environmental'], 
    value: any
  ) => {
    setValue(`environmental.${field}`, value, {
      shouldValidate: true,
      shouldDirty: true
    });
  }, [setValue]);

  const updatePropertyOverview = useCallback((
    field: keyof AssessmentFormData['environmental']['propertyOverview'], 
    value: any
  ) => {
    setValue(`environmental.propertyOverview.${field}`, value, {
      shouldValidate: true,
      shouldDirty: true
    });
  }, [setValue]);

  const updateAccess = useCallback((
    type: 'exterior' | 'interior',
    value: any
  ) => {
    setValue(`environmental.propertyOverview.access.${type}`, value, {
      shouldValidate: true,
      shouldDirty: true
    });
  }, [setValue]);

  const updateSafety = useCallback((
    field: keyof AssessmentFormData['environmental']['safety'], 
    value: any
  ) => {
    setValue(`environmental.safety.${field}`, value, {
      shouldValidate: true,
      shouldDirty: true
    });
  }, [setValue]);

  return {
    data: environmentalData || {
      propertyOverview: {
        propertyType: '',
        layoutDescription: '',
        access: {
          exterior: { description: '' },
          interior: {
            description: '',
            hasStairs: false,
            numberOfStairs: 0
          }
        },
        recommendedModifications: [],
        identifiedHazards: []
      },
      safety: {
        hazards: [],
        concerns: '',
        recommendations: ''
      }
    },
    updateField,
    updatePropertyOverview,
    updateAccess,
    updateSafety
  };
};

export default useEnvironmentalForm;