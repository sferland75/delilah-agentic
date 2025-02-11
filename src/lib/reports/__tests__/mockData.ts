export const mockAssessment = {
  initial: {
    demographics: {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1985-06-15',
      phone: '416-555-0123',
      email: 'john.doe@email.com',
      streetAddress: '123 Main Street',
      city: 'Toronto',
      postalCode: 'M5V 2T6'
    },
    assessment: {
      date: '2025-01-15',
      location: 'Client\'s Home',
      duration: '3 hours',
      referralSource: 'Dr. Smith',
      claimNumber: 'AB12345',
      insuranceCompany: 'Sample Insurance Co.',
      dateOfLoss: '2024-12-01'
    }
  },
  medical: {
    injury: {
      circumstance: 'Motor vehicle accident - rear-end collision',
      date: '2024-12-01',
      description: 'Client was stopped at red light when struck from behind',
      notes: 'Immediate onset of neck and back pain'
    },
    treatments: [
      {
        providerName: 'Dr. Johnson',
        profession: 'Physiotherapist',
        frequency: 'Twice weekly',
        focus: 'Neck and upper back rehabilitation'
      },
      {
        providerName: 'Dr. Wilson',
        profession: 'Chiropractor',
        frequency: 'Weekly',
        focus: 'Lower back treatment'
      }
    ],
    medications: [
      {
        name: 'Naproxen',
        dosage: '500mg',
        frequency: 'Twice daily',
        purpose: 'Pain management'
      },
      {
        name: 'Cyclobenzaprine',
        dosage: '10mg',
        frequency: 'At bedtime',
        purpose: 'Muscle relaxant'
      }
    ]
  },
  symptoms: {
    physical: [
      {
        location: 'Neck',
        description: 'Sharp pain with movement',
        severity: '7/10',
        frequency: 'Constant',
        aggravating: 'Looking down, computer work',
        alleviating: 'Rest, heat'
      },
      {
        location: 'Lower back',
        description: 'Dull ache',
        severity: '5/10',
        frequency: 'Intermittent',
        aggravating: 'Prolonged sitting',
        alleviating: 'Walking, stretching'
      }
    ],
    cognitive: [
      {
        description: 'Difficulty concentrating',
        impact: 'Affects work performance',
        management: 'Frequent breaks'
      }
    ],
    emotional: [
      {
        description: 'Anxiety about driving',
        impact: 'Avoids highway travel',
        management: 'Counseling sessions'
      }
    ]
  },
  functional: {
    tolerances: {
      standing: '20 minutes',
      walking: '30 minutes',
      sitting: '45 minutes'
    },
    mobility: {
      gait: 'Normal with occasional guarding',
      balance: 'Within normal limits',
      stairs: 'Managing with handrail'
    },
    transfers: {
      bed: 'Independent with mild difficulty',
      chair: 'Independent',
      vehicle: 'Modified technique'
    },
    presentation: 'Client presents with guarded posture and reduced cervical range'
  },
  typicalDay: {
    preAccident: {
      morning: ['Early gym workout', 'Commute to work', 'Office work'],
      afternoon: ['Lunch break walk', 'Meetings', 'Computer work'],
      evening: ['Shopping/errands', 'House chores', 'Social activities']
    },
    current: {
      morning: ['Light stretching', 'Work from home', 'Frequent breaks'],
      afternoon: ['Short walk', 'Limited computer work', 'Rest periods'],
      evening: ['Basic meal prep', 'Essential chores', 'TV/rest']
    }
  },
  environmental: {
    property: {
      type: 'Two-story house',
      access: 'Three front steps with railing',
      layout: 'Bedroom and full bath on main floor'
    },
    rooms: [
      {
        type: 'Bedroom',
        floorCovering: 'Carpet',
        furniture: 'Adjustable bed, ergonomic chair',
        challenges: 'Limited space for exercises'
      },
      {
        type: 'Kitchen',
        floorCovering: 'Tile',
        furniture: 'Standard height counters',
        challenges: 'Reaching upper cabinets'
      }
    ],
    hazards: ['Throw rugs in hallway', 'Poor lighting on stairs'],
    recommendations: ['Remove throw rugs', 'Install additional lighting']
  }
};

export const mockGeneratedSections = {
  demographics: {
    title: 'Demographics & Background',
    content: 'Mock demographics content...',
    subsections: {
      personal: 'Client information',
      assessment: 'Assessment details',
      fileInfo: 'Claim information'
    }
  },
  medical: {
    title: 'Medical History',
    content: 'Mock medical history content...',
    subsections: {
      preAccident: 'Pre-accident status',
      injury: 'Injury details',
      treatment: 'Current treatment',
      medications: 'Current medications'
    }
  }
};

export const mockProgress = {
  demographics: {
    section: 'Demographics',
    progress: 100,
    status: 'complete'
  },
  medical: {
    section: 'Medical History',
    progress: 50,
    status: 'processing'
  }
};