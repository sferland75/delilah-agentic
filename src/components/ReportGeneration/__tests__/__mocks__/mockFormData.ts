import { AssessmentData } from '../../../../templates/data/assessment_data';

describe('Mock Form Data', () => {
  it('should match AssessmentData interface', () => {
    const mockData: AssessmentData = {
      assessment: {
        demographics: {
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '1990-01-01',
          gender: 'Male',
          phone: '123-456-7890',
          email: 'john@example.com',
          address: '123 Main St',
          maritalStatus: 'Single',
          emergencyContact: {
            name: 'Jane Doe',
            relationship: 'Sister',
            phone: '098-765-4321'
          }
        },
        medicalHistory: {
          diagnoses: [],
          medications: [],
          currentTreatment: [],
          treatmentHistory: []
        },
        functionalAssessment: {
          rangeOfMotion: {
            measurements: []
          },
          manualMuscleTesting: {
            grades: {}
          },
          bergBalance: {
            items: [],
            totalScore: 0
          }
        },
        adl: {
          selfCare: {
            preAccident: '',
            current: ''
          },
          homeManagement: [],
          leisure: {
            preAccident: [],
            current: []
          }
        },
        environmental: {
          propertyOverview: {
            type: '',
            layout: '',
            accessibility: '',
            recommendedModifications: [],
            identifiedHazards: [],
            rooms: {}
          }
        }
      }
    };

    expect(mockData).toBeDefined();
  });
});