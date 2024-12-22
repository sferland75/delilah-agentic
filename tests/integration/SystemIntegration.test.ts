import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { SystemCoordinator } from '../../src/core/coordinator/SystemCoordinator';
import { DataProcessor } from '../../src/core/processing/DataProcessor';
import { MonitoringService } from '../../src/core/monitoring/MonitoringService';
import { AnalysisAgent } from '../../src/agents/AnalysisAgent';
import { SpecializedAssessment } from '../../src/agents/assessment/SpecializedAssessment';
import { PatternLearner } from '../../src/core/learning/PatternLearner';

describe('System Integration', () => {
    let systemCoordinator: SystemCoordinator;
    let dataProcessor: DataProcessor;
    let monitoringService: MonitoringService;
    let metrics: any[] = [];
    let alerts: any[] = [];
    
    beforeAll(async () => {
        // Initialize monitoring first to track system startup
        monitoringService = new MonitoringService({
            enableMetrics: true,
            enableHealth: true,
            enableAlerts: true,
            metricsInterval: 1000,
            healthCheckInterval: 2000
        });

        // Track metrics and alerts
        monitoringService.on('metric', (metric) => metrics.push(metric));
        monitoringService.on('alert', (alert) => alerts.push(alert));

        // Initialize core system
        systemCoordinator = new SystemCoordinator({
            enableLearning: true,
            confidenceThreshold: 0.75
        });

        // Initialize data processor
        dataProcessor = new DataProcessor(systemCoordinator, {
            validateInput: true,
            trackLineage: true
        });

        // Register components with monitoring
        monitoringService.registerComponent('coordinator', async () => ({
            componentId: 'coordinator',
            status: 'healthy',
            timestamp: Date.now()
        }));

        monitoringService.registerComponent('processor', async () => ({
            componentId: 'processor',
            status: 'healthy',
            timestamp: Date.now()
        }));

        // Configure alerts
        monitoringService.configureAlert({
            id: 'high-latency',
            name: 'High Processing Latency',
            componentId: 'processor',
            rule: {
                type: 'threshold',
                condition: 'above',
                threshold: 1000 // 1 second
            },
            priority: 'high'
        });
    });

    afterAll(async () => {
        await systemCoordinator.shutdown();
        await monitoringService.shutdown();
    });

    describe('End-to-End Processing', () => {
        it('should process data through the entire pipeline', async () => {
            const testData = {
                id: 'test-1',
                content: 'Sample test data for analysis',
                metadata: {
                    source: 'integration-test',
                    timestamp: Date.now()
                }
            };

            // Process data through the system
            const result = await dataProcessor.processData(testData, 'json');

            // Verify processing result
            expect(result).toBeDefined();
            expect(result.analysis).toBeDefined();
            expect(result.assessment).toBeDefined();
            expect(result.report).toBeDefined();

            // Verify data lineage
            const lineage = dataProcessor.getLineage(result.processId);
            expect(lineage.nodes.length).toBeGreaterThan(0);

            // Check monitoring metrics
            const processingMetrics = metrics.filter(m => 
                m.componentId === 'processor' && 
                m.name === 'processing_time'
            );
            expect(processingMetrics.length).toBeGreaterThan(0);
        });

        it('should handle batch processing', async () => {
            const testBatch = Array.from({ length: 5 }, (_, i) => ({
                id: `batch-${i}`,
                content: `Batch test data ${i}`,
                metadata: {
                    source: 'integration-test',
                    timestamp: Date.now()
                }
            }));

            const results = await dataProcessor.processBatch(testBatch, 'json');

            expect(results.length).toBe(testBatch.length);
            results.forEach(result => {
                expect(result.analysis).toBeDefined();
                expect(result.assessment).toBeDefined();
                expect(result.report).toBeDefined();
            });
        });

        it('should learn and apply patterns', async () => {
            // First processing to establish patterns
            const initialData = {
                id: 'pattern-test-1',
                content: 'Pattern test data with specific characteristics',
                metadata: {
                    source: 'integration-test',
                    type: 'pattern-learning'
                }
            };

            await dataProcessor.processData(initialData, 'json');

            // Process similar data
            const similarData = {
                id: 'pattern-test-2',
                content: 'Similar pattern test data with matching characteristics',
                metadata: {
                    source: 'integration-test',
                    type: 'pattern-learning'
                }
            };

            const result = await dataProcessor.processData(similarData, 'json');

            // Verify pattern recognition
            expect(result.analysis.patterns.length).toBeGreaterThan(0);
            expect(result.analysis.confidence.score).toBeGreaterThan(0.7);
        });

        it('should handle error conditions gracefully', async () => {
            const invalidData = {
                // Missing required fields
                content: 'Invalid test data'
            };

            try {
                await dataProcessor.processData(invalidData, 'json');
                fail('Should have thrown validation error');
            } catch (error) {
                expect(error.code).toBe('VALIDATION_ERROR');
            }

            // Check for error alerts
            const errorAlerts = alerts.filter(a => 
                a.config.componentId === 'processor' && 
                a.trigger.type === 'validation'
            );
            expect(errorAlerts.length).toBeGreaterThan(0);
        });
    });

    describe('System Health', () => {
        it('should maintain system health metrics', async () => {
            const health = await monitoringService.getHealth();
            expect(health.length).toBeGreaterThan(0);
            
            const coordinatorHealth = health.find(h => h.componentId === 'coordinator');
            expect(coordinatorHealth?.status).toBe('healthy');

            const processorHealth = health.find(h => h.componentId === 'processor');
            expect(processorHealth?.status).toBe('healthy');
        });

        it('should track system metrics', async () => {
            const systemMetrics = await monitoringService.getMetrics();
            expect(systemMetrics.length).toBeGreaterThan(0);

            // Verify essential metrics are being tracked
            const metricTypes = new Set(systemMetrics.map(m => m.name));
            expect(metricTypes.has('processing_time')).toBe(true);
            expect(metricTypes.has('memory_usage')).toBe(true);
            expect(metricTypes.has('pattern_count')).toBe(true);
        });

        it('should generate system overview', async () => {
            const overview = await monitoringService.getSystemOverview();
            
            expect(overview.metrics).toBeDefined();
            expect(overview.health).toBeDefined();
            expect(overview.alerts).toBeDefined();
        });
    });
});
