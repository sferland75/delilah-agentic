import { AdaptiveOptimizer, CrossAgentOptimizer } from '../../src/core/agent/adaptive';

describe('AdaptiveOptimizer Integration Tests', () => {
  const initialThresholds = [
    {
      metric: 'responseTime',
      minValue: 0,
      maxValue: 1000,
      targetValue: 200,
      adaptationRate: 0.1
    },
    {
      metric: 'accuracy',
      minValue: 0.5,
      maxValue: 1.0,
      targetValue: 0.95,
      adaptationRate: 0.05
    }
  ];

  let optimizer: AdaptiveOptimizer;

  beforeEach(() => {
    optimizer = new AdaptiveOptimizer(initialThresholds);
  });

  test('should adapt thresholds based on new metrics', async () => {
    const metrics = [
      { id: 'responseTime', value: 300, weight: 1, timestamp: Date.now() },
      { id: 'accuracy', value: 0.8, weight: 1, timestamp: Date.now() }
    ];

    optimizer.updateMetrics(metrics);
    const state = optimizer.getState();

    // Verify learning rate adaptation
    expect(state.learningRate).toBeGreaterThan(0);
    expect(state.learningRate).toBeLessThan(1);

    // Verify threshold updates
    const responseTimeThreshold = state.thresholds.get('responseTime');
    expect(responseTimeThreshold.adaptationRate).toBeGreaterThan(0);
  });

  test('should maintain optimization history', async () => {
    const metricsSequence = [
      [{ id: 'responseTime', value: 300, weight: 1, timestamp: Date.now() }],
      [{ id: 'responseTime', value: 250, weight: 1, timestamp: Date.now() }],
      [{ id: 'responseTime', value: 220, weight: 1, timestamp: Date.now() }]
    ];

    for (const metrics of metricsSequence) {
      optimizer.updateMetrics(metrics);
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const state = optimizer.getState();
    expect(state.metrics.get('responseTime')).toBeDefined();
  });
});

describe('CrossAgentOptimizer Integration Tests', () => {
  const initialThresholds = [
    {
      metric: 'responseTime',
      minValue: 0,
      maxValue: 1000,
      targetValue: 200,
      adaptationRate: 0.1
    }
  ];

  let agent1: CrossAgentOptimizer;
  let agent2: CrossAgentOptimizer;

  beforeEach(() => {
    agent1 = new CrossAgentOptimizer('agent1', initialThresholds);
    agent2 = new CrossAgentOptimizer('agent2', initialThresholds);
  });

  test('should share and incorporate knowledge between agents', async () => {
    // Agent 1 learns from some metrics
    const agent1Metrics = [
      { id: 'responseTime', value: 300, weight: 1, timestamp: Date.now() }
    ];
    agent1.updateMetrics(agent1Metrics);

    // Share knowledge with Agent 2
    const agent1Data = agent1.exportOptimizationData();
    agent2.receiveSharedData('agent1', agent1Metrics);

    // Verify knowledge transfer
    const agent2State = agent2.getState();
    expect(agent2State.metrics.get('responseTime')).toBeDefined();
  });

  test('should filter out stale shared metrics', async () => {
    const staleMetrics = [
      {
        id: 'responseTime',
        value: 300,
        weight: 1,
        timestamp: Date.now() - 6 * 60 * 1000 // 6 minutes old
      }
    ];

    agent2.receiveSharedData('agent1', staleMetrics);
    const state = agent2.getState();
    expect(state.metrics.get('responseTime')).toBeUndefined();
  });
});