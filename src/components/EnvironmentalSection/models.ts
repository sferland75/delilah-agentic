import type { AccessibilityLevel, AssessmentLevel } from '@/lib/validation/assessment-schema';

export interface ExteriorFeature {
  id: string;
  name: string;
  type: string;
  accessibility: AccessibilityLevel;
  safety: AssessmentLevel;
  condition?: string;
  recommendations: string[];
  hazards: string[];
}

export interface OutdoorSpace {
  id: string;
  type: string;
  dimensions: string;
  accessibility: string;
  maintenance: string;
  features: string;
  concerns: string;
  notes: string;
}

export interface Room extends ExteriorFeature {
  measurements?: string;
}