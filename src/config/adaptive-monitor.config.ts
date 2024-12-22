import { AdaptiveMonitorConfig } from '../core/agent/adaptive-monitor';

// Configuration presets for different environments
export const developmentConfig: AdaptiveMonitorConfig = {
  checkInterval: 30000, // 30 seconds for faster feedback in development
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
    }
  ],
  alertThresholds: [
    {
      metric: 'response_time',
      warning: 1000,  // More lenient thresholds for development
      critical: 2000
    },
    {
      metric: 'error_rate',
      warning: 0.10,
      critical: 0.20
    }
  ]
};

export const productionConfig: AdaptiveMonitorConfig = {
  checkInterval: 60000, // 1 minute for production
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
    },
    {
      monitorMetric: 'memory_usage',
      optimizerMetric: 'memoryUsage',
      weight: 0.5
    }
  ],
  alertThresholds: [
    {
      metric: 'response_time',
      warning: 500,   // Stricter thresholds for production
      critical: 1000
    },
    {
      metric: 'error_rate',
      warning: 0.05,
      critical: 0.10
    },
    {
      metric: 'cpu_usage',
      warning: 80,
      critical: 95
    },
    {
      metric: 'memory_usage',
      warning: 85,
      critical: 95
    }
  ]
};
