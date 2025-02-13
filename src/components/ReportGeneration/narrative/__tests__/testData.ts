export const sampleAssessment = {
    metadata: {
        version: "1.0",
        exportDate: "2025-01-14T18:19:50.207Z"
    },
    assessment: {
        demographics: {
            firstName: "John",
            lastName: "Doe"
        },
        symptoms: {
            physical: [
                {
                    location: "Lower back",
                    painType: "Aching",
                    severity: "Moderate",
                    frequency: "Daily",
                    aggravating: "Prolonged sitting, bending",
                    relieving: "Rest, changing positions"
                },
                {
                    location: "Right shoulder",
                    painType: "Sharp",
                    severity: "Severe",
                    frequency: "Intermittent",
                    aggravating: "Overhead reaching",
                    relieving: "Ice, rest"
                }
            ]
        },
        medicalHistory: {
            medications: [
                {
                    name: "Ibuprofen",
                    dosage: "400mg",
                    frequency: "As needed",
                    purpose: "Pain management"
                }
            ],
            currentTreatment: [
                {
                    providerType: "pt",
                    name: "John Smith",
                    frequency: "Weekly",
                    focus: "Strength and mobility"
                }
            ]
        },
        functionalAssessment: {
            transfers: {
                bedMobility: "Modified Independent",
                toileting: "Independent",
                showering: "Modified Independent"
            }
        },
        adl: {
            basic: {
                transfers: {
                    bed_transfer: {
                        independence: "Modified Independent",
                        notes: "Using bed rail"
                    },
                    toilet_transfer: {
                        independence: "Independent"
                    },
                    shower_transfer: {
                        independence: "Modified Independent",
                        notes: "Using grab bars"
                    }
                }
            }
        }
    }
};