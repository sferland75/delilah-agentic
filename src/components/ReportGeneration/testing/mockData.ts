import { Assessment, AgentContext } from '../../../types/report';

export const createMockContext = (overrides: Partial<AgentContext> = {}): AgentContext => ({
    config: {
        detailLevel: 'standard',
        validateData: true,
        formatPreference: 'clinical',
        includeMetrics: true,
        ...overrides.config
    },
    features: {
        enableNarrative: true,
        enableContextualAnalysis: true,
        enableDetailedFormatting: true,
        ...overrides.features
    }
});

export const mockAssessmentData: Assessment = {
    id: 'test-123',
    date: '2025-01-26',
    demographics: {
        firstName: 'John',
        lastName: 'Doe',
        emergencyContact: {
            name: 'Jane Doe',
            phone: '555-0123',
            relationship: 'Spouse'
        }
    },
    functionalAssessment: {
        mobility: {
            walkingDistance: 100,
            assistiveDevices: ['Cane'],
            restrictions: ['No running'],
            balance: {
                score: 45,
                category: 'moderate risk',
                deficits: ['tandem stance', 'single leg stance']
            }
        },
        bergBalance: {
            totalScore: 45,
            items: {
                sittingBalance: 4,
                standingBalance: 3,
                transferring: 4
            }
        }
    },
    symptoms: {
        physical: [{
            location: 'lower back',
            severity: 'moderate',
            frequency: 'frequent',
            painType: 'aching',
            temporalPattern: 'worse in mornings',
            aggravating: 'prolonged sitting',
            relieving: 'movement and stretching',
            impact: ['difficulty with prolonged sitting', 'limits bending']
        }],
        cognitive: [{
            type: 'memory',
            severity: 'mild',
            frequency: 'occasional',
            impact: ['difficulty recalling recent events']
        }],
        emotional: [{
            type: 'anxiety',
            severity: 'moderate',
            frequency: 'frequent',
            impact: ['increased with physical activities']
        }]
    },
    adl: {
        feeding: { 
            independence: 'independent',
            comments: 'No difficulties noted'
        },
        bathing: { 
            independence: 'modified independent', 
            modifications: ['grab bars', 'shower chair'],
            comments: 'Uses equipment for safety'
        },
        dressing: { 
            independence: 'independent',
            comments: 'Some difficulty with socks'
        },
        toileting: { 
            independence: 'modified independent',
            modifications: ['raised toilet seat', 'grab bars'],
            comments: 'Uses equipment for safety'
        },
        transfers: { 
            independence: 'modified independent', 
            modifications: ['uses grab bars'],
            comments: 'Requires extra time'
        }
    },
    environmental: {
        propertyType: 'house',
        rooms: [
            {
                name: 'Bathroom',
                modifications: ['grab bars', 'raised toilet'],
                concerns: ['slippery when wet']
            },
            {
                name: 'Bedroom',
                modifications: ['bed rail'],
                concerns: []
            }
        ],
        safety: {
            hazards: ['loose rugs', 'poor lighting'],
            recommendations: ['remove rugs', 'install brighter bulbs']
        }
    },
    documentation: {
        sources: ['Medical records', 'Patient interview'],
        gaps: [],
        reliability: 'good',
        notes: 'Patient is consistent and engaged in assessment'
    },
    medicalHistory: {
        injury: {
            date: '2025-01-01',
            mechanism: 'Work-related incident',
            diagnosis: ['Lumbar strain'],
            impactAreas: ['Work', 'ADLs'],
            details: 'Injury occurred while lifting'
        },
        treatments: [{
            type: 'Physical Therapy',
            provider: 'ABC Clinic',
            frequency: 'Weekly',
            duration: '6 weeks',
            response: 'Moderate improvement'
        }],
        medications: [{
            name: 'Ibuprofen',
            dosage: '400mg',
            frequency: 'As needed',
            purpose: 'Pain management',
            response: 'Effective for acute pain'
        }],
        procedures: [],
        currentTreatment: [{
            type: 'Physical Therapy',
            provider: 'ABC Clinic',
            frequency: 'Weekly',
            goals: ['Improve strength', 'Increase mobility']
        }]
    },
    typicalDay: {
        routines: {
            morning: [
                'Self-care activities with modifications',
                'Light stretching',
                'Breakfast preparation'
            ],
            afternoon: [
                'Short walks',
                'Rest periods',
                'Light household tasks'
            ],
            evening: [
                'Family time',
                'Relaxation',
                'Pain management routine'
            ]
        },
        barriers: [
            'Morning stiffness',
            'Fatigue by afternoon',
            'Pain with prolonged activity'
        ]
    },
    amaGuides: {
        activities: {
            self: {
                class: 1,
                description: 'Modified independent in self-care',
                limitations: ['Requires extended time', 'Uses assistive devices'],
                impairmentRating: 5
            },
            life: {
                class: 1,
                description: 'Modified participation in life activities',
                limitations: ['Avoids heavy lifting', 'Paces activities'],
                impairmentRating: 8
            },
            travel: {
                class: 1,
                description: 'Independent in community mobility',
                limitations: ['Takes frequent breaks', 'Avoids long trips'],
                impairmentRating: 3
            }
        },
        impairments: {
            physical: [
                {
                    region: 'lumbar spine',
                    rating: 8,
                    rationale: 'ROM limitations and pain'
                }
            ],
            mental: [
                {
                    type: 'cognitive',
                    rating: 2,
                    rationale: 'Mild memory deficits'
                }
            ]
        },
        combinedRating: 12
    }
};

export const mockProcessedData = {
    valid: true,
    data: mockAssessmentData,
    errors: [],
    metadata: {
        processedAt: new Date().toISOString(),
        version: '1.0.0'
    }
};

// Helper function to create variations of the mock data
export const createMockData = (overrides: Partial<Assessment> = {}): Assessment => ({
    ...mockAssessmentData,
    ...overrides
});