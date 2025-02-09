export const mockAssessmentData = {
  assessment: {
    demographics: {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1980-01-01',
      gender: 'Male',
      phone: '123-456-7890',
      email: 'john.doe@example.com',
      address: '123 Main St',
      maritalStatus: 'Single',
      emergencyContact: {
        name: 'Jane Doe',
        relationship: 'Sister',
        phone: '987-654-3210'
      }
    },
    medicalHistory: {
      diagnoses: [
        {
          condition: 'Hypertension',
          date: '2010-05-15',
          status: 'Controlled'
        }
      ],
      medications: [
        {
          name: 'Lisinopril',
          dosage: '10mg',
          frequency: 'Daily',
          purpose: 'Blood pressure'
        }
      ],
      currentTreatment: [
        {
          provider: 'Dr. Smith',
          type: 'Family Doctor',
          frequency: 'Monthly',
          notes: 'Regular checkups'
        }
      ],
      treatmentHistory: [
        'Physical therapy 2022',
        'Chiropractic care 2021'
      ]
    },
    functionalAssessment: {
      rangeOfMotion: {
        measurements: [
          {
            joint: 'Shoulder',
            movement: 'Flexion',
            range: '160 degrees',
            notes: 'Pain at end range'
          }
        ]
      },
      manualMuscleTesting: {
        grades: {
          'Shoulder Flexion': {
            grade: '4/5',
            notes: 'Slight weakness'
          }
        }
      },
      bergBalance: {
        items: [
          {
            task: 'Sitting to standing',
            score: 4,
            notes: 'Independent'
          }
        ],
        totalScore: 45
      },
      tolerances: {
        sitting: '30 minutes',
        standing: '15 minutes',
        walking: '100 meters',
        lifting: '10 pounds'
      }
    },
    adl: {
      selfCare: {
        preAccident: 'Independent in all activities',
        current: 'Needs assistance with bathing'
      },
      homeManagement: [
        {
          task: 'Cleaning',
          preAccident: 'Independent',
          current: 'Needs assistance',
          timeAllotted: '2 hours/week'
        }
      ],
      leisure: {
        preAccident: ['Swimming', 'Hiking', 'Gardening'],
        current: ['Light gardening', 'Short walks']
      },
      work: {
        preAccident: {
          occupation: 'Office Manager',
          hours: '40 hours/week',
          duties: ['Computer work', 'Filing', 'Meetings']
        },
        current: {
          status: 'Modified duties',
          limitations: ['No lifting over 10 lbs', 'Limited standing'],
          accommodations: ['Ergonomic chair', 'Standing desk']
        }
      }
    },
    environmental: {
      propertyOverview: {
        type: 'Two-story house',
        layout: 'Traditional',
        accessibility: 'Stairs to second floor',
        recommendedModifications: [
          {
            area: 'Bathroom',
            modification: 'Install grab bars',
            priority: 'High',
            cost: '$500'
          }
        ],
        identifiedHazards: [
          {
            location: 'Stairs',
            hazard: 'No handrail',
            recommendation: 'Install handrail'
          }
        ],
        rooms: {
          bathroom: {
            description: 'Standard bathroom',
            concerns: ['No grab bars', 'Slippery floor'],
            recommendations: ['Install grab bars', 'Add non-slip mat']
          }
        }
      }
    }
  }
};