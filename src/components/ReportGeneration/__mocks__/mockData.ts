import type { FormData } from '../utils/formTransformer';

export const mockFormData: FormData = {
  personal: {
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-01-01',
    phone: '123-456-7890',
    email: 'john@example.com'
  },
  medical: {
    injury: {
      circumstance: 'Work-related incident',
      date: '2025-01-01',
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
  environmental: {
    home: {},
    work: {},
    community: {}
  }
} as const;