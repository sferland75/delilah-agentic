import { adlSection } from '../adl';
import { ReportGenerator, ReportTemplate } from '../../reportTemplateSystem';
import { baseAssessmentData } from './testData';
import { AssessmentData } from '../../../../../types/assessment';

describe('ADL Section Generation', () => {
  const sampleData: AssessmentData = {
    ...baseAssessmentData,
    assessment: {
      ...baseAssessmentData.assessment,
      adl: {
        basic: {
          bathing: {
            shower: {
              independence: "modified_independent",
              notes: "Requires grab bars and shower chair"
            },
            grooming: {
              independence: "modified_independent",
              notes: "Cannot apply deodorant"
            }
          },
          dressing: {
            lower_body: {
              independence: "maximal_assistance",
              notes: "Needs help with socks x2"
            },
            footwear: {
              independence: "maximal_assistance",
              notes: "Use long-handled shoe horn"
            }
          },
          transfers: {
            bed_transfer: {
              independence: "independent",
              notes: ""
            },
            toilet_transfer: {
              independence: "modified_independent",
              notes: "Has a comfort height toilet"
            }
          }
        },
        iadl: {
          household: {
            cleaning: {
              independence: "not_applicable",
              notes: ""
            },
            home_maintenance: {
              independence: "independent",
              notes: "Maintains 3 acres of property"
            }
          },
          community: {
            transportation: {
              independence: "independent",
              notes: "Can only drive 20-30 minutes"
            }
          }
        },
        work: {
          status: {
            current_status: {
              notes: "Unable to return to previous employment"
            },
            barriers: {
              notes: "Physical limitations prevent return to work"
            }
          }
        }
      }
    }
  };

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
    sections: [adlSection]
  };

  test('generates complete ADL section', async () => {
    const generator = new ReportGenerator(template, sampleData);
    const report = await generator.generateReport();
    
    expect(report).toContain('ACTIVITIES OF DAILY LIVING');
    expect(report).toContain('BASIC ACTIVITIES OF DAILY LIVING');
    expect(report).toContain('INSTRUMENTAL ACTIVITIES OF DAILY LIVING');
    expect(report).toContain('WORK STATUS');
  });

  // ... rest of the tests remain the same but using async/await ...
});