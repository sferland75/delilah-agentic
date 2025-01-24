import { z } from 'zod';

// Core Types
export interface AssessmentFormData {
  currentStatus: {
    generalNotes: string;
    cognitiveSymptoms: string;
    emotionalSymptoms: string;
    physicalSymptoms: string;
  };
  functionalAssessment: {
    rangeOfMotion: {
      assessment: string;
      measurements: ROMeasurement[];
    };
    manualMuscleTesting: {
      assessment: string;
      results: MMTResult[];
    };
    bergBalanceTest: {
      score: number;
      notes: string;
    };
  };
  environmental: {
    propertyOverview: PropertyOverview;
    rooms: RoomAssessment[];
    exterior: ExteriorFeature[];
    safety: SafetyAssessment;
  };
  amaGuides: {
    adl: ADLAssessment;
    social: SocialAssessment;
    concentration: ConcentrationAssessment;
    work: WorkAssessment;
    overall: OverallAssessment;
  };
}

// Functional Assessment Types
export interface ROMeasurement {
  joint: string;
  movement: string;
  normalROM: string;
  left: string;
  right: string;
  percentNormal: string;
  painLeft: boolean;
  painRight: boolean;
  notes: string;
}

export interface MMTResult {
  muscleGroup: string;
  left: number;
  right: number;
  notes: string;
}

// Environmental Types
export interface PropertyOverview {
  type: string;
  groundType: string;
  groundCondition: string;
  accessType: string;
  generalNotes: string;
  recommendedModifications: string[];
  identifiedHazards: string[];
}

export interface RoomAssessment {
  id: string;
  name: string;
  accessibility: string;
  safety: string;
  features: string;
  measurements: string;
  recommendations: string[];
  hazards: string[];
}

export interface ExteriorFeature {
  id: string;
  type: string;
  condition: string;
  accessibility: string;
  safety: string;
  recommendations: string[];
}

export interface SafetyAssessment {
  hazards: string[];
  features: string;
  concerns: string;
  recommendations: string[];
}

// AMA Guide Types
export interface ADLAssessment {
  classRating: string;
  clinicalFindings: string;
  functionalLimitations: string;
  treatmentAndPrognosis: string;
}

export interface SocialAssessment {
  classRating: string;
  clinicalFindings: string;
  functionalLimitations: string;
  treatmentAndPrognosis: string;
}

export interface ConcentrationAssessment {
  classRating: string;
  clinicalFindings: string;
  functionalLimitations: string;
  treatmentAndPrognosis: string;
}

export interface WorkAssessment {
  classRating: string;
  clinicalFindings: string;
  functionalLimitations: string;
  treatmentAndPrognosis: string;
}

export interface OverallAssessment {
  highestClass: string;
  justification: string;
  additionalFactors: string;
}