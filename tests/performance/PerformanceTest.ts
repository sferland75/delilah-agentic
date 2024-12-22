import { TestSystem, createTestData, generateTestBatch } from '../utils/TestHelpers';
import { Performance } from './utils/Performance';
import { LoadGenerator } from './utils/LoadGenerator';
import { PerformanceMetrics } from './utils/PerformanceMetrics';

export class PerformanceTest {
    private system: TestSystem;
    private metrics: PerformanceMetrics;
    private loadGen: LoadGenerator;
    private performance: Performance;

    constructor() {
        this.system = new TestSystem({
            enableMonitoring: true,
            enableLearning: true
        });
        this.metrics = new PerformanceMetrics();
        this.loadGen = new LoadGenerator();
        this.performance = new Performance();
    }

    public async runSingleOperationTest(): Promise<void> {
        console.log('Running single operation performance test...');

        const iterations = 100;
        const results: number[] = [];

        for (let i = 0; i < iterations; i++) {
            const testData = createTestData(`perf-test-${i}`);
            
            const startTime = performance.now();
            await this.system.processTestData(testData);
            const endTime = performance.now();

            results.push(endTime - startTime);
        }

        this.metrics.recordOperationMetrics('single-operation', results);
    }

    public async runConcurrentOperationsTest(concurrency: number): Promise<void> {
        console.log(`Running concurrent operations test with ${concurrency} concurrent operations...`);

        const operations = generateTestBatch(concurrency).map(data =>
            this.performance.measureOperation(
                () => this.system.processTestData(data)
            )
        );

        const results = await Promise.all(operations);
        this.metrics.recordOperationMetrics('concurrent-operations', results);
    }

    public async runLoadTest(
        duration: number,
        rampUp: number,
        targetRPS: number
    ): Promise<void> {
        console.log(`Running load test: ${duration}s duration, ${targetRPS} RPS target...`);

        // Configure load profile
        this.loadGen.configure({
            duration,
            rampUp,
            targetRPS,
            generateRequest: (id: number) => ({
                data: createTestData(`load-test-${id}`),
                timestamp: Date.now()
            })
        });

        // Start load test
        const loadTestPromise = this.loadGen.start(async (request) => {
            const startTime = performance.now();
            try {
                await this.system.processTestData(request.data);
                return performance.now() - startTime;
            } catch (error) {
                this.metrics.recordError('load-test', error);
                return -1;
            }
        });

        // Monitor system metrics during test
        const monitoringInterval = setInterval(async () => {
            const systemMetrics = await this.system.monitoring?.getMetrics();
            if (systemMetrics) {
                this.metrics.recordSystemMetrics(systemMetrics);
            }
        }, 1000);

        // Wait for load test completion
        await loadTestPromise;
        clearInterval(monitoringInterval);

        // Record final metrics
        const loadTestMetrics = this.loadGen.getMetrics();
        this.metrics.recordLoadTestMetrics(loadTestMetrics);
    }

    public async runPatternLearningTest(): Promise<void> {
        console.log('Running pattern learning performance test...');

        const iterations = 50;
        const batchSize = 10;
        const results: number[] = [];

        // Generate test data with patterns
        const patterns = [
            'Pattern A repeatedly appears in content',
            'Pattern B is consistently observed',
            'Pattern C shows up frequently'
        ];

        for (let i = 0; i < iterations; i++) {
            const batch = Array.from({ length: batchSize }, (_, j) => ({
                id: `pattern-test-${i}-${j}`,
                content: `Test content where ${patterns[j % patterns.length]} with some variations`,
                metadata: {
                    source: 'pattern-test',
                    timestamp: Date.now()
                }
            }));

            const startTime = performance.now();
            await this.system.processBatch(batch);
            const endTime = performance.now();

            results.push((endTime - startTime) / batchSize); // per-item processing time
        }

        this.metrics.recordOperationMetrics('pattern-learning', results);
    }

    public async runSystemRecoveryTest(): Promise<void> {
        console.log('Running system recovery test...');

        // Create high load to stress the system
        await this.runLoadTest(30, 5, 50);

        // Measure recovery time
        const startTime = performance.now();
        let recovered = false;
        let recoveryTime: number;

        while (!recovered && (performance.now() - startTime) < 60000) { // 60s timeout
            const health = await this.system.monitoring?.getHealth();
            if (health?.every(h => h.status === 'healthy')) {
                recovered = true;
                recoveryTime = performance.now() - startTime;
            } else {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }

        if (recovered) {
            this.metrics.recordOperationMetrics('system-recovery', [recoveryTime!]);
        } else {
            throw new Error('System failed to recover within timeout');
        }
    }

    public getMetrics(): any {
        return this.metrics.getMetrics();
    }

    public async shutdown(): Promise<void> {
        await this.system.shutdown();
    }
}