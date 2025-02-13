<<<<<<< HEAD
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
=======
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { environmentalConfigs } from "@/components/EnvironmentalSection/config";

const assessmentRatingSchema = z.object({
  accessibility: z.string(),
  safety: z.string(),
  features: z.string().optional(),
  condition: z.string().optional(),
  notes: z.string().optional(),
});

const roomAssessmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  ratings: assessmentRatingSchema,
  measurements: z.string().optional(),
  recommendations: z.array(z.string()).optional(),
  hazards: z.array(z.string()).optional(),
  modifications: z.array(z.string()).optional(),
});

const exteriorFeatureSchema = z.object({
  id: z.string(),
  name: z.string(),
  ratings: assessmentRatingSchema,
  details: z.string().optional(),
  recommendations: z.array(z.string()).optional(),
});

const propertyOverviewSchema = z.object({
  type: z.string(),
  groundType: z.string(),
  groundCondition: z.string(),
  accessType: z.string(),
  generalNotes: z.string().optional(),
  recommendedModifications: z.array(z.string()).optional(),
  identifiedHazards: z.array(z.string()).optional(),
});

const outdoorSpaceSchema = z.object({
  id: z.string(),
  type: z.string(),
  dimensions: z.string(),
  accessibility: z.string(),
  maintenance: z.string(),
  features: z.string(),
  concerns: z.string(),
  notes: z.string(),
});

export const environmentalAssessmentSchema = z.object({
  propertyOverview: propertyOverviewSchema,
  rooms: z.array(roomAssessmentSchema),
  exteriorFeatures: z.array(exteriorFeatureSchema),
  outdoorSpaces: z.array(outdoorSpaceSchema),
  accessibility: z.object({
    concerns: z.string(),
    modifications: z.string(),
    recommendations: z.string(),
  }),
  safety: z.object({
    hazards: z.array(z.string()),
    features: z.string(),
    concerns: z.string(),
    recommendations: z.string(),
  }),
});

export type EnvironmentalAssessment = z.infer<typeof environmentalAssessmentSchema>;

const DEFAULT_VALUES: EnvironmentalAssessment = {
  propertyOverview: {
    type: '',
    groundType: '',
    groundCondition: '',
    accessType: '',
    generalNotes: '',
    recommendedModifications: [],
    identifiedHazards: [],
  },
  rooms: [],
  exteriorFeatures: [],
  outdoorSpaces: [],
  accessibility: {
    concerns: '',
    modifications: '',
    recommendations: '',
  },
  safety: {
    hazards: [],
    features: '',
    concerns: '',
    recommendations: '',
  },
};

export const useEnvironmentalForm = (defaultValues?: Partial<EnvironmentalAssessment>) => {
  return useForm<EnvironmentalAssessment>({
    resolver: zodResolver(environmentalAssessmentSchema),
    defaultValues: {
      ...DEFAULT_VALUES,
      ...defaultValues,
    },
    mode: "onChange"
  });
};
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
