// Types for the adaptive optimization system
interface OptimizationMetric {
  id: string;
  value: number;
  weight: number;
  timestamp: number;
}

interface AdaptiveThreshold {
  metric: string;
  minValue: number;
  maxValue: number;
  targetValue: number;
  adaptationRate: number;
}

interface OptimizationState {
  metrics: Map<string, OptimizationMetric>;
  thresholds: Map<string, AdaptiveThreshold>;
  learningRate: number;
  lastOptimization: number;
}

// Core adaptive optimization class
export class AdaptiveOptimizer {
  private state: OptimizationState;
  private readonly minLearningRate = 0.01;
  private readonly maxLearningRate = 0.5;

  constructor(initialThresholds: AdaptiveThreshold[]) {
    this.state = {
      metrics: new Map(),
      thresholds: new Map(initialThresholds.map(t => [t.metric, t])),
      learningRate: 0.1,
      lastOptimization: Date.now()
    };
  }

  // Update metrics based on new observations
  public updateMetrics(newMetrics: OptimizationMetric[]): void {
    newMetrics.forEach(metric => {
      this.state.metrics.set(metric.id, {
        ...metric,
        timestamp: Date.now()
      });
    });
    this.optimizeThresholds();
  }

  // Core optimization logic
  private optimizeThresholds(): void {
    const currentTime = Date.now();
    const timeDelta = currentTime - this.state.lastOptimization;
    
    // Only optimize if enough time has passed (avoid too frequent updates)
    if (timeDelta < 1000) return;

    this.state.thresholds.forEach((threshold, metricId) => {
      const metric = this.state.metrics.get(metricId);
      if (!metric) return;

      const error = threshold.targetValue - metric.value;
      const adjustment = this.state.learningRate * error * metric.weight;

      // Update thresholds within bounds
      threshold.minValue = Math.max(0, threshold.minValue + adjustment);
      threshold.maxValue = Math.max(threshold.minValue + 0.1, threshold.maxValue + adjustment);
      
      // Adjust adaptation rate based on error magnitude
      threshold.adaptationRate = this.calculateAdaptationRate(error);
    });

    // Update learning rate based on overall performance
    this.updateLearningRate();
    this.state.lastOptimization = currentTime;
  }

  // Calculate new adaptation rate based on error
  private calculateAdaptationRate(error: number): number {
    const baseRate = 0.1;
    const errorFactor = Math.min(Math.abs(error), 1);
    return baseRate * (1 + errorFactor);
  }

  // Dynamically adjust learning rate based on performance
  private updateLearningRate(): void {
    const averageError = this.calculateAverageError();
    const errorFactor = Math.min(Math.abs(averageError), 1);
    
    this.state.learningRate = Math.max(
      this.minLearningRate,
      Math.min(
        this.maxLearningRate,
        this.state.learningRate * (1 + errorFactor * 0.1)
      )
    );
  }

  // Calculate average error across all metrics
  private calculateAverageError(): number {
    let totalError = 0;
    let count = 0;

    this.state.thresholds.forEach((threshold, metricId) => {
      const metric = this.state.metrics.get(metricId);
      if (metric) {
        totalError += Math.abs(threshold.targetValue - metric.value);
        count++;
      }
    });

    return count > 0 ? totalError / count : 0;
  }

  // Get current optimization state
  public getState(): OptimizationState {
    return {...this.state};
  }

  // Export optimization results for cross-agent learning
  public exportOptimizationData() {
    return {
      thresholds: Array.from(this.state.thresholds.entries()),
      learningRate: this.state.learningRate,
      timestamp: Date.now()
    };
  }
}

// Integration with cross-agent learning system
export class CrossAgentOptimizer extends AdaptiveOptimizer {
  private agentId: string;
  private sharedMetrics: Map<string, OptimizationMetric[]>;

  constructor(agentId: string, initialThresholds: AdaptiveThreshold[]) {
    super(initialThresholds);
    this.agentId = agentId;
    this.sharedMetrics = new Map();
  }

  // Share optimization data with other agents
  public shareOptimizationData(): void {
    const data = this.exportOptimizationData();
    // Implement sharing logic here (e.g., through event bus or message queue)
  }

  // Receive optimization data from other agents
  public receiveSharedData(agentId: string, metrics: OptimizationMetric[]): void {
    this.sharedMetrics.set(agentId, metrics);
    this.incorporateSharedKnowledge();
  }

  // Incorporate learning from other agents
  private incorporateSharedKnowledge(): void {
    const sharedOptimizations = Array.from(this.sharedMetrics.values())
      .flat()
      .filter(metric => {
        // Only use recent metrics (within last 5 minutes)
        return Date.now() - metric.timestamp < 5 * 60 * 1000;
      });

    if (sharedOptimizations.length > 0) {
      this.updateMetrics(sharedOptimizations);
    }
  }
}