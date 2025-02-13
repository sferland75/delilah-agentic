import { AgentContext, ProcessedData, ReportSection, DetailLevel } from '../../types';
import { Assessment } from '../../../../types/report';
import { NarrativeEngine } from '../../narrative/NarrativeEngine';

export abstract class BaseAgent {
    protected context: AgentContext;
    protected name: string = '';
    protected description: string = '';
    protected orderNumber: number = 0;
    protected dataPath: string[] = [];
    protected narrativeEngine?: NarrativeEngine;

    constructor(context: AgentContext) {
        this.context = context;
        this.initializeNarrativeEngine();
    }

    private initializeNarrativeEngine() {
        if (this.context?.features?.enableNarrative) {
            try {
                this.narrativeEngine = new NarrativeEngine({
                    enableContextualAnalysis: this.context.features.enableContextualAnalysis || false
                });
            } catch (error) {
                console.warn('Failed to initialize narrative engine:', error);
            }
        }
    }

    public async generateSection(data: Assessment): Promise<ReportSection> {
        try {
            // First try to process the data
            const processed = await this.processData(data);
            if (!processed || !processed.valid) {
                return this.createErrorSection(processed?.error || 'Error processing data');
            }

            // If narrative is enabled and available, try that first
            if (this.hasNarrativeEngine() && processed.valid) {
                try {
                    const narrative = await this.generateNarrativeContent(processed.data);
                    if (narrative) {
                        return this.createSuccessSection(narrative);
                    }
                } catch (error) {
                    console.warn('Narrative generation failed, falling back to standard formatting:', error);
                }
            }

            // Fall back to standard formatting
            const content = await this.getFormattedContent(processed, this.context.config.detailLevel || 'standard');
            return this.createSuccessSection(content);

        } catch (error) {
            return this.createErrorSection(error.message || 'Error generating section');
        }
    }

    protected async processData(data: Assessment): Promise<ProcessedData> {
        try {
            if (!this.validateData(data)) {
                return this.formatError('Invalid data structure');
            }

            const extractedData = this.extractData(data, this.dataPath);
            if (!extractedData) {
                return this.formatError('Required data not found');
            }

            return this.formatSuccess(extractedData);
        } catch (error) {
            return this.formatError(error.message || 'Error processing data');
        }
    }

    protected getFormattedContent(data: ProcessedData, detailLevel: DetailLevel = 'standard'): string {
        if (!data.valid) return '';
        
        switch (detailLevel.toLowerCase()) {
            case 'brief':
                return this.formatBrief(data.data);
            case 'detailed':
                return this.formatDetailed(data.data);
            case 'standard':
            default:
                return this.formatStandard(data.data);
        }
    }

    protected abstract formatBrief(data: any): string;
    protected abstract formatStandard(data: any): string;
    protected abstract formatDetailed(data: any): string;

    // Narrative support
    protected async generateNarrativeContent(data: any): Promise<string | null> {
        if (!this.narrativeEngine) return null;
        try {
            return await this.narrativeEngine.generateNarrative(data, this.name.toLowerCase());
        } catch (error) {
            console.warn('Failed to generate narrative:', error);
            return null;
        }
    }

    public hasNarrativeEngine(): boolean {
        return !!this.narrativeEngine;
    }

    // Helper methods
    private createSuccessSection(content: string): ReportSection {
        return {
            name: this.name,
            type: 'section',
            orderNumber: this.orderNumber,
            content,
            valid: true
        };
    }

    private createErrorSection(error: string): ReportSection {
        return {
            name: this.name,
            type: 'section',
            orderNumber: this.orderNumber,
            content: error,
            valid: false,
            error
        };
    }

    protected validateData(data: any): boolean {
        return data && typeof data === 'object';
    }

    protected extractData(data: Assessment, path: string[]): any {
        let current = data;
        for (const key of path) {
            if (!current || !current[key]) return undefined;
            current = current[key];
        }
        return current;
    }

    protected formatError(message: string): ProcessedData {
        return {
            valid: false,
            error: message
        };
    }

    protected formatSuccess(data: any): ProcessedData {
        return {
            valid: true,
            data
        };
    }

    // Public getters (mainly for testing)
    public getName(): string {
        return this.name;
    }

    public getDescription(): string {
        return this.description;
    }

    public getOrderNumber(): number {
        return this.orderNumber;
    }

    public getDataPath(): string[] {
        return this.dataPath;
    }

    public getContext(): AgentContext {
        return this.context;
    }
}