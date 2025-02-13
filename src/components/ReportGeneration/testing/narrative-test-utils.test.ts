import { createNarrativeTestData, validateNarrativeOutput, commonNarrativeExpectations } from './narrative-test-utils';
import { createNarrativeTestContext } from './narrative-test-setup';

describe('Narrative Test Utilities', () => {
    describe('createNarrativeTestData', () => {
        it('creates default test data', () => {
            const data = createNarrativeTestData();
            expect(data.symptoms).toBeDefined();
            expect(data.medications).toBeDefined();
            expect(data.timeline).toBeDefined();
            expect(data.adl).toBeDefined();
        });

        it('allows data overrides', () => {
            const data = createNarrativeTestData({
                symptoms: {
                    physical: [{
                        location: 'neck',
                        severity: 'mild',
                        frequency: 'occasional',
                        temporalPattern: 'evening pain',
                        impact: ['affects sleep']
                    }]
                }
            });

            expect(data.symptoms.physical[0].location).toBe('neck');
            expect(data.symptoms.physical[0].severity).toBe('mild');
        });
    });

    describe('validateNarrativeOutput', () => {
        const sampleNarrative = `
            John Doe presents with moderate lower back pain.
            Initially injured during work activities, they have subsequently
            shown improvement with current treatment.
            
            Treatment includes Ibuprofen for pain management,
            with modified independence in most activities.
            
            Patient demonstrates appropriate use of compensatory
            strategies and modified techniques for ADLs.
        `.trim();

        it('validates content inclusions', () => {
            expect(() => validateNarrativeOutput(sampleNarrative, {
                ...commonNarrativeExpectations,
                content: {
                    includes: ['John Doe', 'lower back', 'Ibuprofen']
                }
            })).not.toThrow();
        });

        it('validates content exclusions', () => {
            expect(() => validateNarrativeOutput(sampleNarrative, {
                ...commonNarrativeExpectations,
                content: {
                    includes: [],
                    excludes: ['bad', 'normal', 'problems']
                }
            })).not.toThrow();
        });

        it('validates temporal patterns', () => {
            expect(() => validateNarrativeOutput(sampleNarrative, {
                ...commonNarrativeExpectations,
                content: {
                    includes: [],
                    patterns: [/initially.*subsequently.*current/i]
                }
            })).not.toThrow();
        });

        it('throws on missing required content', () => {
            expect(() => validateNarrativeOutput(sampleNarrative, {
                ...commonNarrativeExpectations,
                content: {
                    includes: ['content that does not exist']
                }
            })).toThrow();
        });
    });

    describe('createNarrativeTestContext', () => {
        it('creates context with default features', () => {
            const { context } = createNarrativeTestContext();
            expect(context.features.enableNarrative).toBe(true);
            expect(context.features.enableContextualAnalysis).toBe(true);
        });

        it('allows feature overrides', () => {
            const { context } = createNarrativeTestContext({
                features: {
                    enableNarrative: false
                }
            });
            expect(context.features.enableNarrative).toBe(false);
        });

        it('creates valid assessment data', () => {
            const { rawAssessment } = createNarrativeTestContext();
            expect(rawAssessment.demographics).toBeDefined();
            expect(rawAssessment.symptoms).toBeDefined();
            expect(rawAssessment.medicalHistory).toBeDefined();
        });

        it('integrates custom data into assessment', () => {
            const { rawAssessment } = createNarrativeTestContext({
                data: {
                    symptoms: {
                        physical: [{
                            location: 'neck',
                            severity: 'mild',
                            frequency: 'occasional',
                            temporalPattern: 'evening pain',
                            impact: ['affects sleep']
                        }]
                    }
                }
            });

            expect(rawAssessment.symptoms.physical[0].location).toBe('neck');
        });
    });
});