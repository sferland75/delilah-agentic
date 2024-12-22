import { EventEmitter } from 'events';
import { AdaptiveOptimizer } from '../agent/adaptive';
import { MonitoringService } from '../../monitoring/service';
import { LearningDistributor } from '../learning/LearningDistributor';

interface AgentMessage {
  agentId: string;
  type: 'observation' | 'analysis' | 'recommendation' | 'learning';
  payload: any;
  timestamp: number;
}

export class AgentCoordinator {
  private agents: Map<string, any>;
  private messageQueue: AgentMessage[];
  private optimizer: AdaptiveOptimizer;
  private monitor: MonitoringService;
  private learningDistributor: LearningDistributor;
  private eventEmitter: EventEmitter;

  constructor(
    optimizer: AdaptiveOptimizer,
    monitor: MonitoringService
  ) {
    this.agents = new Map();
    this.messageQueue = [];
    this.optimizer = optimizer;
    this.monitor = monitor;
    this.learningDistributor = new LearningDistributor(optimizer);
    this.eventEmitter = new EventEmitter();

    this.setupMessageProcessing();
    this.setupLearningSubscriptions();
  }

  private setupLearningSubscriptions(): void {
    // Handle new learning patterns
    this.learningDistributor.subscribe('newPattern', (pattern) => {
      this.monitor.recordMetric({
        name: 'learning_pattern_added',
        value: 1,
        timestamp: Date.now(),
        tags: {
          type: pattern.type,
          source: pattern.source
        }
      });

      // Distribute to relevant agents
      this.agents.forEach((agent, agentId) => {
        if (agent.handleLearningPattern) {
          agent.handleLearningPattern(pattern);
        }
      });
    });

    // Handle rejected patterns
    this.learningDistributor.subscribe('patternRejected', (data) => {
      this.monitor.recordMetric({
        name: 'learning_pattern_rejected',
        value: 1,
        timestamp: Date.now(),
        tags: {
          reason: data.reason.join(','),
          type: data.pattern.type
        }
      });
    });
  }

  // Register a new agent
  public registerAgent(agentId: string, agent: any): void {
    this.agents.set(agentId, agent);
    this.monitor.recordMetric({
      name: 'agent_registration',
      value: 1,
      timestamp: Date.now(),
      tags: { agentId }
    });

    // Share existing learning patterns with new agent
    if (agent.handleLearningPattern) {
      const status = this.learningDistributor.getStatus();
      this.eventEmitter.emit('agentLearningSync', {
        agentId,
        patterns: status.totalPatterns
      });
    }
  }

  // Send message between agents
  public sendMessage(message: AgentMessage): void {
    this.messageQueue.push(message);
    this.eventEmitter.emit('newMessage', message);
    
    // Record messaging metrics
    this.monitor.recordMetric({
      name: 'agent_messages',
      value: 1,
      timestamp: message.timestamp,
      tags: {
        agentId: message.agentId,
        messageType: message.type
      }
    });
  }

  // Process message queue
  private async processMessage(message: AgentMessage): Promise<void> {
    const targetAgent = this.agents.get(message.agentId);
    if (!targetAgent) return;

    try {
      switch (message.type) {
        case 'observation':
          await this.handleObservation(message);
          break;
        case 'analysis':
          await this.handleAnalysis(message);
          break;
        case 'recommendation':
          await this.handleRecommendation(message);
          break;
        case 'learning':
          await this.handleLearning(message);
          break;
      }
    } catch (error) {
      this.monitor.recordMetric({
        name: 'agent_message_error',
        value: 1,
        timestamp: Date.now(),
        tags: {
          agentId: message.agentId,
          messageType: message.type,
          error: error.message
        }
      });
    }
  }

