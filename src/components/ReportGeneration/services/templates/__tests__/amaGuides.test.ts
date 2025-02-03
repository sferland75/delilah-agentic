import { amaGuidesSection } from '../amaGuides';
import { ReportGenerator, ReportTemplate } from '../../reportTemplateSystem';
import { baseAssessmentData } from './testData';
import { AssessmentData } from '../../../../../types/assessment';

describe('AMA Guides Section Generation', () => {
  const sampleData: AssessmentData = {
    ...baseAssessmentData,
    assessment: {
      ...baseAssessmentData.assessment,
      amaGuides: {
        narrative: "Based on the AMA Guides to the Evaluation of Permanent Impairment, 6th Edition, the client presents with the following impairments: cervical spine (DRE Category II - 5-8% whole person impairment), lumbar spine (DRE Category II - 5-8% whole person impairment)."
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
    sections: [amaGuidesSection]
  };

  test('generates AMA Guides section with required headers', async () => {
    const generator = new ReportGenerator(template, sampleData);
    const report = await generator.generateReport();
    
    expect(report).toContain('AMA GUIDES ASSESSMENT');
  });

  test('includes impairment ratings and narrative', async () => {
    const generator = new ReportGenerator(template, sampleData);
    const report = await generator.generateReport();
    
    expect(report).toContain('cervical spine');
    expect(report).toContain('5-8% whole person impairment');
  });

  test('handles missing data gracefully', async () => {
    const incompleteData: AssessmentData = {
      ...baseAssessmentData,
      assessment: {
        ...baseAssessmentData.assessment,
        amaGuides: {
          narrative: ""
        }
      }
    };

    const generator = new ReportGenerator(template, incompleteData);
    const report = await generator.generateReport();
    
    expect(report).toContain('No AMA Guides assessment completed');
    expect(report).not.toContain('undefined');
  });
});
