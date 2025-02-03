import { FunctionalAssessmentData } from './functionalAssessment';

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

// Rest of your existing interfaces remain unchanged
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
      shower?: {
        independence?: string;
        notes?: string;
      };
      grooming?: {
        independence?: string;
        notes?: string;
      };
      oral_care?: {
        independence?: string;
        notes?: string;
      };
    };
    dressing?: {
      upper_body?: {
        independence?: string;
        notes?: string;
      };
      lower_body?: {
        independence?: string;
        notes?: string;
      };
      footwear?: {
        independence?: string;
        notes?: string;
      };
    };
    feeding?: {
      eating?: {
        notes?: string;
      };
    };
    transfers?: Record<string, {
      independence?: string;
      notes?: string;
    }>;
  };
  iadl: {
    household?: {
      cleaning?: {
        independence?: string;
        notes?: string;
      };
      home_maintenance?: {
        independence?: string;
        notes?: string;
      };
    };
    community?: {
      transportation?: {
        independence?: string;
        notes?: string;
      };
      shopping?: {
        independence?: string;
        notes?: string;
      };
    };
  };
  work?: {
    status?: {
      current_status?: {
        notes?: string;
      };
      barriers?: {
        notes?: string;
      };
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