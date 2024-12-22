export interface LoadConfig {
    duration: number;      // Test duration in seconds
    rampUp: number;       // Ramp up time in seconds
    targetRPS: number;    // Target requests per second
    generateRequest: (id: number) => any;
}

export interface LoadMetrics {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageLatency: number;
    p95Latency: number;
    p99Latency: number;
    rps: number;
    duration: number;
}

export class LoadGenerator {
    private config!: LoadConfig;
    private metrics: {
        latencies: number[];
        successes: number;
        failures: number;
        startTime?: number;
        endTime?: number;
    };

    constructor() {
        this.metrics = {
            latencies: [],
            successes: 0,
            failures: 0
        };
    }

    public configure(config: LoadConfig): void {
        this.config = config;
    }

    public async start(handler: (request: any) => Promise<number>): Promise<void> {
        if (!this.config) {
            throw new Error('Load generator not configured');
        }

        this.resetMetrics();
        this.metrics.startTime = Date.now();

        try {
            await this.generateLoad(handler);
        } finally {
            this.metrics.endTime = Date.now();
        }
    }

    private async generateLoad(
        handler: (request: any) => Promise<number>
    ): Promise<void> {
        const startTime = Date.now();
        const endTime = startTime + (this.config.duration * 1000);
        let requestId = 0;

        while (Date.now() < endTime) {
            const currentTime = Date.now();
            const elapsedSeconds = (currentTime - startTime) / 1000;

            // Calculate current target RPS based on ramp up
            const currentTargetRPS = this.calculateTargetRPS(elapsedSeconds);

            // Generate requests for this second
            const requests = this.generateRequests(
                requestId,
                currentTargetRPS,
                handler
            );

            // Wait for current second to complete
            const nextSecond = currentTime + 1000;
            await Promise.all([
                Promise.all(requests),
                this.waitUntil(nextSecond)
            ]);

            requestId += currentTargetRPS;
        }
    }

    private calculateTargetRPS(elapsedSeconds: number): number {
        if (elapsedSeconds < this.config.rampUp) {
            // Linear ramp up
            return Math.floor(
                (elapsedSeconds / this.config.rampUp) * this.config.targetRPS
            );
        }
        return this.config.targetRPS;
    }

    private generateRequests(
        baseId: number,
        count: number,
        handler: (request: any) => Promise<number>
    ): Promise<void>[] {
        const requests: Promise<void>[] = [];

        for (let i = 0; i < count; i++) {
            const request = this.config.generateRequest(baseId + i);
            requests.push(
                handler(request)
                    .then(latency => {
                        if (latency >= 0) {
                            this.metrics.latencies.push(latency);
                            this.metrics.successes++;
                        } else {
                            this.metrics.failures++;
                        }
                    })
                    .catch(() => {
                        this.metrics.failures++;
                    })
            );
        }

        return requests;
    }

    private async waitUntil(timestamp: number): Promise<void> {
        const now = Date.now();
        if (now < timestamp) {
            await new Promise(resolve => setTimeout(resolve, timestamp - now));
        }
    }

    public getMetrics(): LoadMetrics {
        if (!this.metrics.startTime || !this.metrics.endTime) {
            throw new Error('No test has been run');
        }

        const duration = (this.metrics.endTime - this.metrics.startTime) / 1000;
        const totalRequests = this.metrics.successes + this.metrics.failures;

        // Sort latencies for percentile calculation
        const sortedLatencies = [...this.metrics.latencies].sort((a, b) => a - b);
        const p95Index = Math.floor(sortedLatencies.length * 0.95);
        const p99Index = Math.floor(sortedLatencies.length * 0.99);

        return {
            totalRequests,
            successfulRequests: this.metrics.successes,
            failedRequests: this.metrics.failures,
            averageLatency: this.metrics.latencies.reduce((a, b) => a + b, 0) / 
                           this.metrics.latencies.length,
            p95Latency: sortedLatencies[p95Index],
            p99Latency: sortedLatencies[p99Index],
            rps: totalRequests / duration,
            duration
        };
    }

    private resetMetrics(): void {
        this.metrics = {
            latencies: [],
            successes: 0,
            failures: 0
        };
    }
}