import { demographicsSection } from './components/ReportGeneration/services/templates/demographics';
import { AssessmentData } from './types/assessment';

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

async function runTest() {
    try {
        console.log("Generating demographics section...");
        const result = await demographicsSection.generate(testData);
        console.log("\nResult:\n");
        console.log(result);
    } catch (error) {
        console.error("Error:", error);
    }
}

runTest();