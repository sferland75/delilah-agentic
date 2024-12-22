import { LearningDistributor } from '../../../src/core/learning/LearningDistributor';
import { AdaptiveOptimizer } from '../../../src/core/agent/adaptive';

describe('LearningDistributor Tests', () => {
  let distributor: LearningDistributor;
  let optimizer: AdaptiveOptimizer;

  beforeEach(() => {
    optimizer = new AdaptiveOptimizer([]);
    distributor = new LearningDistributor(optimizer);
  });

  test('should add valid learning pattern', async () => {
    const pattern = {
      id: 'test1',
      source: 'assessment',
      type: 'observation',
      pattern: {
        category: 'mobility',
        environment: 'bathroom',
        condition: 'limited_access'
      },
      confidence: 0.9,
      timestamp: Date.now()
    };

    const result = await distributor.addPattern(pattern);
    expect(result).toBe(true);

    const status = distributor.getStatus();
    expect(status.totalPatterns).toBe(1);
  });

  test('should identify related patterns', async () => {
    // Add first pattern
    const pattern1 = {
      id: 'test1',
      source: 'assessment',
      type: 'observation',
      pattern: {
        category: 'mobility',
        environment: 'bathroom',
        condition: 'limited_access'
      },
      confidence: 0.9,
      timestamp: Date.now()
    };

    await distributor.addPattern(pattern1);

    // Add similar pattern
    const pattern2 = {
      id: 'test2',
      source: 'assessment',
      type: 'observation',
      pattern: {
        category: 'mobility',
        environment: 'bathroom',
        condition: 'limited_access'
      },
      confidence: 0.85,
      timestamp: Date.now()
    };

    await distributor.addPattern(pattern2);

    const related = distributor.getRelatedPatterns(pattern1);
    expect(related.length).toBe(1);
    expect(related[0].id).toBe('test2');
  });

  test('should handle pattern conflicts', async () => {
    const rejections: any[] = [];
    distributor.subscribe('patternRejected', (data) => {
      rejections.push(data);
    });

    // Add conflicting patterns
    const pattern1 = {
      id: 'test1',
      source: 'assessment',
      type: 'analysis',
      pattern: {
        factors: ['mobility_issue', 'safety_risk']
      },
      confidence: 0.9,
      timestamp: Date.now()
    };

    const pattern2 = {
      id: 'test2',
      source: 'assessment',
      type: 'analysis',
      pattern: {
        factors: ['no_issues', 'safe_environment']
      },
      confidence: 0.9,
      timestamp: Date.now()
    };

    await distributor.addPattern(pattern1);
    await distributor.addPattern(pattern2);

    expect(rejections.length).toBeGreaterThan(0);
  });

  test('should apply pattern weights correctly', async () => {
    const pattern = {
      id: 'test1',
      source: 'assessment',
      type: 'outcome',
      pattern: {
        scores: {
          safety: 90,
          mobility: 85,
          independence: 80,
          comfort: 95
        }
      },
      confidence: 0.95,
      timestamp: Date.now()
    };

    await distributor.addPattern(pattern);

    const status = distributor.getStatus();
    expect(status.averageConfidence).toBeGreaterThan(0.9);
  });
});
