interface AssessmentBase {
  assessment: {
    demographics: {
      firstName: string;
      lastName: string;
      dateOfBirth: string;
      gender: string;
      phone: string;
      email: string;
      address: string;
      maritalStatus: string;
      emergencyContact: {
        name: string;
        relationship: string;
        phone: string;
      };
    };
    medicalHistory: {
      diagnoses: Array<{
        condition: string;
        date: string;
        status: string;
      }>;
      medications: Array<{
        name: string;
        dosage: string;
        frequency: string;
        purpose: string;
      }>;
      currentTreatment: Array<{
        provider: string;
        type: string;
        frequency: string;
        notes: string;
      }>;
      treatmentHistory: string[];
    };
    functionalAssessment: {
      rangeOfMotion: {
        measurements: Array<{
          joint: string;
          movement: string;
          range: string;
          notes: string;
        }>;
      };
      manualMuscleTesting: {
        grades: {
          [key: string]: {
            grade: string;
            notes: string;
          };
        };
      };
      bergBalance: {
        items: Array<{
          task: string;
          score: number;
          notes: string;
        }>;
        totalScore: number;
      };
      capacities?: Array<{
        activity: string;
        score: number;
        limitations?: string[];
        adaptations?: string[];
      }>;
      tolerances?: {
        sitting: string;
        standing: string;
        walking: string;
        lifting: string;
      };
    };
    adl: {
      selfCare: {
        preAccident: string;
        current: string;
      };
      homeManagement: Array<{
        task: string;
        preAccident: string;
        current: string;
        timeAllotted?: string;
      }>;
      leisure: {
        preAccident: string[];
        current: string[];
      };
      work?: {
        preAccident: {
          occupation: string;
          hours: string;
          duties: string[];
        };
        current: {
          status: string;
          limitations: string[];
          accommodations?: string[];
        };
      };
    };
    environmental: {
      propertyOverview: {
        type: string;
        layout: string;
        accessibility: string;
        recommendedModifications: Array<{
          area: string;
          modification: string;
          priority: string;
          cost?: string;
        }>;
        identifiedHazards: Array<{
          location: string;
          hazard: string;
          recommendation: string;
        }>;
        rooms: {
          [key: string]: {
            description: string;
            concerns: string[];
            recommendations?: string[];
          };
        };
      };
    };
    amaGuides?: {
      upperExtremity?: {
        rom?: {
          [joint: string]: {
            flexion: number;
            extension: number;
            impairment: number;
          };
        };
        strength?: {
          [muscle: string]: {
            grade: number;
            impairment: number;
          };
        };
      };
      total?: {
        wholePersonImpairment: number;
      };
    };
  };
}

export type AssessmentData = AssessmentBase;
