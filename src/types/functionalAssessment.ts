export interface FunctionalCapacity {
  activity: string;
  difficulty: number;     // 0-10 scale
  limitations: string;    // Detailed description of limitations
  adaptations: string;    // Adaptations or modifications used
}

export interface ROMResult {
  active?: string;
  passive?: string;
}

export interface ROMItem {
  joint: string;
  movement: string;
  normalROM: string;
  left?: ROMResult;
  right?: ROMResult;
  painLeft?: boolean;
  painRight?: boolean;
  notes?: string;
}

export interface FunctionalAssessmentData {
  // New assessment data
  capacities: FunctionalCapacity[];
  overallNotes: string;
  recommendedAccommodations: string[];
  followUpNeeded: boolean;
  followUpNotes?: string;

  // Existing assessment data
  rangeOfMotion: {
    measurements: ROMItem[];
    generalNotes?: string;
  };
  manualMuscleTesting: {
    grades: Record<string, string>;
    generalNotes?: string;
  };
  bergBalance: {
    items: Record<string, {
      score: number;
      notes?: string;
    }>;
    generalNotes?: string;
    totalScore: number;
  };
  posturalTolerances?: {
    standing?: string;
    walking?: string;
  };
  transfers?: Record<string, {
    independence?: string;
    notes?: string;
  }>;
}