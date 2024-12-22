import { AgentCoordinator } from './AgentCoordinator';
import { LearningDistributor } from '../learning/LearningDistributor';
import { AnalysisAgent } from '../../agents/AnalysisAgent';
import { SpecializedAssessment } from '../../agents/assessment/SpecializedAssessment';
import { ReportGenerator } from '../../services/ReportGenerator';
import { SystemState, ProcessingResult, AgentStatus } from '../../types';

export interface SystemCoordinatorConfig {
    enableLearning?: boolean;
    confidenceThreshold?: number;
    retryAttempts?: number;
    maxConcurrent?: number;
}

export class SystemCoordinator {
    private agentCoordinator: AgentCoordinator;
    private learningDistributor: LearningDistributor;
    private analysisAgent: AnalysisAgent;
    private assessmentAgent: SpecializedAssessment;
    private reportGenerator: ReportGenerator;
    private systemState: SystemState;
    private config: Required<SystemCoordinatorConfig>;

    constructor(config: SystemCoordinatorConfig = {}) {
        this.config = {
            enableLearning: config.enableLearning ?? true,
            confidenceThreshold: config.confidenceThreshold ?? 0.75,
            retryAttempts: config.retryAttempts ?? 3,
            maxConcurrent: config.maxConcurrent ?? 5
        };

        this.initializeSystem();
    }

    private initializeSystem(): void {
        this.systemState = {
            status: 'initializing',
            activeProcesses: new Map(),
            agentStatus: new Map(),
            errors: []
        };

        try {
            this.initializeComponents();
            this.setupEventHandlers();
            this.systemState.status = 'ready';
        } catch (error) {
            this.systemState.status = 'error';
            this.systemState.errors.push({
                timestamp: Date.now(),
                component: 'SystemCoordinator',
                message: error.message
            });
        }
    }

    private initializeComponents(): void {
        this.agentCoordinator = new AgentCoordinator();
        this.learningDistributor = new LearningDistributor({
            enabled: this.config.enableLearning
        });

        // Initialize agents
        this.analysisAgent = new AnalysisAgent(
            this.agentCoordinator,
            this.learningDistributor,
            { confidenceThreshold: this.config.confidenceThreshold }
        );

        this.assessmentAgent = new SpecializedAssessment({
            confidenceThreshold: this.config.confidenceThreshold
        });

        this.reportGenerator = new ReportGenerator(
            this.agentCoordinator,
            { confidenceThreshold: this.config.confidenceThreshold }
        );

        // Register agent statuses
        this.systemState.agentStatus.set('analysis', { status: 'ready', lastActive: null });
        this.systemState.agentStatus.set('assessment', { status: 'ready', lastActive: null });
        this.systemState.agentStatus.set('report', { status: 'ready', lastActive: null });
    }

    private setupEventHandlers(): void {
        this.agentCoordinator.on('agentError', this.handleAgentError.bind(this));
        this.learningDistributor.on('learningUpdate', this.handleLearningUpdate.bind(this));
    }

    public async processData(data: any): Promise<ProcessingResult> {
        if (this.systemState.status !== 'ready') {
            throw new Error(`System not ready. Current status: ${this.systemState.status}`);
        }

        if (this.systemState.activeProcesses.size >= this.config.maxConcurrent) {
            throw new Error('Maximum concurrent processes reached');
        }

        const processId = this.generateProcessId();
        this.systemState.activeProcesses.set(processId, {
            startTime: Date.now(),
            status: 'started',
            data: data
        });

        try {
            const result = await this.executeProcessingPipeline(processId, data);
            this.updateProcessStatus(processId, 'completed');
            return result;
        } catch (error) {
            this.handleProcessingError(processId, error);
            throw error;
        } finally {
            this.cleanupProcess(processId);
        }
    }

    private async executeProcessingPipeline(
        processId: string,
        data: any
    ): Promise<ProcessingResult> {
        // Update agent statuses
        this.updateAgentStatus('analysis', 'processing');
        this.updateAgentStatus('assessment', 'processing');

        // Run analysis and assessment in parallel
        const [analysisResult, assessmentResult] = await Promise.all([
            this.executeWithRetry(() => this.analysisAgent.analyze(data)),
            this.executeWithRetry(() => this.assessmentAgent.assess(data))
        ]);

        // Update agent statuses
        this.updateAgentStatus('analysis', 'ready');
        this.updateAgentStatus('assessment', 'ready');

        // Generate report
        this.updateAgentStatus('report', 'processing');
        const report = await this.executeWithRetry(() =>
            this.reportGenerator.generateReport(data)
        );
        this.updateAgentStatus('report', 'ready');

        return {
            processId,
            timestamp: Date.now(),
            analysis: analysisResult,
            assessment: assessmentResult,
            report,
            metadata: {
                processingTime: Date.now() - this.systemState.activeProcesses.get(processId)!.startTime,
                learningEnabled: this.config.enableLearning
            }
        };
    }

    private async executeWithRetry<T>(
        operation: () => Promise<T>,
        attempts: number = this.config.retryAttempts
    ): Promise<T> {
        let lastError: Error;

        for (let i = 0; i < attempts; i++) {
            try {
                return await operation();
            } catch (error) {
                lastError = error;
                if (i < attempts - 1) {
                    await this.delay(Math.pow(2, i) * 1000); // Exponential backoff
                }
            }
        }

        throw lastError!;
    }

    private updateAgentStatus(agent: string, status: AgentStatus['status']): void {
        const agentStatus = this.systemState.agentStatus.get(agent);
        if (agentStatus) {
            agentStatus.status = status;
            agentStatus.lastActive = Date.now();
        }
    }

    private handleAgentError(error: Error, agentId: string): void {
        this.systemState.errors.push({
            timestamp: Date.now(),
            component: agentId,
            message: error.message
        });

        // Update agent status
        const agentStatus = this.systemState.agentStatus.get(agentId);
        if (agentStatus) {
            agentStatus.status = 'error';
            agentStatus.lastError = error.message;
        }
    }

    private handleLearningUpdate(update: any): void {
        // Handle learning updates if needed
    }

    private updateProcessStatus(processId: string, status: string): void {
        const process = this.systemState.activeProcesses.get(processId);
        if (process) {
            process.status = status;
        }
    }

    private handleProcessingError(processId: string, error: Error): void {
        this.systemState.errors.push({
            timestamp: Date.now(),
            component: 'ProcessingPipeline',
            processId,
            message: error.message
        });

        this.updateProcessStatus(processId, 'error');
    }

    private cleanupProcess(processId: string): void {
        this.systemState.activeProcesses.delete(processId);
    }

    private generateProcessId(): string {
        return `process-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    public getSystemState(): SystemState {
        return { ...this.systemState };
    }

    public async shutdown(): Promise<void> {
        this.systemState.status = 'shutting_down';
        
        // Wait for active processes to complete
        if (this.systemState.activeProcesses.size > 0) {
            await Promise.all(
                Array.from(this.systemState.activeProcesses.values())
                    .map(process => process.promise)
            );
        }

        this.systemState.status = 'shutdown';
    }
}