import { BaseAgent } from '../agents/core/BaseAgent';
import { AgentContext } from '../types';
import { Assessment } from '../../../types/report';

export class TestAgent extends BaseAgent {
    constructor(context: AgentContext) {
        super(context);
        this.name = 'Test Agent';
        this.description = 'Agent for testing purposes';
        this.orderNumber = 1;
        this.dataPath = ['assessment'];
    }

    protected async processData(data: Assessment): Promise<any> {
        const processed = await super.processData(data);
        if (!processed.valid) return processed;

        return this.formatSuccess({
            ...processed.data,
            processed: true,
            timestamp: new Date().toISOString()
        });
    }

    protected formatBrief(data: any): string {
        return `Brief: ${this.name} output - ${JSON.stringify(data, null, 2)}`;
    }

    protected formatStandard(data: any): string {
        return `Standard: ${this.name} output - ${JSON.stringify(data, null, 2)}`;
    }

    protected formatDetailed(data: any): string {
        return `Detailed: ${this.name} output - ${JSON.stringify(data, null, 2)}`;
    }
}