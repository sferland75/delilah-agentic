import { AgentMetadata, SectionContent, DetailLevel, ProcessedData } from '../types';

export class BaseAgent {
    protected name: string;
    protected priority: number;
    protected narrativeEnabled: boolean;
    protected contextualAnalysis: boolean;

    constructor(
        name: string = 'Base Section',
        priority: number = 1,
        options: {
            narrativeEnabled?: boolean;
            contextualAnalysis?: boolean;
        } = {}
    ) {
        this.name = name;
        this.priority = priority;
        this.narrativeEnabled = options.narrativeEnabled ?? false;
        this.contextualAnalysis = options.contextualAnalysis ?? false;
    }

    public getMetadata(): AgentMetadata {
        return {
            name: this.name,
            priority: this.priority
        };
    }

    public async processData(input: { raw: any }): Promise<ProcessedData> {
        try {
            if (!input || !input.raw) {
                return {
                    valid: false,
                    data: null,
                    errors: ['No data provided']
                };
            }

            // Basic validation - override in child classes for specific validation
            return {
                valid: true,
                data: input.raw
            };
        } catch (error) {
            return {
                valid: false,
                data: null,
                errors: [`Process error: ${error instanceof Error ? error.message : 'Unknown error'}`]
            };
        }
    }

    public async generateSection(input: { raw: any }): Promise<SectionContent> {
        try {
            const processed = await this.processData(input);
            
            if (!processed.valid || !processed.data) {
                return {
                    sectionName: this.name,
                    content: 'Standard: Required data not found',
                    orderNumber: this.priority,
                    valid: false,
                    errors: processed.errors
                };
            }

            let content: string;
            if (this.narrativeEnabled) {
                try {
                    content = await this.generateNarrativeContent(processed.data);
                } catch (error) {
                    content = await this.getFormattedContent(processed.data, 'standard');
                }
            } else {
                content = await this.getFormattedContent(processed.data, 'standard');
            }

            return {
                sectionName: this.name,
                content,
                orderNumber: this.priority,
                valid: true
            };
        } catch (error) {
            return {
                sectionName: this.name,
                content: `Standard: Catastrophic failure - ${error instanceof Error ? error.message : 'Unknown error'}`,
                orderNumber: this.priority,
                valid: false,
                errors: ['Catastrophic failure in section generation']
            };
        }
    }

    protected async getFormattedContent(data: any, level: DetailLevel): Promise<string> {
        try {
            // Basic implementation - should be overridden in child classes
            const prefix = 'Standard: ';
            switch (level) {
                case 'brief':
                    return `${prefix}Brief summary of ${this.name}`;
                case 'detailed':
                    return `${prefix}Detailed analysis of ${this.name}`;
                case 'standard':
                default:
                    return `${prefix}Standard report for ${this.name}`;
            }
        } catch (error) {
            return `Standard: Error formatting content - ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
    }

    // For testing purposes
    public async testGetFormattedContent(data: any, level: DetailLevel): Promise<string> {
        return this.getFormattedContent(data, level);
    }

    protected async generateNarrativeContent(data: any): Promise<string> {
        // Base implementation - should be overridden in child classes
        return `Standard: Narrative content for ${this.name}`;
    }
}