import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { ReportGenerator } from '../../../src/services/ReportGenerator';
import { AgentCoordinator } from '../../../src/core/coordinator/AgentCoordinator';
import { AnalysisResult, AssessmentResult, Report } from '../../../src/types';

describe('ReportGenerator', () => {
    let reportGenerator: ReportGenerator;
    let coordinator: jest.Mocked<AgentCoordinator>;

    const mockAnalysisResult: AnalysisResult = {
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

    const mockAssessmentResult: AssessmentResult = {
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

        reportGenerator = new ReportGenerator(coordinator, {
            enableAutoSummary: true,
            confidenceThreshold: 0.75
        });
    });

    describe('generateReport', () => {
        it('should generate a complete report with all sections', async () => {
            const testData = {
                id: 'test-data-1',
                source: 'test',
                content: 'Test data content'
            };

            const report = await reportGenerator.generateReport(testData);

            expect(report).toBeDefined();
            expect(report.id).toBe(testData.id);
            expect(report.sections).toHaveLength(5); // All default sections
            expect(report.metadata.confidence).toBeGreaterThan(0);

            // Verify all standard sections are present
            const sectionTypes = report.sections.map(s => s.type);
            expect(sectionTypes).toContain('summary');
            expect(sectionTypes).toContain('analysis');
            expect(sectionTypes).toContain('assessment');
            expect(sectionTypes).toContain('data');
            expect(sectionTypes).toContain('recommendations');
        });

        it('should respect custom templates', async () => {
            const customTemplate = {
                id: 'custom',
                name: 'Custom Template',
                sections: [
                    { type: 'summary', title: 'Custom Summary' },
                    { type: 'analysis', title: 'Custom Analysis' }
                ]
            };

            const testData = {
                id: 'test-data-2',
                source: 'test',
                content: 'Test data content'
            };

            const report = await reportGenerator.generateReport(testData, customTemplate);

            expect(report.sections).toHaveLength(2);
            expect(report.sections[0].title).toBe('Custom Summary');
            expect(report.sections[1].title).toBe('Custom Analysis');
        });

        it('should generate auto-summary when enabled', async () => {
            const testData = {
                id: 'test-data-3',
                source: 'test',
                content: 'Test data content'
            };

            const report = await reportGenerator.generateReport(testData);

            expect(report.summary).toBeDefined();
            expect(report.summary).toBe('Test summary');
            expect(coordinator.request).toHaveBeenCalledWith(
                'generate-summary',
                expect.any(Object)
            );
        });

        it('should calculate overall confidence correctly', async () => {
            const testData = {
                id: 'test-data-4',
                source: 'test',
                content: 'Test data content'
            };

            const report = await reportGenerator.generateReport(testData);

            // Analysis confidence (0.85) * 0.6 + Assessment confidence (0.9) * 0.4
            const expectedConfidence = 0.85 * 0.6 + 0.9 * 0.4;
            expect(report.metadata.confidence).toBeCloseTo(expectedConfidence, 2);
        });

        it('should handle missing agent results gracefully', async () => {
            coordinator.request = jest.fn().mockResolvedValue(null);

            const testData = {
                id: 'test-data-5',
                source: 'test',
                content: 'Test data content'
            };

            const report = await reportGenerator.generateReport(testData);

            expect(report).toBeDefined();
            expect(report.sections).toBeDefined();
            expect(report.metadata.confidence).toBe(0);
        });
    });

    describe('section generation', () => {
        it('should build valid summary section', async () => {
            const testData = {
                id: 'test-data-6',
                source: 'test',
                content: 'Test data content'
            };

            const report = await reportGenerator.generateReport(testData);
            const summarySection = report.sections.find(s => s.type === 'summary');

            expect(summarySection).toBeDefined();
            expect(summarySection?.content).toHaveLength(2);
            expect(summarySection?.content[0].type).toBe('text');
            expect(summarySection?.content[1].type).toBe('metrics');
        });

        it('should filter low confidence patterns in analysis section', async () => {
            const lowConfidenceResult = {
                ...mockAnalysisResult,
                patterns: [
                    ...mockAnalysisResult.patterns,
                    {
                        id: 'pattern-2',
                        name: 'Low Confidence Pattern',
                        type: 'behavioral',
                        confidence: 0.5
                    }
                ]
            };

            coordinator.request = jest.fn().mockImplementation((type: string) => {
                if (type === 'analysis-complete') {
                    return Promise.resolve(lowConfidenceResult);
                }
                return Promise.resolve(mockAssessmentResult);
            });

            const testData = {
                id: 'test-data-7',
                source: 'test',
                content: 'Test data content'
            };

            const report = await reportGenerator.generateReport(testData);
            const analysisSection = report.sections.find(s => s.type === 'analysis');
            const patterns = analysisSection?.content.filter(c => c.type === 'pattern');

            expect(patterns).toHaveLength(1);
            expect(patterns?.[0].value.confidence).toBeGreaterThan(0.75);
        });
    });
});}