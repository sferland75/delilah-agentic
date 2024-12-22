import { AdaptiveOptimizer } from './adaptive';
import { MonitoringService } from '../../monitoring/service';

// Types for the integration service
interface AdaptiveMonitorConfig {
  checkInterval: number;
  metricMappings: Array<{
    monitorMetric: string;
    optimizerMetric: string;
    weight: number;
  }>;
  alertThresholds: Array<{
    metric: string;
    warning: number;
    critical: number;
  }>;
}

// Service to integrate monitoring with adaptive optimization
export class AdaptiveMonitoringIntegration {
  private optimizer: AdaptiveOptimizer;
  private monitor: MonitoringService;
  private config: AdaptiveMonitorConfig;
  private checkIntervalId: NodeJS.Timeout;

  constructor(
    optimizer: AdaptiveOptimizer,
    monitor: MonitoringService,
    config: AdaptiveMonitorConfig
  ) {
    this.optimizer = optimizer;
    this.monitor = monitor;
    this.config = config;

    this.setupAlertConditions();
    this.setupMetricSubscriptions();
    this.startHealthChecks();
  }

  // Set up alert conditions based on config
  private setupAlertConditions(): void {
    this.config.alertThresholds.forEach(threshold => {
      // Warning level alert
      this.monitor.addAlertCondition(
        threshold.metric,
        threshold.warning,
        'gt',
        'warning',
        `${threshold.metric} exceeded warning threshold`
      );

      // Critical level alert
      this.monitor.addAlertCondition(
        threshold.metric,
        threshold.critical,
        'gt',
        'critical',
        `${threshold.metric} exceeded critical threshold`
      );
    });
  }

  // Subscribe to relevant metrics and feed them to optimizer
  private setupMetricSubscriptions(): void {
    this.monitor.subscribe('newMetric', (metric) => {
      const mapping = this.config.metricMappings.find(
        m => m.monitorMetric === metric.name
      );

      if (mapping) {
        this.optimizer.updateMetrics([{
          id: mapping.optimizerMetric,
          value: metric.value,
          weight: mapping.weight,
          timestamp: metric.timestamp
        }]);
      }
    });
  }

  // Start periodic health checks
  private startHealthChecks(): void {
    this.checkIntervalId = setInterval(() => {
      this.performHealthCheck();
    }, this.config.checkInterval);
  }

  // Perform comprehensive health check
  private async performHealthCheck(): Promise<void> {
    const optimizerState = this.optimizer.getState();
    const currentTime = Date.now();

    // Check optimizer health
    const optimizerHealth = {
      component: 'adaptive-optimizer',
      status: 'healthy' as const,
      lastCheck: currentTime,
      details: {
        activeMetrics: optimizerState.metrics.size,
        learningRate: optimizerState.learningRate,
        lastOptimization: optimizerState.lastOptimization
      }
    };

    // Determine health status
    if (currentTime - optimizerState.lastOptimization > 5 * 60 * 1000) {
      optimizerHealth.status = 'degraded';
    }

    if (optimizerState.metrics.size === 0) {
      optimizerHealth.status = 'unhealthy';
    }

    // Update health status
    this.monitor.updateHealthCheck(optimizerHealth);

    // Record optimization metrics
    const averageError = this.calculateAverageError(optimizerState);
    this.monitor.recordMetric({
      name: 'optimizer_error',
      value: averageError,
      timestamp: currentTime,
      tags: { component: 'adaptive-optimizer' }
    });
  }

  // Calculate average error across all metrics
  private calculateAverageError(state: any): number {
    let totalError = 0;
    let count = 0;

    state.thresholds.forEach((threshold: any, metricId: string) => {
      const metric = state.metrics.get(metricId);
      if (metric) {
        totalError += Math.abs(threshold.targetValue - metric.value);
        count++;
      }
    });

    return count > 0 ? totalError / count : 0;
  }

  // Clean up resources
  public dispose(): void {
    if (this.checkIntervalId) {
      clearInterval(this.checkIntervalId);
    }
  }

  // Get current integration status
  public getStatus(): object {
    return {
      optimizer: this.optimizer.getState(),
      monitoring: {
        healthChecks: this.monitor.getHealthChecks(),
        recentAlerts: this.monitor.getRecentAlerts()
      }
    };
  }
}

// Example configuration
export const defaultConfig: AdaptiveMonitorConfig = {
  checkInterval: 60000, // 1 minute
  metricMappings: [
    {
      monitorMetric: 'response_time',
      optimizerMetric: 'responseTime',
      weight: 1.0
    },
    {
      monitorMetric: 'error_rate',
      optimizerMetric: 'errorRate',
      weight: 2.0
    },
    {
      monitorMetric: 'cpu_usage',
      optimizerMetric: 'cpuUsage',
      weight: 0.5
    }
  ],
  alertThresholds: [
    {
      metric: 'response_time',
      warning: 500,  // ms
      critical: 1000 // ms
    },
    {
      metric: 'error_rate',
      warning: 0.05, // 5%
      critical: 0.10 // 10%
    },
    {
      metric: 'cpu_usage',
      warning: 80,   // 80%
      critical: 95   // 95%
    }
  ]
};