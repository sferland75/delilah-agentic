import { MonitoringService } from '../../src/monitoring/service';

describe('MonitoringService Integration Tests', () => {
  let monitoringService: MonitoringService;

  beforeEach(() => {
    monitoringService = new MonitoringService();
  });

  test('should record and retrieve metrics', async () => {
    const metric = {
      name: 'cpu_usage',
      value: 75.5,
      timestamp: Date.now(),
      tags: { host: 'server-1' }
    };

    monitoringService.recordMetric(metric);
    const recentMetrics = monitoringService.getRecentMetrics('cpu_usage');

    expect(recentMetrics).toHaveLength(1);
    expect(recentMetrics[0].value).toBe(75.5);
  });

  test('should trigger alerts based on conditions', async () => {
    const alertTriggered = new Promise(resolve => {
      monitoringService.subscribe('newAlert', (alert) => {
        resolve(alert);
      });
    });

    monitoringService.addAlertCondition(
      'memory_usage',
      90,
      'gt',
      'critical',
      'Memory usage exceeds 90%'
    );

    monitoringService.recordMetric({
      name: 'memory_usage',
      value: 95,
      timestamp: Date.now(),
      tags: { host: 'server-1' }
    });

    const alert = await alertTriggered;
    expect(alert).toBeDefined();
    expect(alert.severity).toBe('critical');
  });

  test('should maintain health checks', async () => {
    monitoringService.updateHealthCheck({
      component: 'api-server',
      status: 'healthy',
      lastCheck: Date.now(),
      details: { uptime: '24h' }
    });

    const healthChecks = monitoringService.getHealthChecks();
    expect(healthChecks.get('api-server')).toBeDefined();
    expect(healthChecks.get('api-server').status).toBe('healthy');
  });

  test('should clean up old data', async () => {
    const oldTimestamp = Date.now() - 25 * 60 * 60 * 1000; // 25 hours ago

    monitoringService.recordMetric({
      name: 'old_metric',
      value: 100,
      timestamp: oldTimestamp,
      tags: {}
    });

    // Force cleanup
    await new Promise(resolve => setTimeout(resolve, 1000));

    const metrics = monitoringService.getRecentMetrics('old_metric');
    expect(metrics).toHaveLength(0);
  });

  test('should handle real-time metric updates', async () => {
    const metricUpdates = [];
    monitoringService.subscribe('newMetric', (metric) => {
      metricUpdates.push(metric);
    });

    const metrics = [
      { name: 'requests', value: 100, timestamp: Date.now(), tags: {} },
      { name: 'requests', value: 150, timestamp: Date.now(), tags: {} },
      { name: 'requests', value: 200, timestamp: Date.now(), tags: {} }
    ];

    for (const metric of metrics) {
      monitoringService.recordMetric(metric);
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    expect(metricUpdates).toHaveLength(3);
    expect(metricUpdates[2].value).toBe(200);
  });
});