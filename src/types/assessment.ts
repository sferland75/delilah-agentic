import { FunctionalAssessmentData } from './functionalAssessment';

// Independence level type
export type IndependenceLevel = 
  | 'independent'
  | 'modified_independent'
  | 'supervision'
  | 'minimal_assistance'
  | 'moderate_assistance'
  | 'maximal_assistance'
  | 'dependent';

// Frequency type
export type Frequency = 
  | 'multiple_daily'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'rarely';

// Time taken type
export type TimeTaken = 
  | 'under_5min'
  | '5_15min'
  | '15_30min'
  | '30_60min'
  | 'over_60min';

// Base interface for ADL entries
export interface ADLEntry {
  independence: IndependenceLevel;
  usesAssistiveDevices?: boolean;
  assistiveDevices?: string;
  frequency?: Frequency;
  timeTaken?: TimeTaken;
  notes?: string;
  lastAssessed?: string; // ISO format date string
}

// Interface definitions
export interface Assessment {
  demographics: Demographics;
  documentation?: Documentation;
  medicalHistory: MedicalHistory;
  typicalDay: TypicalDay;
  functionalAssessment: FunctionalAssessmentData;
  symptoms: Symptoms;
  environmental: Environmental;
  adl: ADL;
  care: Care;
  amaGuides?: AMAGuides;
}

export interface AssessmentData {
  assessment: Assessment;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  purpose?: string;
}

export interface Provider {
  providerType: string;
  name: string;
  frequency: string;
  focus: string;
}

export interface Demographics {
  emergencyContact: {
    name: string;
    phone?: string;
    relationship: string;
  };
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  maritalStatus: string;
  numberOfChildren?: number;
  childrenDetails?: string;
  householdMembers?: Array<{
    name: string;
    relationship: string;
    notes?: string;
  }>;
}

export interface Documentation {
  medicalDocumentation: any[];
  legalDocumentation: any[];
}

export interface MedicalHistory {
  medications: Medication[];
  allergies: string[];
  treatments: string[];
  surgeries?: string;
  injury: {
    position?: string;
    circumstance?: string;
    immediateResponse?: string;
    subsequentCare?: string;
  };
  currentTreatment: Provider[];
  preExisting?: string;
  familyHistory?: string;
}

export interface TypicalDay {
  preAccident?: DailyRoutine;
  current: DailyRoutine;
}

export interface DailyRoutine {
  daily: {
    sleepSchedule?: {
      wakeTime?: string;
      bedTime?: string;
    };
    routines?: {
      morning?: {
        activities?: string;
      };
      afternoon?: {
        activities?: string;
      };
      evening?: {
        activities?: string;
      };
      night?: {
        activities?: string;
      };
    };
  };
  weekly?: Record<string, unknown>;
}

export interface Symptoms {
  physical?: Array<{
    location: string;
    painType?: string;
    severity?: string;
    frequency?: string;
    aggravating?: string;
    relieving?: string;
  }>;
  cognitive?: Array<{
    symptom: string;
    severity: string;
    frequency: string;
    impact: string;
    management?: string;
  }>;
  emotional?: Array<{
    symptom: string;
    severity: string;
    frequency: string;
    impact: string;
    management?: string;
  }>;
  generalNotes?: string;
}

export interface Environmental {
  propertyOverview: {
    recommendedModifications?: string[];
    identifiedHazards?: string[];
    rooms: Record<string, Record<string, string>>;
  };
  exterior?: string[];
  safety: {
    hazards?: string[];
    recommendations?: string[];
  };
}

export interface ADL {
  basic: {
    bathing?: {
      shower?: ADLEntry;
      grooming?: ADLEntry;
      oral_care?: ADLEntry;
      toileting?: ADLEntry;
    };
    dressing?: {
      upper_body?: ADLEntry;
      lower_body?: ADLEntry;
      footwear?: ADLEntry;
    };
    transfers?: {
      bed_transfer?: ADLEntry;
      toilet_transfer?: ADLEntry;
      shower_transfer?: ADLEntry;
      position_changes?: ADLEntry;
    };
    feeding?: {
      eating?: ADLEntry;
      setup?: ADLEntry;
    };
  };
  iadl: {
    household?: {
      cleaning?: ADLEntry;
      laundry?: ADLEntry;
      meal_prep?: ADLEntry;
      home_maintenance?: ADLEntry;
    };
    community?: {
      transportation?: ADLEntry;
      shopping?: ADLEntry;
      money_management?: ADLEntry;
      navigation?: ADLEntry;
    };
  };
  health?: {
    management?: {
      medications?: ADLEntry;
      appointments?: ADLEntry;
      monitoring?: ADLEntry;
      exercise?: ADLEntry;
    };
    routine?: {
      sleep?: ADLEntry;
      stress?: ADLEntry;
      nutrition?: ADLEntry;
    };
  };
  work?: {
    status?: {
      current_status?: ADLEntry;
      workplace_accommodations?: ADLEntry;
      training_needs?: ADLEntry;
      barriers?: ADLEntry;
    };
  };
}

export interface Care {
  personalCare?: {
    type?: string;
    frequency?: string;
    notes?: string;
  };
}

export interface AMAGuides {
  narrative?: string;
}

export interface AssessmentMetadata {
  version: string;
  exportDate: string;
  lastModified: string;
  exportType: string;
}