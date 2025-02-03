import { currentTreatmentSection } from '../currentTreatment';
import { ReportGenerator, ReportTemplate } from '../../reportTemplateSystem';
import { baseAssessmentData } from './testData';
import { AssessmentData } from '../../../../../types/assessment';

describe('Current Treatment Section Generation', () => {
  const sampleData: AssessmentData = {
    ...baseAssessmentData,
    assessment: {
      ...baseAssessmentData.assessment,
      medicalHistory: {
        ...baseAssessmentData.assessment.medicalHistory,
        medications: [
          {
            name: "Esomeprazole",
            dosage: "40 mg",
            frequency: "Twice daily",
            purpose: "Stomach"
          },
          {
            name: "Silodocin",
            dosage: "8 mg",
            frequency: "Daily",
            purpose: "Prostate"
          },
          {
            name: "Nabilone",
            dosage: "1 mg",
            frequency: "As-needed",
            purpose: "Sleep"
          }
        ],
        currentTreatment: [
          {
            providerType: "Family Physician",
            name: "Dr. Smith",
            frequency: "Monthly",
            focus: "Medication management"
          },
          {
            providerType: "Physiotherapist",
            name: "Jane Doe",
            frequency: "Weekly",
            focus: "Manual therapy and exercise"
          }
        ]
      }
    }
  };

  const template: ReportTemplate = {
    metadata: {
      version: "1.0",
      dateGenerated: new Date().toISOString(),
      assessor: {
        name: "Test Assessor",
        credentials: "OT Reg.",
        contact: {
          phone: "123-456-7890",
          email: "test@example.com"
        }
      },
      client: {
        firstName: "John",
        lastName: "Doe",
        dateOfBirth: "1970-01-01",
        dateOfLoss: "2023-01-01"
      }
    },
    sections: [currentTreatmentSection]
  };

  test('generates treatment section with required headers', async () => {
    const generator = new ReportGenerator(template, sampleData);
    const report = await generator.generateReport();
    
    expect(report).toContain('CURRENT MEDICAL AND REHABILITATION TEAM');
    expect(report).toContain('CURRENT MEDICATIONS');
  });

  test('includes current medications', async () => {
    const generator = new ReportGenerator(template, sampleData);
    const report = await generator.generateReport();
    
    sampleData.assessment.medicalHistory.medications.forEach(med => {
      expect(report).toContain(med.name);
      expect(report).toContain(med.dosage);
    });
  });

  test('includes healthcare providers', async () => {
    const generator = new ReportGenerator(template, sampleData);
    const report = await generator.generateReport();
    
    sampleData.assessment.medicalHistory.currentTreatment.forEach(provider => {
      expect(report).toContain(provider.name);
      expect(report).toContain(provider.providerType);
    });
  });

  test('handles missing data gracefully', async () => {
    const incompleteData: AssessmentData = {
      ...baseAssessmentData,
      assessment: {
        ...baseAssessmentData.assessment,
        medicalHistory: {
          ...baseAssessmentData.assessment.medicalHistory,
          medications: [],
          currentTreatment: []
        }
      }
    };

    const generator = new ReportGenerator(template, incompleteData);
    const report = await generator.generateReport();
    
    expect(report).toContain('No current medications reported');
    expect(report).toContain('No current healthcare providers reported');
    expect(report).not.toContain('undefined');
  });
});
