import { functionalAssessmentSection } from '../functionalAssessment';
import { ReportGenerator, ReportTemplate } from '../../reportTemplateSystem';
import { baseAssessmentData } from './testData';
import { AssessmentData } from '../../../../../types/assessment';

describe('Functional Assessment Section Generation', () => {
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
    sections: [functionalAssessmentSection]
  };

  const sampleData: AssessmentData = {
    ...baseAssessmentData,
    assessment: {
      ...baseAssessmentData.assessment,
      functionalAssessment: {
        rangeOfMotion: {
          measurements: [
            {
              joint: "Cervical",
              movement: "Flexion",
              normalROM: "50°",
              left: {
                active: "35°",
                passive: "40°"
              },
              right: {
                active: "35°",
                passive: "40°"
              },
              painRight: true,
              painLeft: true,
              notes: "Pain at end range"
            }
          ],
          generalNotes: "All movements limited by pain"
        },
        manualMuscleTesting: {
          grades: {
            "cervical_flexion": "4/5",
            "cervical_extension": "4/5"
          },
          generalNotes: "General weakness noted"
        },
        bergBalance: {
          items: {
            "sitting_to_standing": {
              score: 3,
              notes: "Uses hands"
            }
          },
          totalScore: 45,
          generalNotes: "Fair balance"
        },
        posturalTolerances: {
          standing: "30 minutes maximum",
          walking: "15 minutes maximum"
        },
        transfers: {
          bed: {
            independence: "Modified Independent",
            notes: "Uses bed rail"
          },
          toilet: {
            independence: "Modified Independent",
            notes: "Uses grab bars"
          }
        }
      }
    }
  };

  test('generates functional assessment section with required headers', async () => {
    const generator = new ReportGenerator(template, sampleData);
    const report = await generator.generateReport();
    
    expect(report).toContain('FUNCTIONAL ASSESSMENT');
    expect(report).toContain('RANGE OF MOTION');
    expect(report).toContain('MANUAL MUSCLE TESTING');
    expect(report).toContain('BERG BALANCE SCALE');
  });

  test('includes ROM measurements', async () => {
    const generator = new ReportGenerator(template, sampleData);
    const report = await generator.generateReport();
    
    sampleData.assessment.functionalAssessment.rangeOfMotion.measurements.forEach(measurement => {
      expect(report).toContain(measurement.joint);
      expect(report).toContain(measurement.movement);
      if (measurement.left) {
        expect(report).toContain(measurement.left.active);
      }
    });
  });

  test('includes MMT grades', async () => {
    const generator = new ReportGenerator(template, sampleData);
    const report = await generator.generateReport();
    
    Object.values(sampleData.assessment.functionalAssessment.manualMuscleTesting.grades).forEach(grade => {
      expect(report).toContain(grade);
    });
  });

  test('includes Berg Balance scores', async () => {
    const generator = new ReportGenerator(template, sampleData);
    const report = await generator.generateReport();
    
    expect(report).toContain('Total Score: 45');
    const { items } = sampleData.assessment.functionalAssessment.bergBalance;
    Object.values(items).forEach(item => {
      expect(report).toContain(item.notes);
    });
  });
});
