import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { ReportGenerator, ReportGeneratorConfig } from '../../../src/services/ReportGenerator';
import { AgentCoordinator } from '../../../src/core/coordinator/AgentCoordinator';
import { ReportGenerationError, ReportErrorCode } from '../../../src/types';

describe('ReportGenerator', () => {
    let reportGenerator: ReportGenerator;
    let coordinator: jest.Mocked<AgentCoordinator>;
    let defaultConfig: ReportGeneratorConfig;

    const mockAnalysisResult = {
        id: 'test-analysis-1',
        timestamp: Date.now(),
        patterns: [
            {
                id: 'pattern-1',
                name: 'Test Pattern',
                type: 'behavioral',
                confidence: 0.85
            }
        ],
        confidence: {
            score: 0.85,
            factors: {
                patternCount: 1,
                assessmentConfidence: 0.9,
                patternConsistency: 0.8
            }
        },
        insights: [
            {
                patternId: 'pattern-1',
                content: 'Test insight'
            }
        ]
    };

    const mockAssessmentResult = {
        id: 'test-assessment-1',
        timestamp: Date.now(),
        confidence: {
            score: 0.9,
            factors: {
                dataCompleteness: 0.95,
                patternStrength: 0.85
            }
        },
        findings: [
            'Finding 1: Test observation',
            'Finding 2: Another observation'
        ]
    };

    beforeEach(() => {
        coordinator = {
            register: jest.fn(),
            request: jest.fn().mockImplementation((type: string) => {
                switch (type) {
                    case 'analysis-complete':
                        return Promise.resolve(mockAnalysisResult);
                    case 'assessment-result':
                        return Promise.resolve(mockAssessmentResult);
                    case 'generate-summary':
                        return Promise.resolve({ content: 'Test summary' });
                    default:
                        return Promise.resolve(null);
                }
            })
        } as any;

        defaultConfig = {
            enableAutoSummary: true,
            confidenceThreshold: 0.75
        };

        reportGenerator = new ReportGenerator(coordinator, defaultConfig);
    });

    describe('initialization', () => {
        it('should throw error for invalid template', () => {
            const invalidTemplate = {
                // Missing required fields
                sections: [{ type: 'summary' }]
            };

            expect(() => {
                new ReportGenerator(coordinator, {
                    ...defaultConfig,
                    defaultTemplate: invalidTemplate as any
                });
            }).toThrow(ReportGenerationError);
        });

        it('should validate template sections', () => {
            const templateWithInvalidSection = {
                id: 'test',
                name: 'Test Template',
                sections: [{ }] // Invalid section
            };

            expect(() => {
                new ReportGenerator(coordinator, {
                    ...defaultConfig,
                    defaultTemplate: templateWithInvalidSection as any
                });
            }).toThrow(ReportGenerationError);
        });
    });

    describe('generateReport', () => {
        it('should throw error for missing data', async () => {
            await expect(reportGenerator.generateReport({} as any))
                .rejects
                .toThrow(ReportGenerationError);
        });

        it('should handle agent communication failures', async () => {
            coordinator.request = jest.fn().mockRejectedValue(new Error('Communication error'));

            await expect(reportGenerator.generateReport({ id: 'test' }))
                .rejects
                .toThrow(ReportGenerationError);
        });

        it('should continue with partial agent results', async () => {
            coordinator.request = jest.fn().mockImplementation((type: string) => {
                if (type === 'analysis-complete') {
                    return Promise.resolve(mockAnalysisResult);
                }
                return Promise.reject(new Error('Assessment failed'));
            });

            const report = await reportGenerator.generateReport({ id: 'test' });

            expect(report).toBeDefined();
            expect(report.metadata.confidence).toBeLessThan(mockAnalysisResult.confidence.score);
        });

        it('should handle summary generation failure gracefully', async () => {
            coordinator.request = jest.fn().mockImplementation((type: string) => {
                if (type === 'generate-summary') {
                    return Promise.reject(new Error('Summary generation failed'));
                }
                return type === 'analysis-complete' 
                    ? Promise.resolve(mockAnalysisResult)
                    : Promise.resolve(mockAssessmentResult);
            });

            const report = await reportGenerator.generateReport({ id: 'test' });

            expect(report).toBeDefined();
            expect(report.summary).toBeUndefined();
            expect(report.sections.length).toBeGreaterThan(0);
        });

        it('should handle missing agent results with zero confidence', async () => {
            coordinator.request = jest.fn().mockResolvedValue(null);

            const report = await reportGenerator.generateReport({ id: 'test' });

            expect(report).toBeDefined();
            expect(report.metadata.confidence).toBe(0);
        });

        it('should include version and generator metadata', async () => {
            const report = await reportGenerator.generateReport({ id: 'test' });

            expect(report.metadata.version).toBe('1.0');
            expect(report.metadata.generatedBy).toBe('report-generator');
        });
    });

    describe('error handling', () => {
        it('should throw INVALID_TEMPLATE for malformed template', async () => {
            try {
                await reportGenerator.generateReport({ id: 'test' }, { 
                    id: 'invalid',
                    name: 'Invalid',
                    sections: [{ type: 'unknown' }]
                } as any);
                fail('Should have thrown error');
            } catch (error) {
                expect(error).toBeInstanceOf(ReportGenerationError);
                expect(error.code).toBe(ReportErrorCode.INVALID_TEMPLATE);
            }
        });

        it('should throw MISSING_DATA for incomplete data', async () => {
            const invalidData = { timestamp: Date.now() }; // Missing id

            try {
                await reportGenerator.generateReport(invalidData);
                fail('Should have thrown error');
            } catch (error) {
                expect(error).toBeInstanceOf(ReportGenerationError);
                expect(error.code).toBe(ReportErrorCode.MISSING_DATA);
            }
        });

        it('should handle section building failures gracefully', async () => {
            const template = {
                id: 'test',
                name: 'Test Template',
                sections: [
                    { type: 'summary', title: 'Summary' },
                    { type: 'invalid', title: 'Invalid' },
                    { type: 'analysis', title: 'Analysis' }
                ]
            };

            const report = await reportGenerator.generateReport({ id: 'test' }, template);

            expect(report.sections).toBeDefined();
            expect(report.sections.length).toBe(2); // Should skip invalid section
            expect(report.sections.some(s => s.type === 'invalid')).toBe(false);
        });
    });
});}