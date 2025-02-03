import { AssessmentData } from '../../../types/assessment';

export interface FormData {
  personal: {
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
      phone?: string;
      relationship: string;
    };
    children?: {
      count: number;
      details?: string;
    };
  };
  medical: {
    currentMedications: Array<{
      name: string;
      dosage: string;
      frequency: string;
      purpose?: string;
    }>;
    allergies: string[];
    treatments: string[];
    injury: {
      position?: string;
      circumstance?: string;
      immediateResponse?: string;
      subsequentCare?: string;
    };
    providers: Array<{
      type: string;
      name: string;
      frequency: string;
      focus: string;
    }>;
    preExisting?: string;
    familyHistory?: string;
  };
  assessment: {
    rom: Array<{
      joint: string;
      movement: string;
      normalROM: string;
      left?: {
        active?: string;
        passive?: string;
      };
      right?: {
        active?: string;
        passive?: string;
      };
      painLeft?: boolean;
      painRight?: boolean;
      notes?: string;
    }>;
    mmt: {
      grades: Record<string, string>;
      notes?: string;
    };
    berg: {
      items: Record<string, {
        score: number;
        notes?: string;
      }>;
      totalScore: number;
      notes?: string;
    };
    postural: {
      standing?: string;
      walking?: string;
    };
  };
  daily: {
    current: {
      schedule: {
        wake?: string;
        bed?: string;
      };
      routines: {
        morning?: string;
        afternoon?: string;
        evening?: string;
        night?: string;
      };
    };
  };
  home: {
    rooms: Record<string, Record<string, string>>;
    modifications?: string[];
    hazards?: string[];
    safety: {
      issues?: string[];
      recommendations?: string[];
    };
  };
  activities: {
    bathing?: {
      shower?: {
        independence?: string;
        notes?: string;
      };
    };
    dressing?: {
      lower?: {
        independence?: string;
        notes?: string;
      };
    };
    household?: {
      cleaning?: {
        independence?: string;
        notes?: string;
      };
    };
    community?: {
      transport?: {
        independence?: string;
        notes?: string;
      };
    };
  };
  care?: {
    type?: string;
    frequency?: string;
    notes?: string;
  };
}

export const transformFormToAssessment = (formData: FormData): AssessmentData => {
  return {
    assessment: {
      demographics: {
        firstName: formData.personal.firstName,
        lastName: formData.personal.lastName,
        dateOfBirth: formData.personal.dateOfBirth,
        gender: formData.personal.gender,
        phone: formData.personal.phone,
        email: formData.personal.email,
        address: formData.personal.address,
        maritalStatus: formData.personal.maritalStatus,
        emergencyContact: formData.personal.emergencyContact,
        numberOfChildren: formData.personal.children?.count,
        childrenDetails: formData.personal.children?.details
      },
      documentation: {
        medicalDocumentation: [],
        legalDocumentation: []
      },
      medicalHistory: {
        medications: formData.medical.currentMedications,
        allergies: formData.medical.allergies,
        treatments: formData.medical.treatments,
        injury: formData.medical.injury,
        currentTreatment: formData.medical.providers.map(provider => ({
          providerType: provider.type,
          name: provider.name,
          frequency: provider.frequency,
          focus: provider.focus
        })),
        preExisting: formData.medical.preExisting,
        familyHistory: formData.medical.familyHistory
      },
      typicalDay: {
        current: {
          daily: {
            sleepSchedule: {
              wakeTime: formData.daily.current.schedule.wake,
              bedTime: formData.daily.current.schedule.bed
            },
            routines: {
              morning: { activities: formData.daily.current.routines.morning },
              afternoon: { activities: formData.daily.current.routines.afternoon },
              evening: { activities: formData.daily.current.routines.evening },
              night: { activities: formData.daily.current.routines.night }
            }
          }
        }
      },
      functionalAssessment: {
        rangeOfMotion: {
          measurements: formData.assessment.rom,
          generalNotes: ""
        },
        manualMuscleTesting: {
          grades: formData.assessment.mmt.grades,
          generalNotes: formData.assessment.mmt.notes
        },
        bergBalance: {
          items: formData.assessment.berg.items,
          generalNotes: formData.assessment.berg.notes,
          totalScore: formData.assessment.berg.totalScore
        },
        posturalTolerances: {
          standing: formData.assessment.postural.standing,
          walking: formData.assessment.postural.walking
        },
        transfers: {}
      },
      symptoms: {
        physical: [],
        cognitive: [],
        emotional: [],
        generalNotes: ""
      },
      environmental: {
        propertyOverview: {
          recommendedModifications: formData.home.modifications,
          identifiedHazards: formData.home.hazards,
          rooms: formData.home.rooms
        },
        safety: {
          hazards: formData.home.safety.issues,
          recommendations: formData.home.safety.recommendations
        }
      },
      adl: {
        basic: {
          bathing: {
            shower: formData.activities.bathing?.shower
          },
          dressing: {
            lower_body: formData.activities.dressing?.lower
          }
        },
        iadl: {
          household: {
            cleaning: formData.activities.household?.cleaning
          },
          community: {
            transportation: formData.activities.community?.transport
          }
        },
        work: {
          status: {}
        }
      },
      care: {
        personalCare: {
          type: formData.care?.type,
          frequency: formData.care?.frequency,
          notes: formData.care?.notes
        }
      }
    }
  };
};

export const validateFormData = (formData: FormData): string[] => {
  const errors: string[] = [];

  // Required personal information
  if (!formData.personal.firstName) errors.push("First name is required");
  if (!formData.personal.lastName) errors.push("Last name is required");
  if (!formData.personal.dateOfBirth) errors.push("Date of birth is required");
  if (!formData.personal.emergencyContact.name) errors.push("Emergency contact name is required");

  // Required medical information
  if (!formData.medical.injury.circumstance) errors.push("Injury circumstance is required");

  // Required assessments
  if (!formData.assessment.rom.length) errors.push("ROM measurements are required");
  if (Object.keys(formData.assessment.mmt.grades).length === 0) errors.push("MMT grades are required");

  // Required environmental information
  if (Object.keys(formData.home.rooms).length === 0) errors.push("Room assessment is required");

  return errors;
};

export const getCompletionStatus = (formData: FormData): Record<string, boolean> => {
  return {
    demographics: Boolean(formData.personal.firstName && formData.personal.lastName),
    medical: Boolean(formData.medical.injury.circumstance && formData.medical.providers.length),
    functional: Boolean(formData.assessment.rom.length && Object.keys(formData.assessment.mmt.grades).length),
    environmental: Boolean(Object.keys(formData.home.rooms).length),
    adl: Boolean(formData.activities.bathing || formData.activities.dressing),
    typicalDay: Boolean(formData.daily.current.routines.morning || formData.daily.current.routines.afternoon)
  };
};
