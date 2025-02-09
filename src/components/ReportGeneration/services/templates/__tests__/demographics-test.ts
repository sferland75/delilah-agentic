import { demographicsSection } from '../demographics';
import { AssessmentData } from '../../../../../types/assessment';

describe('Demographics Section', () => {
  const testData: AssessmentData = {
    clientInfo: {
      name: "Patrick Anderson",
      dob: "1962-01-02",
      dol: "2024-01-15",
      address: "3651 Maple Avenue, Prescott ON K0E 1T0",
      phone: "(613) 925-2216",
      lawyer: {
        name: "Sarah Johnson",
        firm: "Johnson & Associates"
      },
      insurance: {
        adjuster: "Michael Brown",
        company: "Reliable Insurance Co.",
        claimNumber: "CLM123456"
      }
    },
    medicalHistory: {
      preAccident: [],
      injury: {
        mechanism: "",
        nature: [],
        recovery: ""
      },
      medications: [],
      currentTreatment: []
    },
    functionalAssessment: {
      rangeOfMotion: {
        measurements: [],
        generalNotes: ""
      },
      tolerances: {
        sitting: "",
        standing: "",
        walking: "",
        lifting: ""
      },
      transfers: {},
      overallNotes: "",
      recommendations: []
    },
    adl: {
      selfCare: {
        preAccident: "",
        current: ""
      },
      homeManagement: [],
      leisure: {
        preAccident: [],
        current: []
      },
      work: {
        preAccident: {
          status: ""
        },
        current: {
          status: ""
        }
      }
    },
    environment: {
      type: "",
      rooms: [],
      accessibility: {
        entrance: "",
        stairs: "",
        bathroom: "",
        bedroom: ""
      }
    }
  };

  it('generates demographics section correctly', async () => {
    const result = await demographicsSection.generate(testData);
    console.log('Generated Demographics Section:');
    console.log(result);
    expect(result).toContain('Patrick Anderson');
    expect(result).toContain('1962-01-02');
  });
});