import { EventEmitter } from 'events';
import { MetricsCollector } from './MetricsCollector';
import { HealthChecker } from './HealthChecker';
import { AlertManager } from './AlertManager';
import { SystemState, HealthStatus, MetricData, AlertConfig } from '../../types';

export interface MonitoringConfig {
    enableMetrics?: boolean;
    enableHealth?: boolean;
    enableAlerts?: boolean;
    metricsInterval?: number;
    healthCheckInterval?: number;
    retentionPeriod?: number;
}

export class MonitoringService extends EventEmitter {
    private metricsCollector: MetricsCollector;
    private healthChecker: HealthChecker;
    private alertManager: AlertManager;
    private config: Required<MonitoringConfig>;
    private systemState: SystemState;

    constructor(config: MonitoringConfig = {}) {
        super();
        this.config = {
            enableMetrics: config.enableMetrics ?? true,
            enableHealth: config.enableHealth ?? true,
            enableAlerts: config.enableAlerts ?? true,
            metricsInterval: config.metricsInterval ?? 5000,
            healthCheckInterval: config.healthCheckInterval ?? 10000,
            retentionPeriod: config.retentionPeriod ?? 7 * 24 * 60 * 60 * 1000 // 7 days
        };

        this.initializeComponents();
    }

    private initializeComponents(): void {
        this.metricsCollector = new MetricsCollector({
            interval: this.config.metricsInterval,
            retentionPeriod: this.config.retentionPeriod
        });

        this.healthChecker = new HealthChecker({
            interval: this.config.healthCheckInterval
        });

        this.alertManager = new AlertManager();

        // Set up event handlers
        this.metricsCollector.on('metric', this.handleMetric.bind(this));
        this.healthChecker.on('health', this.handleHealthCheck.bind(this));
        this.alertManager.on('alert', this.handleAlert.bind(this));

        // Start monitoring if enabled
        if (this.config.enableMetrics) {
            this.metricsCollector.start();
        }
        if (this.config.enableHealth) {
            this.healthChecker.start();
        }
    }

    public registerComponent(
        componentId: string,
        healthCheck?: () => Promise<HealthStatus>,
        metrics?: () => Promise<MetricData[]>
    ): void {
        if (healthCheck) {
            this.healthChecker.registerComponent(componentId, healthCheck);
        }
        if (metrics) {
            this.metricsCollector.registerComponent(componentId, metrics);
        }
    }

    public configureAlert(config: AlertConfig): void {
        this.alertManager.addAlert(config);
    }

    public async getMetrics(
        componentId?: string,
        startTime?: number,
        endTime?: number
    ): Promise<MetricData[]> {
        return this.metricsCollector.getMetrics(componentId, startTime, endTime);
    }

    public async getHealth(componentId?: string): Promise<HealthStatus[]> {
        return this.healthChecker.getHealth(componentId);
    }

    public getAlerts(componentId?: string): AlertConfig[] {
        return this.alertManager.getAlerts(componentId);
    }

    private handleMetric(metric: MetricData): void {
        // Check for alert conditions
        if (this.config.enableAlerts) {
            this.alertManager.checkMetric(metric);
        }

        // Emit metric event
        this.emit('metric', metric);
    }

    private handleHealthCheck(health: HealthStatus): void {
        // Check for alert conditions
        if (this.config.enableAlerts) {
            this.alertManager.checkHealth(health);
        }

        // Emit health event
        this.emit('health', health);
    }

    private handleAlert(alert: any): void {
        // Emit alert event
        this.emit('alert', alert);
    }

    public async getSystemOverview(): Promise<any> {
        const metrics = await this.getMetrics();
        const health = await this.getHealth();
        const alerts = this.getAlerts();

        return {
            timestamp: Date.now(),
            metrics: this.summarizeMetrics(metrics),
            health: this.summarizeHealth(health),
            alerts: this.summarizeAlerts(alerts),
            config: this.config
        };
    }

    private summarizeMetrics(metrics: MetricData[]): any {
        // Group metrics by component and type
        const summary = new Map<string, Map<string, number[]>>();
        
        metrics.forEach(metric => {
            if (!summary.has(metric.componentId)) {
                summary.set(metric.componentId, new Map());
            }
            const componentMetrics = summary.get(metric.componentId)!;
            
            if (!componentMetrics.has(metric.name)) {
                componentMetrics.set(metric.name, []);
            }
            componentMetrics.get(metric.name)!.push(metric.value);
        });

        // Calculate statistics for each metric
        const result: any = {};
        summary.forEach((componentMetrics, componentId) => {
            result[componentId] = {};
            componentMetrics.forEach((values, metricName) => {
                result[componentId][metricName] = {
                    avg: values.reduce((a, b) => a + b, 0) / values.length,
                    min: Math.min(...values),
                    max: Math.max(...values),
                    count: values.length
                };
            });
        });

        return result;
    }

    private summarizeHealth(health: HealthStatus[]): any {
        const summary = {
            overall: 'healthy' as 'healthy' | 'degraded' | 'unhealthy',
            components: {} as Record<string, {
                status: string;
                lastCheck: number;
                message?: string;
            }>
        };

        let hasUnhealthy = false;
        let hasDegraded = false;

        health.forEach(status => {
            summary.components[status.componentId] = {
                status: status.status,
                lastCheck: status.timestamp,
                message: status.message
            };

            if (status.status === 'unhealthy') hasUnhealthy = true;
            if (status.status === 'degraded') hasDegraded = true;
        });

        summary.overall = hasUnhealthy ? 'unhealthy' :
                         hasDegraded ? 'degraded' : 'healthy';

        return summary;
    }

    private summarizeAlerts(alerts: AlertConfig[]): any {
        return {
            total: alerts.length,
            active: alerts.filter(a => a.active).length,
            byPriority: alerts.reduce((acc, alert) => {
                acc[alert.priority] = (acc[alert.priority] || 0) + 1;
                return acc;
            }, {} as Record<string, number>)
        };
    }

    public async shutdown(): Promise<void> {
        this.metricsCollector.stop();
        this.healthChecker.stop();
        this.removeAllListeners();
    }
}