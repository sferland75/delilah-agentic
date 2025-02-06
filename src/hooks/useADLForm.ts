import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import type { AssessmentFormData } from '@/lib/validation/assessment-schema';

export const useADLForm = () => {
  const { watch, setValue } = useFormContext<AssessmentFormData>();
  const adlData = watch('adl');

  const updateBasicADL = useCallback((
    activity: keyof AssessmentFormData['adl']['basicADL'],
    field: string,
    value: any
  ) => {
    setValue(`adl.basicADL.${activity}.${field}`, value, {
      shouldValidate: true,
      shouldDirty: true
    });
  }, [setValue]);

  const updateInstrumentalADL = useCallback((
    activity: keyof AssessmentFormData['adl']['instrumentalADL'],
    field: string,
    value: any
  ) => {
    setValue(`adl.instrumentalADL.${activity}.${field}`, value, {
      shouldValidate: true,
      shouldDirty: true
    });
  }, [setValue]);

  const updateHealthManagement = useCallback((
    activity: keyof AssessmentFormData['adl']['healthManagement'],
    field: string,
    value: any
  ) => {
    setValue(`adl.healthManagement.${activity}.${field}`, value, {
      shouldValidate: true,
      shouldDirty: true
    });
  }, [setValue]);

  return {
    data: adlData || {
      basicADL: {
        feeding: {
          independence: '',
          assistance: '',
          equipment: [],
          notes: ''
        },
        dressing: {
          independence: '',
          assistance: '',
          equipment: [],
          notes: ''
        },
        bathing: {
          independence: '',
          assistance: '',
          equipment: [],
          notes: ''
        },
        toileting: {
          independence: '',
          assistance: '',
          equipment: [],
          notes: ''
        },
        transferring: {
          independence: '',
          assistance: '',
          equipment: [],
          notes: ''
        },
        mobility: {
          independence: '',
          assistance: '',
          equipment: [],
          notes: ''
        }
      },
      instrumentalADL: {
        mealPrep: {
          independence: '',
          assistance: '',
          equipment: [],
          notes: ''
        },
        housekeeping: {
          independence: '',
          assistance: '',
          equipment: [],
          notes: ''
        },
        laundry: {
          independence: '',
          assistance: '',
          equipment: [],
          notes: ''
        },
        transportation: {
          independence: '',
          assistance: '',
          equipment: [],
          notes: ''
        },
        shopping: {
          independence: '',
          assistance: '',
          equipment: [],
          notes: ''
        },
        medications: {
          independence: '',
          assistance: '',
          equipment: [],
          notes: ''
        },
        finances: {
          independence: '',
          assistance: '',
          equipment: [],
          notes: ''
        }
      },
      healthManagement: {
        appointments: {
          independence: '',
          assistance: '',
          equipment: [],
          notes: ''
        },
        exerciseRoutine: {
          independence: '',
          assistance: '',
          equipment: [],
          notes: ''
        },
        painManagement: {
          independence: '',
          assistance: '',
          equipment: [],
          notes: ''
        },
        symptomMonitoring: {
          independence: '',
          assistance: '',
          equipment: [],
          notes: ''
        }
      }
    },
    updateBasicADL,
    updateInstrumentalADL,
    updateHealthManagement
  };
};

export default useADLForm;