import { MetricData, LoadMetrics } from '../../../src/types';

export class PerformanceMetrics {
    private metrics: Map<string, any[]>;
    private errors: Map<string, any[]>;
    private systemMetrics: MetricData[];

    constructor() {
        this.metrics = new Map();
        this.errors = new Map();
        this.systemMetrics = [];
    }

    public recordOperationMetrics(operation: string, measurements: number[]): void {
        if (!this.metrics.has(operation)) {
            this.metrics.set(operation, []);
        }
        this.metrics.get(operation)!.push(...measurements);
    }

    public recordError(operation: string, error: any): void {
        if (!this.errors.has(operation)) {
            this.errors.set(operation, []);
        }
        this.errors.get(operation)!.push({
            timestamp: Date.now(),
            error: error.message || error
        });
    }

    public recordSystemMetrics(metrics: MetricData[]): void {
        this.systemMetrics.push(...metrics);
    }

    public recordLoadTestMetrics(metrics: LoadMetrics): void {
        this.recordOperationMetrics('load-test', [
            metrics.averageLatency,
            metrics.p95Latency,
            metrics.p99Latency
        ]);

        // Record additional load test specific metrics
        if (!this.metrics.has('load-test-stats')) {
            this.metrics.set('load-test-stats', []);
        }
        this.metrics.get('load-test-stats')!.push(metrics);
    }

    public getMetrics(): any {
        const result: any = {};

        // Process operation metrics
        this.metrics.forEach((measurements, operation) => {
            result[operation] = this.calculateStats(measurements);
        });

        // Add system metrics summary if available
        if (this.systemMetrics.length > 0) {
            result.system = this.summarizeSystemMetrics();
        }

        // Add error summary
        result.errors = this.summarizeErrors();

        return result;
    }

    private calculateStats(measurements: number[]): any {
        if (measurements.length === 0) return {};

        const sorted = [...measurements].sort((a, b) => a - b);
        const sum = sorted.reduce((a, b) => a + b, 0);
        const mean = sum / sorted.length;

        return {
            min: sorted[0],
            max: sorted[sorted.length - 1],
            mean,
            median: sorted[Math.floor(sorted.length / 2)],
            p95: sorted[Math.floor(sorted.length * 0.95)],
            p99: sorted[Math.floor(sorted.length * 0.99)],
            variance: this.calculateVariance(sorted, mean),
            samples: measurements.length
        };
    }

    private calculateVariance(values: number[], mean: number): number {
        return values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
    }

    private summarizeSystemMetrics(): any {
        const metricsByType = new Map<string, number[]>();

        this.systemMetrics.forEach(metric => {
            if (!metricsByType.has(metric.name)) {
                metricsByType.set(metric.name, []);
            }
            metricsByType.get(metric.name)!.push(metric.value);
        });

        const summary: any = {};
        metricsByType.forEach((values, name) => {
            summary[name] = this.calculateStats(values);
        });

        return summary;
    }

    private summarizeErrors(): any {
        const summary: any = {};

        this.errors.forEach((errors, operation) => {
            summary[operation] = {
                count: errors.length,
                lastError: errors[errors.length - 1],
                errors: errors
            };
        });

        return summary;
    }

    public clear(): void {
        this.metrics.clear();
        this.errors.clear();
        this.systemMetrics = [];
    }
}