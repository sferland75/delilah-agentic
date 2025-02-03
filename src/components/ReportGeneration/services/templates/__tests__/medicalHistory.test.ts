import { medicalHistorySection } from '../medicalHistory';
import { ReportGenerator, ReportTemplate } from '../../reportTemplateSystem';
import { baseAssessmentData } from './testData';
import { AssessmentData } from '../../../../../types/assessment';

describe('Medical History Section Generation', () => {
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
            purpose: "Stomach acid"
          },
          {
            name: "Silodocin",
            dosage: "8 mg",
            frequency: "Daily",
            purpose: "Prostate"
          }
        ],
        allergies: ["Penicillin", "Sulfa drugs"],
        treatments: ["Physiotherapy", "Massage therapy"],
        surgeries: "Left knee arthroscopy (2020)",
        preExisting: "Hypertension, well-controlled",
        familyHistory: "Father: Diabetes, Mother: Rheumatoid arthritis",
        currentTreatment: [
          {
            providerType: "Family Physician",
            name: "Dr. Smith",
            frequency: "Monthly",
            focus: "Medication management"
          }
        ],
        injury: {
          position: "Driver's seat",
          circumstance: "Rear-end collision",
          immediateResponse: "Immediate neck and back pain",
          subsequentCare: "Emergency department assessment"
        }
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
    sections: [medicalHistorySection]
  };

  test('generates medical history section with required headers', async () => {
    const generator = new ReportGenerator(template, sampleData);
    const report = await generator.generateReport();
    
    expect(report).toContain('MEDICAL HISTORY');
    expect(report).toContain('MEDICATIONS');
    expect(report).toContain('ALLERGIES');
  });

  test('includes current medications', async () => {
    const generator = new ReportGenerator(template, sampleData);
    const report = await generator.generateReport();
    
    expect(report).toContain('Esomeprazole 40 mg');
    expect(report).toContain('Silodocin 8 mg');
  });

  test('includes allergies and treatments', async () => {
    const generator = new ReportGenerator(template, sampleData);
    const report = await generator.generateReport();
    
    expect(report).toContain('Penicillin');
    expect(report).toContain('Physiotherapy');
  });

  test('handles missing data gracefully', async () => {
    const incompleteData: AssessmentData = {
      ...baseAssessmentData,
      assessment: {
        ...baseAssessmentData.assessment,
        medicalHistory: {
          ...baseAssessmentData.assessment.medicalHistory,
          medications: [],
          allergies: [],
          treatments: [],
          currentTreatment: []
        }
      }
    };

    const generator = new ReportGenerator(template, incompleteData);
    const report = await generator.generateReport();
    
    expect(report).toContain('No current medications reported');
    expect(report).not.toContain('undefined');
  });
});
