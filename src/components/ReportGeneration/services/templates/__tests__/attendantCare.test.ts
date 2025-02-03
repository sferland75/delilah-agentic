import { attendantCareSection } from '../attendantCare';
import { ReportGenerator, ReportTemplate } from '../../reportTemplateSystem';
import { baseAssessmentData } from './testData';
import { AssessmentData } from '../../../../../types/assessment';

describe('Attendant Care Section Generation', () => {
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
    sections: [attendantCareSection]
  };

  const sampleData: AssessmentData = {
    ...baseAssessmentData,
    assessment: {
      ...baseAssessmentData.assessment,
      care: {
        personalCare: {
          type: "Personal support worker assistance",
          frequency: "3 times per week",
          notes: "Assistance with bathing, dressing, and transfers"
        }
      },
      adl: {
        ...baseAssessmentData.assessment.adl,
        basic: {
          bathing: {
            shower: {
              independence: "maximal_assistance",
              notes: "Requires hands-on assistance for safety"
            },
            grooming: {
              independence: "moderate_assistance",
              notes: "Help with upper body grooming"
            }
          },
          dressing: {
            lower_body: {
              independence: "maximal_assistance",
              notes: "Cannot dress lower body independently"
            }
          }
        }
      }
    }
  };

  test('generates attendant care section with required headers', async () => {
    const generator = new ReportGenerator(template, sampleData);
    const report = await generator.generateReport();
    
    expect(report).toContain('ATTENDANT CARE NEEDS');
    expect(report).toContain('CURRENT CARE ARRANGEMENTS');
  });

  test('includes care frequency and type', async () => {
    const generator = new ReportGenerator(template, sampleData);
    const report = await generator.generateReport();
    
    expect(report).toContain('3 times per week');
    expect(report).toContain('Personal support worker assistance');
  });

  test('describes ADL assistance needs', async () => {
    const generator = new ReportGenerator(template, sampleData);
    const report = await generator.generateReport();
    
    expect(report).toContain('Maximal Assistance Required');
    expect(report).toContain('Requires hands-on assistance');
  });

  test('handles missing data gracefully', async () => {
    const incompleteData: AssessmentData = {
      ...baseAssessmentData,
      assessment: {
        ...baseAssessmentData.assessment,
        care: {
          personalCare: {
            type: "",
            frequency: "",
            notes: ""
          }
        }
      }
    };

    const generator = new ReportGenerator(template, incompleteData);
    const report = await generator.generateReport();
    
    expect(report).toContain('No current attendant care arrangements');
    expect(report).not.toContain('undefined');
  });
});
