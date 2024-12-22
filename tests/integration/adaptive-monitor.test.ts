import { AdaptiveOptimizer } from '../../src/core/agent/adaptive';
import { MonitoringService } from '../../src/monitoring/service';
import { AdaptiveMonitoringIntegration, defaultConfig } from '../../src/core/agent/adaptive-monitor';

describe('AdaptiveMonitoringIntegration Tests', () => {
  let optimizer: AdaptiveOptimizer;
  let monitor: MonitoringService;
  let integration: AdaptiveMonitoringIntegration;

  beforeEach(() => {
    const initialThresholds = [
      {
        metric: 'responseTime',
        minValue: 0,
        maxValue: 1000,
        targetValue: 200,
        adaptationRate: 0.1
      }
    ];

    optimizer = new AdaptiveOptimizer(initialThresholds);
    monitor = new MonitoringService();
    integration = new AdaptiveMonitoringIntegration(optimizer, monitor, defaultConfig);
  });

  afterEach(() => {
    integration.dispose();
  });

  test('should forward metrics from monitor to optimizer', async () => {
    const metric = {
      name: 'response_time',
      value: 300,
      timestamp: Date.now(),
      tags: { service: 'api' }
    };

    monitor.recordMetric(metric);
    await new Promise(resolve => setTimeout(resolve, 100));

    const status = integration.getStatus();
    expect(status.optimizer.metrics.get('responseTime')).toBeDefined();
  });

  test('should trigger alerts based on thresholds', async () => {
    const alertPromise = new Promise(resolve => {
      monitor.subscribe('newAlert', resolve);
    });

    monitor.recordMetric({
      name: 'response_time',
      value: 2000, // Above critical threshold
      timestamp: Date.now(),
      tags: {}
    });

    const alert = await alertPromise;
    expect(alert.severity).toBe('critical');
  });

  test('should update health status based on optimizer state', async () => {
    // Initial health check
    await new Promise(resolve => setTimeout(resolve, 100));
    let healthChecks = monitor.getHealthChecks();
    expect(healthChecks.get('adaptive-optimizer')).toBeDefined();
    expect(healthChecks.get('adaptive-optimizer').status).toBe('healthy');

    // Wait for degraded state
    await new Promise(resolve => setTimeout(resolve, 6000));
    healthChecks = monitor.getHealthChecks();
    expect(healthChecks.get('adaptive-optimizer').status).toBe('degraded');
  });

  test('should calculate and record optimization error', async () => {
    const metricPromise = new Promise(resolve => {
      monitor.subscribe('newMetric', (metric) => {
        if (metric.name === 'optimizer_error') {
          resolve(metric);
        }
      });
    });

    // Trigger a health check
    await new Promise(resolve => setTimeout(resolve, 100));

    const metric = await metricPromise;
    expect(metric).toBeDefined();
    expect(typeof metric.value).toBe('number');
  });
});