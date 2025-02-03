import { environmentalSection } from '../environmental';
import { ReportGenerator, ReportTemplate } from '../../reportTemplateSystem';
import { baseAssessmentData } from './testData';
import { AssessmentData } from '../../../../../types/assessment';

describe('Environmental Assessment Section Generation', () => {
  const template: ReportTemplate = {
    metadata: {
      version: "1.0",
      dateGenerated: new Date().toISOString(),
      assessor: {
        name: "Sebastien Ferland",
        credentials: "OT Reg.(Ont.)",
        contact: {
          phone: "613-204-1549",
          email: "ferland@ferlandassociates.com"
        }
      },
      client: {
        firstName: "Patrick",
        lastName: "Anderson",
        dateOfBirth: "1962-01-02",
        dateOfLoss: "2023-04-28"
      }
    },
    sections: [environmentalSection]
  };

  const sampleData: AssessmentData = {
    ...baseAssessmentData,
    assessment: {
      ...baseAssessmentData.assessment,
      environmental: {
        propertyOverview: {
          recommendedModifications: [
            "Install grab bars in bathroom",
            "Add non-slip mats"
          ],
          identifiedHazards: [
            "Loose carpeting on stairs",
            "Poor lighting in hallway"
          ],
          rooms: {
            bathroom: {
              tub: "Standard height tub without grab bars",
              toilet: "Standard height toilet",
              sink: "Standard height vanity"
            },
            bedroom: {
              bed: "Queen size, standard height",
              lighting: "Adequate bedside lamp"
            }
          }
        },
        safety: {
          hazards: [
            "Inadequate lighting in stairwell",
            "No handrails on both sides of stairs"
          ],
          recommendations: [
            "Install motion-sensor lighting",
            "Add second handrail"
          ]
        }
      }
    }
  };

  test('generates environmental section with required headers', async () => {
    const generator = new ReportGenerator(template, sampleData);
    const report = await generator.generateReport();
    
    expect(report).toContain('ENVIRONMENTAL ASSESSMENT');
    expect(report).toContain('PROPERTY OVERVIEW');
    expect(report).toContain('SAFETY CONSIDERATIONS');
  });

  test('includes recommended modifications', async () => {
    const generator = new ReportGenerator(template, sampleData);
    const report = await generator.generateReport();
    
    const mods = sampleData.assessment.environmental.propertyOverview.recommendedModifications;
    if (mods) {
      mods.forEach(mod => {
        expect(report).toContain(mod);
      });
    }
  });

  test('includes identified hazards', async () => {
    const generator = new ReportGenerator(template, sampleData);
    const report = await generator.generateReport();
    
    const hazards = sampleData.assessment.environmental.propertyOverview.identifiedHazards;
    if (hazards) {
      hazards.forEach(hazard => {
        expect(report).toContain(hazard);
      });
    }
  });

  test('describes room details', async () => {
    const generator = new ReportGenerator(template, sampleData);
    const report = await generator.generateReport();
    
    const { rooms } = sampleData.assessment.environmental.propertyOverview;
    Object.values(rooms).forEach(roomDetails => {
      Object.values(roomDetails).forEach(description => {
        expect(report).toContain(description);
      });
    });
  });

  test('handles missing data gracefully', async () => {
    const incompleteData: AssessmentData = {
      ...baseAssessmentData,
      assessment: {
        ...baseAssessmentData.assessment,
        environmental: {
          propertyOverview: {
            recommendedModifications: [],
            identifiedHazards: [],
            rooms: {}
          },
          safety: {
            hazards: [],
            recommendations: []
          }
        }
      }
    };

    const generator = new ReportGenerator(template, incompleteData);
    const report = await generator.generateReport();
    
    expect(report).toContain('ENVIRONMENTAL ASSESSMENT');
    expect(report).not.toContain('undefined');
    expect(report).not.toContain('null');
  });
});
