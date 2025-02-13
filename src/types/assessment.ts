<<<<<<< HEAD
export enum IndependenceLevel {
    Independent = 'independent',
    ModifiedIndependent = 'modified_independent',
    Supervision = 'supervision',
    MinimalAssistance = 'minimal_assistance',
    ModerateAssistance = 'moderate_assistance',
    MaximalAssistance = 'maximal_assistance',
    Dependent = 'dependent',
    NotApplicable = 'not_applicable'
}

export interface WorkStatus {
    status: string;
    employer?: string;
    hours?: string;
    duties?: string;
    changes?: string;
    limitations?: string;
}

export interface ADLData {
    selfCare: {
        preAccident: string;
        current: string;
    };
    homeManagement: Array<{
        task: string;
        preAccident: string;
        current: string;
        timeAllotted?: string;
    }>;
    leisure: {
        preAccident: string[];
        current: string[];
    };
    work: {
        preAccident: WorkStatus;
        current: WorkStatus;
    };
}

export interface AssessmentData {
    clientInfo: {
        name: string;
        dob: string;
        dol: string;
        address: string;
        phone: string;
        lawyer: {
            name: string;
            firm: string;
        };
        insurance: {
            adjuster: string;
            company: string;
            claimNumber: string;
        };
    };
    medicalHistory: {
        preAccident: string[];
        injury: {
            mechanism: string;
            nature: string[];
            recovery: string;
        };
        medications: Array<{
            name: string;
            dosage: string;
            frequency: string;
            purpose: string;
        }>;
        currentTreatment: Array<{
            provider: string;
            specialty: string;
            frequency: string;
            lastAppointment: string;
            nextAppointment: string;
        }>;
    };
    functionalAssessment: {
        rangeOfMotion: {
            measurements: Array<{
                joint: string;
                movement: string;
                leftROM: string;
                rightROM: string;
                comments: string;
            }>;
            generalNotes: string;
        };
        tolerances: {
            sitting: string;
            standing: string;
            walking: string;
            lifting: string;
        };
        transfers: Record<string, string>;
        overallNotes: string;
        recommendations: string[];
    };
    adl: ADLData;
    environment: {
        type: string;
        rooms: Array<{
            name: string;
            quantity: number;
            location: string;
            flooring: string;
        }>;
        accessibility: {
            entrance: string;
            stairs: string;
            bathroom: string;
            bedroom: string;
        };
    };
}
=======
// Redirect to lib/validation
export * from '@/lib/validation/assessment-schema';
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
