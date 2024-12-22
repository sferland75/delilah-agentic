import { describe, it, expect, beforeEach } from '@jest/globals';
import { SpecializedAssessment, SpecializedAssessmentConfig } from '../../../../src/agents/assessment/SpecializedAssessment';

describe('SpecializedAssessment', () => {
    let assessment: SpecializedAssessment;
    let config: SpecializedAssessmentConfig;

    const mockDomainRules = new Map([
        ['security', {
            patterns: [/security|vulnerability|threat/i],
            thresholds: new Map([
                ['metrics.riskScore', 0.7]
            ]),
            validations: [
                {
                    condition: (data: any) => !data.securityLevel,
                    impact: 0.3,
                    message: 'Missing security level classification'
                }
            ]
        }],
        ['performance', {
            patterns: [/performance|latency|throughput/i],
            thresholds: new Map([
                ['metrics.responseTime', 100],
                ['metrics.throughput', 1000]
            ]),
            validations: [
                {
                    condition: (data: any) => data.metrics?.responseTime > 200,
                    impact: 0.5,
                    message: 'Response time exceeds critical threshold'
                }
            ]
        }]
    ]);

    const mockValidators = new Map([
        ['dataCompleteness', async (data: any) => ({
            valid: data.required?.every((field: string) => data[field]),
            score: 1.0,
            findings: ['All required fields present']
        })]
    ]);

    beforeEach(() => {
        config = {
            domainRules: mockDomainRules,
            customValidators: mockValidators,
            confidenceWeights: {
                domainRules: 0.4,
                customValidation: 0.3,
                patternMatch: 0.3
            }
        };

        assessment = new SpecializedAssessment(config);
    });

    describe('assess', () => {
        it('should apply domain rules based on content patterns', async () => {
            const data = {
                id: 'test-1',
                content: 'Security vulnerability detected in system',
                metrics: {
                    riskScore: 0.5
                }
            };

            const result = await assessment.assess(data);

            expect(result.findings).toContain('Missing security level classification');
            expect(result.confidence.score).toBeLessThan(1);
            expect(result.confidence.factors.domainRules).toBeLessThan(1);
        });

        it('should evaluate performance metrics against thresholds', async () => {
            const data = {
                id: 'test-2',
                content: 'Performance analysis results',
                metrics: {
                    responseTime: 250,
                    throughput: 800
                }
            };

            const result = await assessment.assess(data);

            expect(result.findings).toContain('Response time exceeds critical threshold');
            expect(result.findings).toContain('metrics.throughput below threshold: 800 < 1000');
            expect(result.confidence.factors.domainRules).toBeLessThan(0.7);
        });

        it('should run custom validators', async () => {
            const data = {
                id: 'test-3',
                required: ['field1', 'field2'],
                field1: 'value1',
                field2: 'value2'
            };

            const result = await assessment.assess(data);

            expect(result.findings).toContain('All required fields present');
            expect(result.confidence.factors.customValidation).toBe(1);
        });

        it('should calculate weighted confidence scores', async () => {
            const data = {
                id: 'test-4',
                content: 'Performance and security test',
                metrics: {
                    responseTime: 150,
                    riskScore: 0.8
                },
                securityLevel: 'high'
            };

            const result = await assessment.assess(data);

            // Calculate expected confidence based on weights
            const expectedConfidence =
                1.0 * config.confidenceWeights!.domainRules +
                1.0 * config.confidenceWeights!.customValidation +
                1.0 * config.confidenceWeights!.patternMatch;

            expect(result.confidence.score).toBeCloseTo(expectedConfidence, 2);
        });

        it('should handle multiple applicable domain rules', async () => {
            const data = {
                id: 'test-5',
                content: 'Security performance analysis',
                metrics: {
                    responseTime: 90,
                    riskScore: 0.9,
                    throughput: 1200
                },
                securityLevel: 'high'
            };

            const result = await assessment.assess(data);

            expect(result.metadata.domainRulesApplied).toContain('security');
            expect(result.metadata.domainRulesApplied).toContain('performance');
            expect(result.confidence.score).toBeGreaterThan(0.8);
        });

        it('should handle missing metrics gracefully', async () => {
            const data = {
                id: 'test-6',
                content: 'Performance test',
                metrics: {}
            };

            const result = await assessment.assess(data);

            expect(result).toBeDefined();
            expect(result.findings).toBeDefined();
            expect(result.confidence.score).toBeDefined();
        });
    });
});
