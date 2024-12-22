import { AgentCoordinator } from '../../src/core/coordinator/AgentCoordinator';
import { AdaptiveOptimizer } from '../../src/core/agent/adaptive';
import { MonitoringService } from '../../src/monitoring/service';

describe('AgentCoordinator Integration Tests', () => {
  let coordinator: AgentCoordinator;
  let optimizer: AdaptiveOptimizer;
  let monitor: MonitoringService;

  beforeEach(() => {
    optimizer = new AdaptiveOptimizer([]);
    monitor = new MonitoringService();
    coordinator = new AgentCoordinator(optimizer, monitor);
  });

  test('should handle observation flow', async () => {
    // Mock assessment agent
    const assessmentAgent = {
      processObservation: jest.fn()
    };

    // Mock analysis agent
    const analysisAgent = {
      processAnalysis: jest.fn()
    };

    // Register agents
    coordinator.registerAgent('assessment', assessmentAgent);
    coordinator.registerAgent('analysis', analysisAgent);

    // Send observation message
    const observation = {
      agentId: 'assessment',
      type: 'observation',
      payload: {
        type: 'environment',
        data: 'Limited mobility access in bathroom',
        confidence: 0.9
      },
      timestamp: Date.now()
    };

    coordinator.sendMessage(observation);

    // Wait for message processing
    await new Promise(resolve => setTimeout(resolve, 200));

    // Verify metrics were recorded
    const metrics = monitor.getRecentMetrics('agent_');
    expect(metrics.length).toBeGreaterThan(0);

    // Verify optimizer was updated
    const state = optimizer.getState();
    expect(state.metrics.get('assessment_observation')).toBeDefined();
  });

  test('should facilitate cross-agent learning', async () => {
    const learningUpdates: any[] = [];

    // Subscribe to learning updates
    coordinator.subscribe('learningUpdate', (update) => {
      learningUpdates.push(update);
    });

    // Register multiple agents
    const agents = ['assessment', 'analysis', 'recommendation'].map(id => {
      const agent = {
        processLearning: jest.fn()
      };
      coordinator.registerAgent(id, agent);
      return agent;
    });

    // Send learning message
    coordinator.sendMessage({
      agentId: 'assessment',
      type: 'learning',
      payload: {
        patterns: ['new_pattern_1', 'new_pattern_2'],
        effectiveness: 0.85
      },
      timestamp: Date.now()
    });

    // Wait for processing
    await new Promise(resolve => setTimeout(resolve, 200));

    // Verify learning was shared
    expect(learningUpdates.length).toBeGreaterThan(0);
    
    // Verify optimizer tracked learning effectiveness
    const state = optimizer.getState();
    expect(state.metrics.get('learning_effectiveness')).toBeDefined();
  });

  test('should handle recommendation flow', async () => {
    // Track recommendations
    const recommendations: any[] = [];
    coordinator.subscribe('newMessage', (message) => {
      if (message.type === 'recommendation') {
        recommendations.push(message);
      }
    });

    // Register agents
    coordinator.registerAgent('analysis', {
      processAnalysis: jest.fn()
    });
    coordinator.registerAgent('assessment', {
      processRecommendation: jest.fn()
    });

    // Send analysis with high confidence
    coordinator.sendMessage({
      agentId: 'analysis',
      type: 'analysis',
      payload: {
        patterns: ['mobility_issue', 'safety_risk'],
        confidence: 0.95,
        recommendations: [
          {
            type: 'safety',
            action: 'Install bathroom grab bars',
            priority: 'high'
          }
        ]
      },
      timestamp: Date.now()
    });

    // Wait for processing
    await new Promise(resolve => setTimeout(resolve, 200));

    // Verify recommendations were generated
    expect(recommendations.length).toBeGreaterThan(0);
    expect(recommendations[0].payload[0].type).toBe('safety');

    // Verify metrics
    const metrics = monitor.getRecentMetrics('agent_recommendation');
    expect(metrics.length).toBeGreaterThan(0);
  });

  test('should handle error conditions', async () => {
    const errorMetrics: any[] = [];
    
    // Track error metrics
    monitor.subscribe('newMetric', (metric) => {
      if (metric.name === 'agent_message_error') {
        errorMetrics.push(metric);
      }
    });

    // Send message to non-existent agent
    coordinator.sendMessage({
      agentId: 'non_existent',
      type: 'observation',
      payload: {},
      timestamp: Date.now()
    });

    // Wait for processing
    await new Promise(resolve => setTimeout(resolve, 200));

    // Verify error was recorded
    expect(errorMetrics.length).toBeGreaterThan(0);
  });
});
