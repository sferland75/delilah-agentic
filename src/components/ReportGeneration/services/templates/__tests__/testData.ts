import { AssessmentData } from '../../../../../types/assessment';

// Add a basic test to satisfy Jest
describe('Test Data', () => {
  test('baseAssessmentData should have all required fields', () => {
    expect(baseAssessmentData).toBeDefined();
    expect(baseAssessmentData.assessment).toBeDefined();
    expect(baseAssessmentData.assessment.demographics).toBeDefined();
    expect(baseAssessmentData.assessment.medicalHistory).toBeDefined();
    expect(baseAssessmentData.assessment.functionalAssessment).toBeDefined();
  });
});

export const baseAssessmentData: AssessmentData = {
  assessment: {
    demographics: {
      firstName: "Patrick",
      lastName: "Anderson",
      dateOfBirth: "1962-01-02",
      gender: "male",
      phone: "(613) 925-2216",
      email: "patrickanderson8@gmail.com",
      address: "3651 Maple Avenue, Prescott ON K0E 1T0",
      maritalStatus: "commonLaw",
      emergencyContact: {
        name: "Gaisha Anderson",
        relationship: "Wife"
      }
    },
    medicalHistory: {
      medications: [],
      allergies: [],
      treatments: [],
      injury: {
        position: "",
        circumstance: "",
        immediateResponse: "",
        subsequentCare: ""
      },
      currentTreatment: []
    },
    typicalDay: {
      current: {
        daily: {
          sleepSchedule: {},
          routines: {}
        }
      }
    },
    functionalAssessment: {
      rangeOfMotion: {
        measurements: [],
        generalNotes: ""
      },
      manualMuscleTesting: {
        grades: {},
        generalNotes: ""
      },
      bergBalance: {
        items: {},
        generalNotes: "",
        totalScore: 0
      },
      posturalTolerances: {
        standing: "",
        walking: ""
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
        recommendedModifications: [],
        identifiedHazards: [],
        rooms: {}
      },
      safety: {
        hazards: [],
        recommendations: []
      }
    },
    adl: {
      basic: {
        bathing: {
          shower: {
            independence: "",
            notes: ""
          }
        },
        dressing: {},
        feeding: {},
        transfers: {}
      },
      iadl: {
        household: {},
        community: {}
      },
      work: {
        status: {}
      }
    },
    care: {
      personalCare: {
        type: "",
        frequency: "",
        notes: ""
      }
    }
  }
};
