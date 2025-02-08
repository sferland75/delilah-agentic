import { AssessmentFormData } from './validation/assessment-schema';

export const defaultFormState: AssessmentFormData = {
  initial: {
    personal: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      phone: '',
      email: ''
    }
  },
  medical: {
    injury: {
      circumstance: '',
      date: '',
      description: '',
      notes: ''
    },
    symptoms: [],
    pain: {},
    treatments: [],
    medications: [],
    imaging: []
  },
  functional: {
    tolerances: {},
    rangeOfMotion: {},
    manualMuscleTesting: {},
    overallNotes: '',
    recommendations: [],
    followUpNeeded: false,
    followUpNotes: ''
  },
  environmental: {
    propertyOverview: {
      propertyType: '',
      layoutDescription: '',
      access: {
        exterior: {
          description: ''
        },
        interior: {
          description: '',
          hasStairs: false,
          numberOfStairs: 0
        }
      },
      recommendedModifications: [],
      identifiedHazards: []
    },
    safety: {
      hazards: [],
      concerns: '',
      recommendations: ''
    }
  },
  ama: {
    edition: '',
    assessmentDate: '',
    diagnosisCategories: [],
    totalImpairment: '',
    methodology: '',
    recommendations: [],
    additionalNotes: ''
  },
  attendantCare: {
    overview: {
      totalHoursPerDay: '',
      caregiverTypes: [],
      supervisedCare: false,
      specializedTraining: false,
      scheduleFlexibility: ''
    },
    tasks: [],
    schedule: [],
    equipment: [],
    training: {
      required: false,
      topics: [],
      duration: '',
      provider: '',
      specialConsiderations: ''
    },
    recommendations: [],
    notes: ''
  }
};