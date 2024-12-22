import { SystemCoordinator } from '../../src/core/coordinator/SystemCoordinator';
import { DataProcessor } from '../../src/core/processing/DataProcessor';
import { MonitoringService } from '../../src/core/monitoring/MonitoringService';
import { MetricData, HealthStatus, AlertConfig } from '../../src/types';

export interface TestSystemConfig {
    enableMonitoring?: boolean;
    enableLearning?: boolean;
    mockServices?: boolean;
}

export class TestSystem {
    public coordinator: SystemCoordinator;
    public processor: DataProcessor;
    public monitoring?: MonitoringService;
    private metrics: MetricData[] = [];
    private alerts: any[] = [];

    constructor(config: TestSystemConfig = {}) {
        if (config.enableMonitoring) {
            this.setupMonitoring();
        }

        this.coordinator = new SystemCoordinator({
            enableLearning: config.enableLearning ?? true
        });

        this.processor = new DataProcessor(this.coordinator, {
            validateInput: true,
            trackLineage: true
        });

        if (this.monitoring) {
            this.registerMonitoring();
        }
    }

    private setupMonitoring(): void {
        this.monitoring = new MonitoringService({
            enableMetrics: true,
            enableHealth: true,
            enableAlerts: true,
            metricsInterval: 1000,
            healthCheckInterval: 2000
        });

        this.monitoring.on('metric', (metric) => this.metrics.push(metric));
        this.monitoring.on('alert', (alert) => this.alerts.push(alert));
    }

    private registerMonitoring(): void {
        if (!this.monitoring) return;

        // Register components
        this.monitoring.registerComponent('coordinator', 
            this.createHealthCheck('coordinator')
        );

        this.monitoring.registerComponent('processor', 
            this.createHealthCheck('processor')
        );

        // Add default alerts
        this.monitoring.configureAlert({
            id: 'high-latency',
            name: 'High Processing Latency',
            componentId: 'processor',
            rule: {
                type: 'threshold',
                condition: 'above',
                threshold: 1000
            },
            priority: 'high'
        });
    }

    private createHealthCheck(componentId: string) {
        return async (): Promise<HealthStatus> => ({
            componentId,
            status: 'healthy',
            timestamp: Date.now()
        });
    }

    public getMetrics(filter?: (metric: MetricData) => boolean): MetricData[] {
        return filter ? this.metrics.filter(filter) : this.metrics;
    }

    public getAlerts(filter?: (alert: any) => boolean): any[] {
        return filter ? this.alerts.filter(filter) : this.alerts;
    }

    public async processTestData(data: any, format: string = 'json'): Promise<any> {
        return this.processor.processData(data, format);
    }

    public async processBatch(items: any[], format: string = 'json'): Promise<any[]> {
        return this.processor.processBatch(items, format);
    }

    public async shutdown(): Promise<void> {
        await this.coordinator.shutdown();
        if (this.monitoring) {
            await this.monitoring.shutdown();
        }
    }
}

export function createTestData(id: string, content: string = 'Test content'): any {
    return {
        id,
        content,
        metadata: {
            source: 'test',
            timestamp: Date.now()
        }
    };
}

export function generateTestBatch(count: number): any[] {
    return Array.from({ length: count }, (_, i) => createTestData(
        `batch-${i}`,
        `Test content for batch item ${i}`
    ));
}

export async function waitForCondition(
    condition: () => boolean | Promise<boolean>,
    timeout: number = 5000,
    interval: number = 100
): Promise<boolean> {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
        if (await condition()) {
            return true;
        }
        await new Promise(resolve => setTimeout(resolve, interval));
    }
    return false;
}

export function expectMetricRange(
    value: number,
    min: number,
    max: number,
    message?: string
): void {
    expect(value).toBeGreaterThanOrEqual(
        min,
        message ?? `Value ${value} should be >= ${min}`
    );
    expect(value).toBeLessThanOrEqual(
        max,
        message ?? `Value ${value} should be <= ${max}`
    );
}