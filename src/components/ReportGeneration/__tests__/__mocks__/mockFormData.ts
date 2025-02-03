export const mockFormData = {
  assessment: {
    type: 'initial',
    date: '2025-02-01'
  },
  personal: {
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-01-01',
    phone: '123-456-7890',
    email: 'john@example.com'
  },
  medical: {
    injury: {
      date: '2025-01-01',
      circumstance: 'Work-related incident',
      description: 'Test injury'
    },
    symptoms: [],
    treatments: []
  },
  functional: {
    adl: [],
    iadl: [],
    mobility: [],
    restrictions: []
  },
  daily: {
    schedule: [],
    limitations: []
  },
  home: {
    environment: {},
    modifications: []
  },
  activities: {
    work: [],
    leisure: []
  },
  environmental: {
    propertyOverview: {
      recommendedModifications: [],
      identifiedHazards: []
    },
    rooms: [],
    exterior: [],
    safety: {
      hazards: [],
      recommendations: []
    }
  }
} as const;