import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { PatternLearner } from '../../../../src/core/learning/PatternLearner';
import { LearningDistributor } from '../../../../src/core/learning/LearningDistributor';

describe('PatternLearner', () => {
    let patternLearner: PatternLearner;
    let mockDistributor: jest.Mocked<LearningDistributor>;

    beforeEach(() => {
        mockDistributor = {
            subscribe: jest.fn(),
            distribute: jest.fn().mockResolvedValue(undefined)
        } as any;

        patternLearner = new PatternLearner(mockDistributor, {
            minConfidence: 0.6,
            patternThreshold: 3,
            learningRate: 0.1,
            maxPatterns: 1000
        });
    });

    describe('event handling', () => {
        it('should process analysis events', async () => {
            const analysisEvent = {
                type: 'analysis-complete',
                data: {
                    patterns: [
                        {
                            id: 'pattern-1',
                            type: 'behavioral',
                            confidence: 0.8,
                            features: [{ name: 'test', value: 'value' }]
                        }
                    ]
                },
                source: 'analysis-agent'
            };

            // Simulate event multiple times to reach threshold
            for (let i = 0; i < 3; i++) {
                await patternLearner['handleAnalysisEvent'](analysisEvent);
            }

            expect(mockDistributor.distribute).toHaveBeenCalled();
            const lastCall = mockDistributor.distribute.mock.calls.pop();
            expect(lastCall?.[0].type).toBe('pattern-update');
            expect(lastCall?.[0].data.pattern.id).toBe('pattern-1');
        });

        it('should process assessment events', async () => {
            const assessmentEvent = {
                type: 'assessment-complete',
                data: {
                    findings: [
                        'Critical error pattern observed in system',
                        'Warning: Performance degradation detected'
                    ]
                },
                source: 'assessment-agent'
            };

            await patternLearner['handleAssessmentEvent'](assessmentEvent);

            // Should extract patterns from findings
            const stats = patternLearner.getPatternStats();
            expect(stats.totalPatterns).toBeGreaterThan(0);
        });

        it('should handle pattern matches', async () => {
            // First create a pattern
            const pattern = {
                id: 'test-pattern',
                type: 'test',
                confidence: 0.7,
                lastUpdated: Date.now()
            };

            patternLearner['patterns'].set(pattern.id, { ...pattern });

            // Simulate successful match
            await patternLearner['handlePatternMatch']({
                type: 'pattern-match',
                data: {
                    patternId: pattern.id,
                    success: true
                },
                source: 'test'
            });

            const updatedPattern = patternLearner['patterns'].get(pattern.id);
            expect(updatedPattern?.confidence).toBeGreaterThan(pattern.confidence);
        });
    });

    describe('pattern management', () => {
        it('should merge pattern features', () => {
            const existing = [
                { name: 'feature1', value: 'old', confidence: 0.5 },
                { name: 'feature2', value: 'test' }
            ];

            const update = [
                { name: 'feature1', value: 'new', confidence: 0.8 },
                { name: 'feature3', value: 'added' }
            ];

            const merged = patternLearner['mergeFeatures'](existing, update);

            expect(merged).toHaveLength(3);
            expect(merged.find(f => f.name === 'feature1')?.value).toBe('new');
            expect(merged.find(f => f.name === 'feature1')?.confidence).toBe(0.8);
            expect(merged.find(f => f.name === 'feature3')).toBeDefined();
        });

        it('should prune patterns when limit is reached', async () => {
            // Add more patterns than the limit
            const limit = 5;
            patternLearner = new PatternLearner(mockDistributor, { maxPatterns: limit });

            for (let i = 0; i < limit + 5; i++) {
                patternLearner['patterns'].set(`pattern-${i}`, {
                    id: `pattern-${i}`,
                    type: 'test',
                    confidence: Math.random(),
                    lastUpdated: Date.now() - Math.random() * 1000000
                });
            }

            patternLearner['prunePatterns']();

            expect(patternLearner['patterns'].size).toBe(limit);
        });

        it('should calculate updated confidence correctly', () => {
            const existing = {
                id: 'test',
                confidence: 0.5,
                lastUpdated: Date.now()
            };

            const update = {
                id: 'test',
                confidence: 0.8,
                lastUpdated: Date.now()
            };

            const newConfidence = patternLearner['calculateUpdatedConfidence'](existing, update);
            expect(newConfidence).toBeGreaterThan(existing.confidence);
            expect(newConfidence).toBeLessThan(update.confidence);
        });

        it('should extract patterns from findings', () => {
            const findings = [
                'Critical error: System overload detected',
                'Normal operation log entry',
                'Warning: Pattern of high latency observed'
            ];

            const patterns = patternLearner['extractPatternsFromFindings'](findings);

            expect(patterns).toHaveLength(2); // Should only extract from critical/warning entries
            expect(patterns[0].type).toBe('assessment-derived');
            expect(patterns[0].confidence).toBe(0.6);
        });
    });

    describe('stats and monitoring', () => {
        it('should track pattern statistics', async () => {
            // Add some test patterns
            const recentTime = Date.now();
            const oldTime = recentTime - (25 * 60 * 60 * 1000); // 25 hours ago

            patternLearner['patterns'].set('recent-1', {
                id: 'recent-1',
                confidence: 0.8,
                lastUpdated: recentTime
            });

            patternLearner['patterns'].set('recent-2', {
                id: 'recent-2',
                confidence: 0.9,
                lastUpdated: recentTime
            });

            patternLearner['patterns'].set('old-1', {
                id: 'old-1',
                confidence: 0.7,
                lastUpdated: oldTime
            });

            const stats = patternLearner.getPatternStats();

            expect(stats.totalPatterns).toBe(3);
            expect(stats.averageConfidence).toBeCloseTo(0.8, 1);
            expect(stats.recentUpdates).toBe(2);
        });

        it('should maintain pattern update history', async () => {
            const pattern = {
                id: 'test-pattern',
                type: 'test',
                confidence: 0.7,
                lastUpdated: Date.now()
            };

            // Process pattern multiple times
            for (let i = 0; i < 5; i++) {
                await patternLearner['processPattern']({
                    ...pattern,
                    confidence: pattern.confidence + (i * 0.05)
                }, {
                    type: 'test',
                    data: {},
                    source: 'test'
                });
            }

            const updatedPattern = patternLearner['patterns'].get(pattern.id);
            expect(updatedPattern).toBeDefined();
            expect(updatedPattern?.confidence).toBeGreaterThan(pattern.confidence);
            expect(updatedPattern?.lastUpdated).toBeGreaterThan(pattern.lastUpdated);
        });
    });
});