  // Handle observation messages
  private async handleObservation(message: AgentMessage): Promise<void> {
    const observation = message.payload;
    
    // Create learning pattern from observation
    await this.learningDistributor.addPattern({
      id: `obs_${Date.now()}`,
      source: message.agentId,
      type: 'observation',
      pattern: observation,
      confidence: observation.confidence || 1,
      timestamp: message.timestamp
    });

    // Update optimizer with new observation
    this.optimizer.updateMetrics([{
      id: `${message.agentId}_observation`,
      value: observation.confidence || 1,
      weight: 1,
      timestamp: message.timestamp
    }]);

    // Notify analysis agent
    if (this.agents.has('analysis')) {
      this.sendMessage({
        agentId: 'analysis',
        type: 'analysis',
        payload: observation,
        timestamp: Date.now()
      });
    }
  }

  // Handle analysis messages
  private async handleAnalysis(message: AgentMessage): Promise<void> {
    const analysis = message.payload;
    
    // Create learning pattern from analysis
    if (analysis.patterns) {
      await this.learningDistributor.addPattern({
        id: `analysis_${Date.now()}`,
        source: message.agentId,
        type: 'analysis',
        pattern: analysis.patterns,
        confidence: analysis.confidence || 0.8,
        timestamp: message.timestamp
      });
    }

    // Generate recommendations if confidence is high
    if (analysis.confidence > 0.8) {
      this.sendMessage({
        agentId: 'assessment',
        type: 'recommendation',
        payload: analysis.recommendations,
        timestamp: Date.now()
      });
    }
  }

  // Handle recommendation messages
  private async handleRecommendation(message: AgentMessage): Promise<void> {
    const recommendation = message.payload;
    
    // Create learning pattern from recommendation
    await this.learningDistributor.addPattern({
      id: `rec_${Date.now()}`,
      source: message.agentId,
      type: 'outcome',
      pattern: recommendation,
      confidence: recommendation.confidence || 0.8,
      timestamp: message.timestamp,
      metadata: {
        type: recommendation.type,
        priority: recommendation.priority
      }
    });

    // Record recommendation metrics
    this.monitor.recordMetric({
      name: 'agent_recommendation',
      value: recommendation.confidence || 1,
      timestamp: message.timestamp,
      tags: {
        agentId: message.agentId,
        type: recommendation.type
      }
    });
  }

  // Handle learning messages
  private async handleLearning(message: AgentMessage): Promise<void> {
    const learning = message.payload;
    
    // Share learning with all agents
    this.agents.forEach((agent, agentId) => {
      if (agentId !== message.agentId) {
        this.sendMessage({
          agentId,
          type: 'learning',
          payload: learning,
          timestamp: Date.now()
        });
      }
    });

    // Update learning system
    await this.learningDistributor.addPattern({
      id: `learning_${Date.now()}`,
      source: message.agentId,
      type: 'correlation',
      pattern: learning,
      confidence: learning.confidence || 0.7,
      timestamp: message.timestamp
    });

    // Update optimizer with learning effectiveness
    this.optimizer.updateMetrics([{
      id: 'learning_effectiveness',
      value: learning.effectiveness || 1,
      weight: 3,
      timestamp: message.timestamp
    }]);
  }

  // Set up continuous message processing
  private setupMessageProcessing(): void {
    setInterval(() => {
      while (this.messageQueue.length > 0) {
        const message = this.messageQueue.shift();
        if (message) {
          this.processMessage(message);
        }
      }
    }, 100); // Process messages every 100ms
  }

  // Subscribe to agent events
  public subscribe(
    event: 'newMessage' | 'agentUpdate' | 'learningUpdate' | 'agentLearningSync',
    callback: (data: any) => void
  ): void {
    this.eventEmitter.on(event, callback);
  }

  // Get system status
  public getStatus(): object {
    return {
      activeAgents: Array.from(this.agents.keys()),
      queueLength: this.messageQueue.length,
      optimizerState: this.optimizer.getState(),
      metrics: this.monitor.getRecentMetrics('agent_'),
      learning: this.learningDistributor.getStatus()
    };
  }
}