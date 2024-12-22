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
        lastUpdated: Date.now()
    };

    const mockAssessmentResult = {
        id: 'test-assessment-1',
        confidence: { score: 0.9 },
        findings: ['Finding 1', 'Finding 2']
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
                content: 'Test content'
            };

            const result = await analysisAgent.analyze(testData);

            expect(result).toBeDefined();
            expect(result.id).toBe(testData.id);
            expect(result.confidence).toBeDefined();
            expect(result.confidence.score).toBeGreaterThan(0);
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

        it('should properly handle pattern updates', async () => {
            // Trigger pattern update
            const patternUpdateCallback = (learningDistributor.subscribe as jest.Mock)
                .mock.calls[0][1];
            
            patternUpdateCallback(mockPattern);

            const testData = {
                id: 'test-data-2',
                content: 'Test content matching pattern'
            };

            const result = await analysisAgent.analyze(testData);

            expect(result.patterns).toContainEqual(
                expect.objectContaining({ id: mockPattern.id })
            );
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

            // Should not include low confidence pattern
            expect(result.patterns).not.toContainEqual(
                expect.objectContaining({ id: lowConfidencePattern.id })
            );
        });
    });
});