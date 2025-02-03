export interface ClientDemographics {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  address: string;
  maritalStatus: string;
  children: number;
  childrenDetails: string;
  householdMembers: HouseholdMember[];
}

export interface HouseholdMember {
  name: string;
  relationship: string;
  details: string;
}

export interface ReferralInformation {
  lawyer?: {
    name: string;
    firm: string;
  };
  adjuster?: {
    name: string;
    insurer: string;
  };
  claimNumber?: string;
}

export interface DocumentationReviewed {
  source: string;
  type: string;
  dateRange: string;
  details: string;
}

export interface Employment {
  status: string;
  employer: string;
  role: string;
  duties: string[];
  schedule: string;
  modifications?: string[];
}

export interface Treatment {
  provider: string;
  type: string;
  frequency: string;
  startDate: string;
  focus: string;
  progress: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  purpose: string;
  changes?: string;
}

export interface Symptom {
  type: 'physical' | 'cognitive' | 'emotional';
  description: string;
  severity: string;
  frequency: string;
  aggravating: string[];
  relieving: string[];
  impact: string;
}

export interface ROMAssessment {
  joint: string;
  movement: string;
  normalRange: string;
  left?: {
    active: string;
    passive: string;
  };
  right?: {
    active: string;
    passive: string;
  };
  pain: boolean;
  notes: string;
}

export interface StrengthAssessment {
  muscle: string;
  left: string;
  right: string;
  notes: string;
}

export interface BalanceAssessment {
  staticStanding: string;
  dynamicStanding: string;
  singleLegStance: string;
  functionalReach: string;
  gait: string;
  falls: string[];
  notes: string;
}

export interface PosturalTolerances {
  sitting: string;
  standing: string;
  walking: string;
  lifting: string;
  carrying: string;
  notes: string;
}

export interface TransferAssessment {
  type: string;
  independence: string;
  assistiveDevices: string[];
  safety: string;
  notes: string;
}

export interface EnvironmentalAssessment {
  type: string;
  layout: string;
  barriers: string[];
  adaptations: string[];
  hazards: string[];
}

export interface CommunityAccess {
  transportation: string;
  shopping: string;
  recreation: string;
  barriers: string[];
}

export interface WorkplaceAssessment {
  environment: string;
  duties: string[];
  barriers: string[];
  modifications: string[];
}

export interface ADLAssessment {
  activity: string;
  preAccidentStatus: string;
  currentStatus: string;
  independence: string;
  barriers: string[];
  adaptations: string[];
}

export interface AMASphereDomain {
  description: string;
  preAccidentStatus: string;
  currentStatus: string;
  impairments: string[];
  evidence: string[];
}