import { medicalCourseSection } from '../medicalCourse';
import { ReportGenerator, ReportTemplate } from '../../reportTemplateSystem';
import { baseAssessmentData } from './testData';
import { AssessmentData } from '../../../../../types/assessment';

describe('Medical Course Section Generation', () => {
  const sampleData: AssessmentData = {
    ...baseAssessmentData,
    assessment: {
      ...baseAssessmentData.assessment,
      medicalHistory: {
        ...baseAssessmentData.assessment.medicalHistory,
        preExisting: "Hypertension, well-controlled",
        injury: {
          position: "Driver's seat",
          circumstance: "Rear-end collision",
          immediateResponse: "Immediate neck pain",
          subsequentCare: "Emergency department visit"
        },
        surgeries: "None",
        currentTreatment: [
          {
            providerType: "Family Physician",
            name: "Dr. Smith",
            frequency: "Monthly",
            focus: "Pain management"
          }
        ],
        treatments: ["Physiotherapy", "Massage therapy"]
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
    sections: [medicalCourseSection]
  };

  test('includes injury details', async () => {
    const generator = new ReportGenerator(template, sampleData);
    const report = await generator.generateReport();
    
    expect(report).toContain("Driver's seat");
    expect(report).toContain("Rear-end collision");
  });

  test('includes current treatment', async () => {
    const generator = new ReportGenerator(template, sampleData);
    const report = await generator.generateReport();
    
    expect(report).toContain("Dr. Smith");
    expect(report).toContain("Monthly");
    expect(report).toContain("Pain management");
  });

  test('includes treatment history', async () => {
    const generator = new ReportGenerator(template, sampleData);
    const report = await generator.generateReport();
    
    expect(report).toContain("Physiotherapy");
    expect(report).toContain("Massage therapy");
  });

  test('handles missing data gracefully', async () => {
    const incompleteData: AssessmentData = {
      ...baseAssessmentData,
      assessment: {
        ...baseAssessmentData.assessment,
        medicalHistory: {
          ...baseAssessmentData.assessment.medicalHistory,
          injury: {},
          currentTreatment: []
        }
      }
    };

    const generator = new ReportGenerator(template, incompleteData);
    const report = await generator.generateReport();
    
    expect(report).toContain("No current treatment providers");
    expect(report).not.toContain("undefined");
  });
});
