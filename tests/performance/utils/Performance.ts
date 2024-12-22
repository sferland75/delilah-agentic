export class Performance {
    public async measureOperation<T>(
        operation: () => Promise<T>,
        warmup: boolean = false
    ): Promise<number> {
        if (warmup) {
            await operation();
        }

        const startTime = performance.now();
        await operation();
        return performance.now() - startTime;
    }

    public async measureWithStats<T>(
        operation: () => Promise<T>,
        iterations: number
    ): Promise<PerformanceStats> {
        const results: number[] = [];

        // Warmup
        await this.measureOperation(operation, true);

        // Measure iterations
        for (let i = 0; i < iterations; i++) {
            results.push(await this.measureOperation(operation));
        }

        return this.calculateStats(results);
    }

    private calculateStats(measurements: number[]): PerformanceStats {
        const sorted = [...measurements].sort((a, b) => a - b);
        const sum = sorted.reduce((a, b) => a + b, 0);
        
        return {
            min: sorted[0],
            max: sorted[sorted.length - 1],
            mean: sum / sorted.length,
            median: sorted[Math.floor(sorted.length / 2)],
            p95: sorted[Math.floor(sorted.length * 0.95)],
            p99: sorted[Math.floor(sorted.length * 0.99)],
            variance: this.calculateVariance(sorted, sum / sorted.length),
            samples: measurements.length
        };
    }

    private calculateVariance(values: number[], mean: number): number {
        return values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
    }
}

export interface PerformanceStats {
    min: number;
    max: number;
    mean: number;
    median: number;
    p95: number;
    p99: number;
    variance: number;
    samples: number;
}