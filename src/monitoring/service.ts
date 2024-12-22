import { EventEmitter } from 'events';

// Types for monitoring system
interface MetricData {
  name: string;
  value: number;
  timestamp: number;
  tags: Record<string, string>;
}

interface Alert {
  id: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  timestamp: number;
  metricName?: string;
  threshold?: number;
  currentValue?: number;
}

interface HealthCheck {
  component: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  lastCheck: number;
  details?: Record<string, any>;
}

// Real-time monitoring service
export class MonitoringService {
  private metrics: Map<string, MetricData[]>;
  private alerts: Alert[];
  private healthChecks: Map<string, HealthCheck>;
  private eventEmitter: EventEmitter;
  private readonly retentionPeriod = 24 * 60 * 60 * 1000; // 24 hours

  constructor() {
    this.metrics = new Map();
    this.alerts = [];
    this.healthChecks = new Map();
    this.eventEmitter = new EventEmitter();
    this.startPeriodicCleanup();
  }

  // Record new metric data
  public recordMetric(metric: MetricData): void {
    const existing = this.metrics.get(metric.name) || [];
    existing.push({
      ...metric,
      timestamp: Date.now()
    });
    this.metrics.set(metric.name, existing);
    
    // Emit metric for real-time consumers
    this.eventEmitter.emit('newMetric', metric);
    
    // Check alert conditions
    this.checkAlertConditions(metric);
  }

  // Set up alert conditions
  private alertConditions = new Map<string, {
    threshold: number;
    comparison: 'gt' | 'lt' | 'eq';
    severity: Alert['severity'];
    message: string;
  }>();

  public addAlertCondition(
    metricName: string,
    threshold: number,
    comparison: 'gt' | 'lt' | 'eq',
    severity: Alert['severity'],
    message: string
  ): void {
    this.alertConditions.set(metricName, {
      threshold,
      comparison,
      severity,
      message
    });
  }

  // Check if metric triggers any alerts
  private checkAlertConditions(metric: MetricData): void {
    const condition = this.alertConditions.get(metric.name);
    if (!condition) return;

    let shouldAlert = false;
    switch (condition.comparison) {
      case 'gt':
        shouldAlert = metric.value > condition.threshold;
        break;
      case 'lt':
        shouldAlert = metric.value < condition.threshold;
        break;
      case 'eq':
        shouldAlert = Math.abs(metric.value - condition.threshold) < 0.0001;
        break;
    }

    if (shouldAlert) {
      const alert: Alert = {
        id: `${metric.name}-${Date.now()}`,
        severity: condition.severity,
        message: condition.message,
        timestamp: Date.now(),
        metricName: metric.name,
        threshold: condition.threshold,
        currentValue: metric.value
      };

      this.alerts.push(alert);
      this.eventEmitter.emit('newAlert', alert);
    }
  }

  // Update health check status
  public updateHealthCheck(check: HealthCheck): void {
    this.healthChecks.set(check.component, {
      ...check,
      lastCheck: Date.now()
    });
    this.eventEmitter.emit('healthCheckUpdate', check);
  }

  // Get recent metrics for a specific metric name
  public getRecentMetrics(metricName: string, duration: number = 3600000): MetricData[] {
    const metrics = this.metrics.get(metricName) || [];
    const cutoff = Date.now() - duration;
    return metrics.filter(m => m.timestamp >= cutoff);
  }

  // Get recent alerts
  public getRecentAlerts(duration: number = 3600000): Alert[] {
    const cutoff = Date.now() - duration;
    return this.alerts.filter(a => a.timestamp >= cutoff);
  }

  // Get all health checks
  public getHealthChecks(): Map<string, HealthCheck> {
    return new Map(this.healthChecks);
  }

  // Subscribe to real-time updates
  public subscribe(
    event: 'newMetric' | 'newAlert' | 'healthCheckUpdate',
    callback: (data: any) => void
  ): void {
    this.eventEmitter.on(event, callback);
  }

  // Cleanup old data periodically
  private startPeriodicCleanup(): void {
    setInterval(() => {
      const cutoff = Date.now() - this.retentionPeriod;
      
      // Clean up old metrics
      this.metrics.forEach((metrics, name) => {
        const filtered = metrics.filter(m => m.timestamp >= cutoff);
        this.metrics.set(name, filtered);
      });

      // Clean up old alerts
      this.alerts = this.alerts.filter(a => a.timestamp >= cutoff);

      // Clean up stale health checks
      this.healthChecks.forEach((check, component) => {
        if (check.lastCheck < cutoff) {
          this.healthChecks.delete(component);
        }
      });
    }, 60000); // Run cleanup every minute
  }
}