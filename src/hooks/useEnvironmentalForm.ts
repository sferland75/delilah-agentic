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