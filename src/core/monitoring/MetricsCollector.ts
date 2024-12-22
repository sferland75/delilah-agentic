import { EventEmitter } from 'events';
import { MetricData, MetricsQuery } from '../../types';

export interface MetricsCollectorConfig {
    interval: number;
    retentionPeriod: number;
}

type MetricGenerator = () => Promise<MetricData[]>;

export class MetricsCollector extends EventEmitter {
    private metrics: MetricData[];
    private generators: Map<string, MetricGenerator>;
    private collectionInterval?: NodeJS.Timeout;
    private config: MetricsCollectorConfig;
    private lastCleanup: number;

    constructor(config: MetricsCollectorConfig) {
        super();
        this.metrics = [];
        this.generators = new Map();
        this.config = config;
        this.lastCleanup = Date.now();
    }

    public registerComponent(componentId: string, generator: MetricGenerator): void {
        this.generators.set(componentId, generator);
    }

    public async start(): Promise<void> {
        if (this.collectionInterval) {
            return;
        }

        // Initial collection
        await this.collectMetrics();

        // Set up interval
        this.collectionInterval = setInterval(
            () => this.collectMetrics(),
            this.config.interval
        );
    }

    public stop(): void {
        if (this.collectionInterval) {
            clearInterval(this.collectionInterval);
            this.collectionInterval = undefined;
        }
    }

    private async collectMetrics(): Promise<void> {
        const timestamp = Date.now();

        // Collect metrics from all registered generators
        const collectionPromises = Array.from(this.generators.entries())
            .map(async ([componentId, generator]) => {
                try {
                    const metrics = await generator();
                    return metrics.map(metric => ({
                        ...metric,
                        componentId,
                        timestamp
                    }));
                } catch (error) {
                    console.error(`Error collecting metrics for ${componentId}:`, error);
                    return [];
                }
            });

        const results = await Promise.all(collectionPromises);
        const newMetrics = results.flat();

        // Store and emit metrics
        newMetrics.forEach(metric => {
            this.metrics.push(metric);
            this.emit('metric', metric);
        });

        // Cleanup old metrics if needed
        await this.cleanup();
    }

    private async cleanup(): Promise<void> {
        const now = Date.now();
        if (now - this.lastCleanup < this.config.interval * 10) return;

        const cutoff = now - this.config.retentionPeriod;
        this.metrics = this.metrics.filter(metric => metric.timestamp > cutoff);
        this.lastCleanup = now;
    }

    public async getMetrics(
        componentId?: string,
        startTime?: number,
        endTime?: number
    ): Promise<MetricData[]> {
        let filteredMetrics = this.metrics;

        if (componentId) {
            filteredMetrics = filteredMetrics.filter(
                metric => metric.componentId === componentId
            );
        }

        if (startTime) {
            filteredMetrics = filteredMetrics.filter(
                metric => metric.timestamp >= startTime
            );
        }
        if (endTime) {
            filteredMetrics = filteredMetrics.filter(
                metric => metric.timestamp <= endTime
            );
        }

        return filteredMetrics;
    }

    public async query(query: MetricsQuery): Promise<any> {
        const metrics = await this.getMetrics(
            query.componentId,
            query.startTime,
            query.endTime
        );

        let filteredMetrics = metrics;
        if (query.metricName) {
            filteredMetrics = metrics.filter(
                metric => metric.name === query.metricName
            );
        }

        if (query.aggregation) {
            return this.aggregateMetrics(
                filteredMetrics,
                query.aggregation,
                query.interval
            );
        }

        return filteredMetrics;
    }

    private aggregateMetrics(
        metrics: MetricData[],
        aggregation: 'avg' | 'sum' | 'min' | 'max' | 'count',
        interval?: number
    ): any {
        if (!interval) {
            const values = metrics.map(m => m.value);
            switch (aggregation) {
                case 'avg':
                    return values.reduce((a, b) => a + b, 0) / values.length;
                case 'sum':
                    return values.reduce((a, b) => a + b, 0);
                case 'min':
                    return Math.min(...values);
                case 'max':
                    return Math.max(...values);
                case 'count':
                    return values.length;
            }
        }

        const groups = new Map<number, number[]>();
        metrics.forEach(metric => {
            const bucket = Math.floor(metric.timestamp / interval) * interval;
            if (!groups.has(bucket)) {
                groups.set(bucket, []);
            }
            groups.get(bucket)!.push(metric.value);
        });

        const result: any[] = [];
        groups.forEach((values, timestamp) => {
            let value: number;
            switch (aggregation) {
                case 'avg':
                    value = values.reduce((a, b) => a + b, 0) / values.length;
                    break;
                case 'sum':
                    value = values.reduce((a, b) => a + b, 0);
                    break;
                case 'min':
                    value = Math.min(...values);
                    break;
                case 'max':
                    value = Math.max(...values);
                    break;
                case 'count':
                    value = values.length;
                    break;
            }
            result.push({ timestamp, value });
        });

        return result.sort((a, b) => a.timestamp - b.timestamp);
    }
}