import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { SystemCoordinator } from '../../../../src/core/coordinator/SystemCoordinator';
import { AgentCoordinator } from '../../../../src/core/coordinator/AgentCoordinator';
import { LearningDistributor } from '../../../../src/core/learning/LearningDistributor';
import { SystemState, ProcessingError } from '../../../../src/types';

// Mock dependencies
jest.mock('../../../../src/core/coordinator/AgentCoordinator');
jest.mock('../../../../src/core/learning/LearningDistributor');

describe('SystemCoordinator', () => {
    let systemCoordinator: SystemCoordinator;
    let mockAgentCoordinator: jest.Mocked<AgentCoordinator>;
    let mockLearningDistributor: jest.Mocked<LearningDistributor>;

    beforeEach(() => {
        // Clear all mocks
        jest.clearAllMocks();

        // Initialize coordinator with default config
        systemCoordinator = new SystemCoordinator({
            enableLearning: true,
            confidenceThreshold: 0.75,
            retryAttempts: 3,
            maxConcurrent: 5
        });
    });

    describe('initialization', () => {
        it('should initialize with default configuration', () => {
            const state = systemCoordinator.getSystemState();
            expect(state.status).toBe('ready');
            expect(state.agentStatus.size).toBe(3);
            expect(state.activeProcesses.size).toBe(0);
        });

        it('should handle initialization errors gracefully', () => {
            (AgentCoordinator as jest.MockedClass<typeof AgentCoordinator>)
                .mockImplementationOnce(() => {
                    throw new Error('Initialization failed');
                });

            const coordinator = new SystemCoordinator();
            const state = coordinator.getSystemState();

            expect(state.status).toBe('error');
            expect(state.errors).toHaveLength(1);
            expect(state.errors[0].component).toBe('SystemCoordinator');
        });
    });

    describe('processData', () => {
        const testData = { id: 'test-1', content: 'Test data' };

        it('should process data successfully', async () => {
            const result = await systemCoordinator.processData(testData);

            expect(result).toBeDefined();
            expect(result.processId).toBeDefined();
            expect(result.analysis).toBeDefined();
            expect(result.assessment).toBeDefined();
            expect(result.report).toBeDefined();
            expect(result.metadata.processingTime).toBeGreaterThan(0);
        });

        it('should enforce concurrent processing limits', async () => {
            const coordinator = new SystemCoordinator({ maxConcurrent: 1 });
            const process1 = coordinator.processData(testData);
            await expect(coordinator.processData(testData))
                .rejects
                .toThrow('Maximum concurrent processes reached');
            await process1;
        });

        it('should retry failed operations', async () => {
            let attempts = 0;
            mockAgentCoordinator.request.mockImplementation((type: string) => {
                if (type === 'analysis-complete') {
                    attempts++;
                    if (attempts < 3) {
                        return Promise.reject(new Error('Analysis failed'));
                    }
                }
                return Promise.resolve({ data: 'mock result' });
            });

            const result = await systemCoordinator.processData(testData);
            expect(result).toBeDefined();
            expect(attempts).toBe(3);
        });
    });

    describe('error handling', () => {
        it('should handle and record agent errors', () => {
            const error = new Error('Test error');
            const agentId = 'analysis';

            mockAgentCoordinator.emit('agentError', error, agentId);

            const state = systemCoordinator.getSystemState();
            expect(state.errors).toHaveLength(1);
            expect(state.agentStatus.get(agentId)?.status).toBe('error');
        });

        it('should maintain error history', async () => {
            mockAgentCoordinator.emit('agentError', new Error('Error 1'), 'analysis');
            mockAgentCoordinator.emit('agentError', new Error('Error 2'), 'assessment');

            const state = systemCoordinator.getSystemState();
            expect(state.errors).toHaveLength(2);
            expect(state.errors[0].timestamp).toBeLessThan(state.errors[1].timestamp);
        });
    });

    describe('shutdown', () => {
        it('should shutdown gracefully', async () => {
            // Start a process
            const processPromise = systemCoordinator.processData(testData);
            
            // Begin shutdown
            const shutdownPromise = systemCoordinator.shutdown();
            
            // Check intermediate state
            expect(systemCoordinator.getSystemState().status).toBe('shutting_down');
            
            // Wait for completion
            await Promise.all([processPromise, shutdownPromise]);
            
            // Verify final state
            expect(systemCoordinator.getSystemState().status).toBe('shutdown');
            expect(systemCoordinator.getSystemState().activeProcesses.size).toBe(0);
        });

        it('should wait for active processes during shutdown', async () => {
            // Mock a long-running process
            const longProcess = new Promise(resolve => setTimeout(resolve, 100));
            systemCoordinator.getSystemState().activeProcesses.set('test-process', {
                startTime: Date.now(),
                status: 'processing',
                data: testData,
                promise: longProcess
            });

            const shutdownPromise = systemCoordinator.shutdown();
            expect(systemCoordinator.getSystemState().status).toBe('shutting_down');
            
            await shutdownPromise;
            expect(systemCoordinator.getSystemState().status).toBe('shutdown');
        });

        it('should prevent new processes during shutdown', async () => {
            const shutdownPromise = systemCoordinator.shutdown();
            
            await expect(systemCoordinator.processData(testData))
                .rejects
                .toThrow('System not ready');
                
            await shutdownPromise;
        });
    });

    describe('state management', () => {
        it('should track active processes', async () => {
            const processPromise = systemCoordinator.processData(testData);
            
            const state = systemCoordinator.getSystemState();
            expect(state.activeProcesses.size).toBe(1);
            
            await processPromise;
            expect(systemCoordinator.getSystemState().activeProcesses.size).toBe(0);
        });

        it('should clean up completed processes', async () => {
            await systemCoordinator.processData(testData);
            expect(systemCoordinator.getSystemState().activeProcesses.size).toBe(0);
        });

        it('should track agent status changes', async () => {
            const processPromise = systemCoordinator.processData(testData);
            
            const processingState = systemCoordinator.getSystemState();
            expect(processingState.agentStatus.get('analysis')?.status).toBe('processing');
            
            await processPromise;
            const finalState = systemCoordinator.getSystemState();
            expect(finalState.agentStatus.get('analysis')?.status).toBe('ready');
        });
    });
});}