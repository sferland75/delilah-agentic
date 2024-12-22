import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { AnalysisAgent } from '../../../src/agents/AnalysisAgent';
import { AgentCoordinator } from '../../../src/core/coordinator/AgentCoordinator';
import { LearningDistributor } from '../../../src/core/learning/LearningDistributor';
import { Pattern, AnalysisResult } from '../../../src/types';

describe('AnalysisAgent', () => {
    let analysisAgent: AnalysisAgent;
    let coordinator: jest.Mocked<AgentCoordinator>;
    let learningDistributor: jest.Mocked<LearningDistributor>;

    const mockPattern: Pattern = {
        id: 'test-pattern-1',
        type: 'behavioral',
        confidence: 0.85,
        lastUpdated: Date.now(),
        features: [
            {
                name: 'testFeature',
                type: 'exact',
                value: 'test'
            }
        ],
        correlations: ['finding1', 'finding2']
    };

    const mockAssessmentResult = {
        id: 'test-assessment-1',
        confidence: { score: 0.9 },
        findings: ['Finding 1: test result', 'Finding 2: another test']
    };

    beforeEach(() => {
        coordinator = {
            register: jest.fn(),
            request: jest.fn().mockResolvedValue(mockAssessmentResult)
        } as any;

        learningDistributor = {
            subscribe: jest.fn(),
            distribute: jest.fn()
        } as any;

        analysisAgent = new AnalysisAgent(coordinator, learningDistributor, {
            confidenceThreshold: 0.75
        });
    });

    describe('analyze', () => {
        it('should generate analysis results with proper confidence scoring', async () => {
            const testData = {
                id: 'test-data-1',
                timestamp: Date.now(),
                content: 'Test content',
                metadata: { source: 'test' },
                features: {
                    testFeature: 'test'
                }
            };

            // Trigger pattern update
            const patternUpdateCallback = (learningDistributor.subscribe as jest.Mock)
                .mock.calls[0][1];
            patternUpdateCallback(mockPattern);

            const result = await analysisAgent.analyze(testData);

            expect(result).toBeDefined();
            expect(result.id).toBe(testData.id);
            expect(result.confidence).toBeDefined();
            expect(result.confidence.score).toBeGreaterThan(0);
            expect(result.patterns).toHaveLength(1);
            expect(result.insights).toBeDefined();
            
            // Verify coordinator interaction
            expect(coordinator.request).toHaveBeenCalledWith(
                'assessment-result',
                { dataId: testData.id }
            );

            // Verify learning distribution
            expect(learningDistributor.distribute).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'analysis-complete',
                    data: expect.any(Object)
                })
            );
        });

        it('should handle missing data fields gracefully', async () => {
            const incompleteData = {
                id: 'test-data-2',
                content: 'Incomplete test content'
            };

            const result = await analysisAgent.analyze(incompleteData);
            expect(result).toBeDefined();
            expect(result.confidence.score).toBeLessThan(0.5);
        });

        it('should respect confidence threshold for pattern matching', async () => {
            const lowConfidencePattern: Pattern = {
                ...mockPattern,
                confidence: 0.5
            };

            // Update with low confidence pattern
            const patternUpdateCallback = (learningDistributor.subscribe as jest.Mock)
                .mock.calls[0][1];
            patternUpdateCallback(lowConfidencePattern);

            const testData = {
                id: 'test-data-3',
                content: 'Test content'
            };

            const result = await analysisAgent.analyze(testData);
            expect(result.patterns).not.toContainEqual(
                expect.objectContaining({ id: lowConfidencePattern.id })
            );
        });

        it('should generate insights for matching patterns', async () => {
            const testData = {
                id: 'test-data-4',
                timestamp: Date.now(),
                content: 'Test content with matching pattern',
                metadata: { source: 'test' },
                features: {
                    testFeature: 'test'
                }
            };

            // Add pattern
            const patternUpdateCallback = (learningDistributor.subscribe as jest.Mock)
                .mock.calls[0][1];
            patternUpdateCallback(mockPattern);

            const result = await analysisAgent.analyze(testData);
            expect(result.insights).toBeDefined();
            expect(result.insights.length).toBeGreaterThan(0);
            expect(result.insights[0]).toContain('BEHAVIORAL');
            expect(result.insights[0]).toContain('Strong pattern match');
        });
    });
});
