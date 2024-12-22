import { EventEmitter } from 'events';
import { AgentCoordinator } from '../core/coordinator/AgentCoordinator';
import { LearningPattern } from '../core/learning/LearningDistributor';

interface AssessmentContext {
  clientId: string;
  location: string;
  timestamp: number;
  assessmentType: string;
  metadata?: Record<string, any>;
}

interface ObservationData {
  type: string;
  category: string;
  value: any;
  confidence: number;
  context?: Record<string, any>;
}

export class AssessmentAgent {
  private coordinator: AgentCoordinator;
  private eventEmitter: EventEmitter;
  private currentContext?: AssessmentContext;
  private observations: Map<string, ObservationData[]>;
  private learningPatterns: Map<string, LearningPattern>;

  constructor(coordinator: AgentCoordinator) {
    this.coordinator = coordinator;
    this.eventEmitter = new EventEmitter();
    this.observations = new Map();
    this.learningPatterns = new Map();

    this.setupEventListeners();
  }

  // Start a new assessment
  public startAssessment(context: AssessmentContext): void {
    this.currentContext = context;
    this.observations.clear();

    this.coordinator.sendMessage({
      agentId: 'assessment',
      type: 'observation',
      payload: {
        event: 'assessment_start',
        context: this.currentContext
      },
      timestamp: Date.now()
    });
  }

  // Record an observation
  public async recordObservation(observation: ObservationData): Promise<void> {
    if (!this.currentContext) {
      throw new Error('No active assessment context');
    }

    // Store observation
    const category = observation.category;
    if (!this.observations.has(category)) {
      this.observations.set(category, []);
    }
    this.observations.get(category)?.push(observation);

    // Apply learning patterns to validate observation
    const validatedObservation = await this.validateObservation(observation);

    // Send to coordinator
    this.coordinator.sendMessage({
      agentId: 'assessment',
      type: 'observation',
      payload: {
        ...validatedObservation,
        context: this.currentContext
      },
      timestamp: Date.now()
    });

    // Check for related patterns
    this.checkRelatedPatterns(validatedObservation);
  }

  // Validate observation using learning patterns
  private async validateObservation(
    observation: ObservationData
  ): Promise<ObservationData> {
    let adjustedConfidence = observation.confidence;
    let relatedPatterns = 0;

    // Check against learning patterns
    this.learningPatterns.forEach(pattern => {
      if (pattern.type === 'observation' &&
          pattern.pattern.category === observation.category) {
        const similarity = this.calculateSimilarity(observation, pattern.pattern);
        if (similarity > 0.7) {
          adjustedConfidence = (adjustedConfidence + pattern.confidence) / 2;
          relatedPatterns++;
        }
      }
    });

    return {
      ...observation,
      confidence: adjustedConfidence,
      context: {
        ...observation.context,
        relatedPatterns
      }
    };
  }

  // Calculate similarity between observation and pattern
  private calculateSimilarity(obs1: any, obs2: any): number {
    const keys = ['type', 'category', 'value'];
    let matches = 0;

    keys.forEach(key => {
      if (obs1[key] === obs2[key]) matches++;
    });

    return matches / keys.length;
  }

  // Check for related patterns based on observation
  private checkRelatedPatterns(observation: ObservationData): void {
    const relatedPatterns: LearningPattern[] = [];

    this.learningPatterns.forEach(pattern => {
      if (pattern.pattern.category === observation.category) {
        const similarity = this.calculateSimilarity(
          observation,
          pattern.pattern
        );
        if (similarity > 0.7) {
          relatedPatterns.push(pattern);
        }
      }
    });

    if (relatedPatterns.length > 0) {
      this.eventEmitter.emit('relatedPatterns', {
        observation,
        patterns: relatedPatterns
      });
    }
  }

  // Complete the assessment
  public async completeAssessment(): Promise<void> {
    if (!this.currentContext) {
      throw new Error('No active assessment context');
    }

    // Generate final analysis
    const analysis = this.generateAssessmentAnalysis();

    // Send completion message
    this.coordinator.sendMessage({
      agentId: 'assessment',
      type: 'analysis',
      payload: {
        event: 'assessment_complete',
        context: this.currentContext,
        analysis,
        confidence: this.calculateOverallConfidence()
      },
      timestamp: Date.now()
    });

    // Clear context
    this.currentContext = undefined;
  }

  // Generate assessment analysis
  private generateAssessmentAnalysis(): object {
    const analysis: Record<string, any> = {};

    this.observations.forEach((observations, category) => {
      analysis[category] = {
        observations: observations.length,
        averageConfidence: observations.reduce(
          (sum, obs) => sum + obs.confidence,
          0
        ) / observations.length,
        findings: this.aggregateFindings(observations)
      };
    });

    return analysis;
  }

  // Aggregate findings from observations
  private aggregateFindings(observations: ObservationData[]): object {
    const findings: Record<string, any> = {};

    observations.forEach(obs => {
      const type = obs.type;
      if (!findings[type]) {
        findings[type] = {
          count: 0,
          values: [],
          confidence: 0
        };
      }

      findings[type].count++;
      findings[type].values.push(obs.value);
      findings[type].confidence += obs.confidence;
    });

    // Calculate averages
    Object.values(findings).forEach(finding => {
      finding.confidence /= finding.count;
    });

    return findings;
  }

  // Calculate overall assessment confidence
  private calculateOverallConfidence(): number {
    let totalConfidence = 0;
    let totalObservations = 0;

    this.observations.forEach(observations => {
      observations.forEach(obs => {
        totalConfidence += obs.confidence;
        totalObservations++;
      });
    });

    return totalObservations > 0
      ? totalConfidence / totalObservations
      : 0;
  }

  // Handle learning patterns from coordinator
  public handleLearningPattern(pattern: LearningPattern): void {
    this.learningPatterns.set(pattern.id, pattern);
    this.eventEmitter.emit('newLearningPattern', pattern);
  }

  // Set up event listeners
  private setupEventListeners(): void {
    // Listen for coordinator messages
    this.coordinator.subscribe('newMessage', (message) => {
      if (message.agentId === 'assessment') {
        this.handleMessage(message);
      }
    });
  }

  // Handle incoming messages
  private handleMessage(message: any): void {
    switch (message.type) {
      case 'recommendation':
        this.handleRecommendation(message.payload);
        break;
      case 'learning':
        this.handleLearningUpdate(message.payload);
        break;
    }
  }

  // Handle recommendations
  private handleRecommendation(recommendation: any): void {
    this.eventEmitter.emit('newRecommendation', recommendation);
  }

  // Handle learning updates
  private handleLearningUpdate(update: any): void {
    this.eventEmitter.emit('learningUpdate', update);
  }

  // Subscribe to agent events
  public subscribe(
    event: string,
    callback: (data: any) => void
  ): void {
    this.eventEmitter.on(event, callback);
  }

  // Get agent status
  public getStatus(): object {
    return {
      activeAssessment: Boolean(this.currentContext),
      observationCategories: Array.from(this.observations.keys()),
      totalObservations: Array.from(this.observations.values())
        .reduce((sum, obs) => sum + obs.length, 0),
      learningPatterns: this.learningPatterns.size,
      averageConfidence: this.calculateOverallConfidence()
    };
  }
}