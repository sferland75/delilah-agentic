export interface ClientInfo {
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
}

export interface MedicalInfo {
    preAccident: string[];
    injury: {
        mechanism: string;
        nature: string[];
        recovery: string;
    };
    currentTeam: Array<{
        provider: string;
        specialty: string;
        lastAppointment: string;
        nextAppointment: string;
        frequency: string;
    }>;
    medications: Array<{
        name: string;
        dosage: string;
        frequency: string;
        purpose: string;
    }>;
}

export interface Symptoms {
    physical: Array<{
        location: string;
        description: string;
        painRating?: string;
    }>;
    cognitive: string[];
    emotional: string[];
    management: string[];
}

export interface IHAData {
    clientInfo: ClientInfo;
    medicalInfo: MedicalInfo;
    symptoms: Symptoms;
    functionalAssessment: import('./assessment').FunctionalAssessmentData;
    adl: {
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
    };
}
