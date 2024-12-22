import { AssessmentAgent } from '../../../src/agents/AssessmentAgent';
import { AgentCoordinator } from '../../../src/core/coordinator/AgentCoordinator';
import { AdaptiveOptimizer } from '../../../src/core/agent/adaptive';
import { MonitoringService } from '../../../src/monitoring/service';

describe('AssessmentAgent Tests', () => {
  let agent: AssessmentAgent;
  let coordinator: AgentCoordinator;
  let optimizer: AdaptiveOptimizer;
  let monitor: MonitoringService;

  beforeEach(() => {
    optimizer = new AdaptiveOptimizer([]);
    monitor = new MonitoringService();
    coordinator = new AgentCoordinator(optimizer, monitor);
    agent = new AssessmentAgent(coordinator);
  });

  test('should handle assessment lifecycle', async () => {
    // Start assessment
    const context = {
      clientId: 'test123',
      location: 'home',
      timestamp: Date.now(),
      assessmentType: 'initial'
    };

    agent.startAssessment(context);

    // Record observations
    await agent.recordObservation({
      type: 'mobility',
      category: 'bathroom',
      value: 'limited_access',
      confidence: 0.9
    });

    await agent.recordObservation({
      type: 'safety',
      category: 'bathroom',
      value: 'no_grab_bars',
      confidence: 0.95
    });

    // Complete assessment
    await agent.completeAssessment();

    // Verify status
    const status = agent.getStatus();
    expect(status.totalObservations).toBe(2);
    expect(status.averageConfidence).toBeGreaterThan(0.9);
  });

  test('should validate observations using learning patterns', async () => {
    // Add learning pattern
    agent.handleLearningPattern({
      id: 'test_pattern',
      source: 'assessment',
      type: 'observation',
      pattern: {
        type: 'mobility',
        category: 'bathroom',
        value: 'limited_access'
      },
      confidence: 0.9,
      timestamp: Date.now()
    });

    // Start assessment
    agent.startAssessment({
      clientId: 'test123',
      location: 'home',
      timestamp: Date.now(),
      assessmentType: 'initial'
    });

    // Record matching observation
    let relatedPatternsFound = false;
    agent.subscribe('relatedPatterns', () => {
      relatedPatternsFound = true;
    });

    await agent.recordObservation({
      type: 'mobility',
      category: 'bathroom',
      value: 'limited_access',
      confidence: 0.8
    });

    expect(relatedPatternsFound).toBe(true);
  });

  test('should generate comprehensive analysis', async () => {
    agent.startAssessment({
      clientId: 'test123',
      location: 'home',
      timestamp: Date.now(),
      assessmentType: 'initial'
    });

    // Record multiple observations
    const observations = [
      {
        type: 'mobility',
        category: 'bathroom',
        value: 'limited_access',
        confidence: 0.9
      },
      {
        type: 'safety',
        category: 'bathroom',
        value: 'no_grab_bars',
        confidence: 0.95
      },
      {
        type: 'mobility',
        category: 'bedroom',
        value: 'adequate_space',
        confidence: 0.85
      }
    ];

    for (const obs of observations) {
      await agent.recordObservation(obs);
    }

    // Track analysis message
    let analysisMessage: any;
    coordinator.subscribe('newMessage', (message) => {
      if (message.type === 'analysis' &&
          message.payload.event === 'assessment_complete') {
        analysisMessage = message;
      }
    });

    await agent.completeAssessment();

    expect(analysisMessage).toBeDefined();
    expect(analysisMessage.payload.analysis).toHaveProperty('bathroom');
    expect(analysisMessage.payload.analysis).toHaveProperty('bedroom');
    expect(analysisMessage.payload.confidence).toBeGreaterThan(0.8);
  });

  test('should handle recommendations', (done) => {
    agent.subscribe('newRecommendation', (recommendation) => {
      expect(recommendation).toHaveProperty('type');
      expect(recommendation).toHaveProperty('action');
      done();
    });

    coordinator.sendMessage({
      agentId: 'assessment',
      type: 'recommendation',
      payload: {
        type: 'safety',
        action: 'Install bathroom grab bars',
        priority: 'high',
        confidence: 0.95
      },
      timestamp: Date.now()
    });
  });

  test('should handle learning updates', async () => {
    let learningUpdatesReceived = 0;
    agent.subscribe('learningUpdate', () => {
      learningUpdatesReceived++;
    });

    // Send multiple learning updates
    const updates = [
      {
        pattern: 'mobility_pattern_1',
        confidence: 0.85,
        source: 'historical_data'
      },
      {
        pattern: 'safety_pattern_1',
        confidence: 0.9,
        source: 'expert_knowledge'
      }
    ];

    for (const update of updates) {
      coordinator.sendMessage({
        agentId: 'assessment',
        type: 'learning',
        payload: update,
        timestamp: Date.now()
      });
    }

    // Wait for event processing
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(learningUpdatesReceived).toBe(updates.length);
  });

  test('should handle error conditions', async () => {
    // Try to record observation without active assessment
    await expect(agent.recordObservation({
      type: 'mobility',
      category: 'bathroom',
      value: 'limited_access',
      confidence: 0.9
    })).rejects.toThrow('No active assessment context');

    // Try to complete non-existent assessment
    await expect(agent.completeAssessment())
      .rejects.toThrow('No active assessment context');
  });

  test('should maintain observation categories', async () => {
    agent.startAssessment({
      clientId: 'test123',
      location: 'home',
      timestamp: Date.now(),
      assessmentType: 'initial'
    });

    // Record observations in different categories
    const categories = ['bathroom', 'bedroom', 'kitchen', 'living_room'];
    
    for (const category of categories) {
      await agent.recordObservation({
        type: 'general',
        category,
        value: 'test_observation',
        confidence: 0.9
      });
    }

    const status = agent.getStatus();
    expect(status.observationCategories).toHaveLength(categories.length);
    categories.forEach(category => {
      expect(status.observationCategories).toContain(category);
    });
  });
});
