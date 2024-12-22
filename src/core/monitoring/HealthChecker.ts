import { EventEmitter } from 'events';
import { HealthStatus } from '../../types';

export interface HealthCheckerConfig {
    interval: number;
}

type HealthCheck = () => Promise<HealthStatus>;

export class HealthChecker extends EventEmitter {
    private checks: Map<string, HealthCheck>;
    private checkInterval?: NodeJS.Timeout;
    private config: HealthCheckerConfig;
    private lastStatus: Map<string, HealthStatus>;

    constructor(config: HealthCheckerConfig) {
        super();
        this.checks = new Map();
        this.lastStatus = new Map();
        this.config = config;
    }

    public registerComponent(componentId: string, check: HealthCheck): void {
        this.checks.set(componentId, check);
    }

    public async start(): Promise<void> {
        if (this.checkInterval) {
            return;
        }

        await this.runHealthChecks();

        this.checkInterval = setInterval(
            () => this.runHealthChecks(),
            this.config.interval
        );
    }

    public stop(): void {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = undefined;
        }
    }

    private async runHealthChecks(): Promise<void> {
        const checkPromises = Array.from(this.checks.entries())
            .map(async ([componentId, check]) => {
                try {
                    const status = await check();
                    this.lastStatus.set(componentId, {
                        ...status,
                        componentId,
                        timestamp: Date.now()
                    });
                    this.emit('health', this.lastStatus.get(componentId));
                } catch (error) {
                    const errorStatus: HealthStatus = {
                        componentId,
                        status: 'unhealthy',
                        timestamp: Date.now(),
                        message: `Health check failed: ${error.message}`
                    };
                    this.lastStatus.set(componentId, errorStatus);
                    this.emit('health', errorStatus);
                }
            });

        await Promise.all(checkPromises);
    }

    public async getHealth(componentId?: string): Promise<HealthStatus[]> {
        if (componentId) {
            const status = this.lastStatus.get(componentId);
            return status ? [status] : [];
        }
        return Array.from(this.lastStatus.values());
    }
}