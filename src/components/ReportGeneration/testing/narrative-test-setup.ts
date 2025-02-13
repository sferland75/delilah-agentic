import { AgentContext, Assessment } from '../../../types/report';
import { createMockContext } from './mockData';
import { NarrativeTestData, createNarrativeTestData } from './narrative-test-utils';

export interface NarrativeTestContext {
    context: AgentContext;
    data: NarrativeTestData;
    rawAssessment: Assessment;
}

export interface NarrativeTestOptions {
    features?: {
        enableNarrative?: boolean;
        enableContextualAnalysis?: boolean;
        enableDetailedFormatting?: boolean;
    };
    data?: Partial<NarrativeTestData>;
    config?: Partial<AgentContext['config']>;
}

export function createNarrativeTestContext(
    options: NarrativeTestOptions = {}
): NarrativeTestContext {
    // Create base context
    const context = createMockContext({
        features: {
            enableNarrative: true,
            enableContextualAnalysis: true,
            enableDetailedFormatting: true,
            ...options.features
        },
        config: {
            detailLevel: 'standard',
            validateData: true,
            formatPreference: 'clinical',
            includeMetrics: true,
            ...options.config
        }
    });

    // Create test data
    const data = createNarrativeTestData(options.data);

    // Convert narrative test data to raw assessment format
    const rawAssessment: Assessment = {
        id: 'test-assessment',
        date: '2025-01-27',
        demographics: {
            firstName: 'John',
            lastName: 'Doe',
            dateOfBirth: '1980-01-01',
            gender: 'Male'
        },
        symptoms: {
            physical: data.symptoms.physical,
            cognitive: [],
            emotional: []
        },
        medicalHistory: {
            medications: data.medications,
            treatments: [],
            injury: {
                date: '2025-01-01',
                mechanism: 'Work-related injury',
                diagnosis: ['Lumbar strain'],
                impactAreas: ['Work', 'ADLs']
            }
        },
        adl: {
            feeding: { independence: 'independent' },
            bathing: { 
                independence: 'modified independent',
                modifications: ['grab bars', 'shower chair']
            },
            dressing: { independence: 'independent' },
            toileting: { independence: 'independent' },
            transfers: { 
                independence: 'modified independent',
                modifications: ['grab bars']
            }
        },
        environmental: {
            propertyType: 'house',
            rooms: [],
            safety: {
                hazards: [],
                recommendations: []
            }
        },
        documentation: {
            sources: [],
            gaps: [],
            reliability: 'good'
        },
        functionalAssessment: {
            mobility: {
                walkingDistance: 100,
                assistiveDevices: [],
                restrictions: []
            },
            bergBalance: {
                totalScore: 45,
                items: {}
            }
        },
        typicalDay: {
            routines: {
                morning: ['Self-care with modifications'],
                afternoon: ['Rest periods'],
                evening: ['Family time']
            }
        },
        amaGuides: {
            activities: {
                self: {
                    class: 1,
                    description: '',
                    limitations: []
                },
                life: {
                    class: 1,
                    description: '',
                    limitations: []
                },
                travel: {
                    class: 1,
                    description: '',
                    limitations: []
                }
            },
            impairments: {
                physical: [],
                mental: []
            }
        }
    };

    return {
        context,
        data,
        rawAssessment
    };
}