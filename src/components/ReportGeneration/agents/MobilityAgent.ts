import { BaseAgent } from './core/BaseAgent';
import { AgentContext, ProcessedData } from '../types';
import { Assessment } from '../../../types/report';

interface MobilityData {
    balance?: {
        score: number;
        notes: string;
    };
    transfers?: {
        [key: string]: string;
    };
    posture?: {
        [key: string]: string;
    };
}

export class MobilityAgent extends BaseAgent {
    constructor(context: AgentContext) {
        super(context);
        this.name = 'Mobility Assessment';
        this.description = 'Assesses mobility, balance, and transfers';
        this.orderNumber = 3;
        this.dataPath = ['assessment', 'functionalAssessment'];
    }

    protected async processData(data: Assessment): Promise<ProcessedData> {
        try {
            const processed = await super.processData(data);
            if (!processed.valid) return processed;

            const functionalAssessment = processed.data;
            const mobilityData: MobilityData = {
                balance: functionalAssessment.bergBalance ? {
                    score: functionalAssessment.bergBalance.totalScore,
                    notes: functionalAssessment.bergBalance.generalNotes
                } : undefined,
                transfers: functionalAssessment.transfers || {},
                posture: functionalAssessment.posturalTolerances || {}
            };

            return this.formatSuccess(mobilityData);
        } catch (error) {
            return this.formatError(error.message || 'Error processing mobility data');
        }
    }

    protected formatBrief(data: MobilityData): string {
        const parts = [];

        if (data.balance) {
            parts.push(`Balance Assessment Score: ${data.balance.score}/56`);
        }

        if (Object.keys(data.transfers || {}).length > 0) {
            parts.push('Transfer status: ' + this.formatTransfers(data.transfers));
        }

        return parts.join('\n') || 'No mobility data available';
    }

    protected formatStandard(data: MobilityData): string {
        const parts = [];

        if (data.balance) {
            parts.push('Balance Assessment:');
            parts.push(`- Total Score: ${data.balance.score}/56`);
            if (data.balance.notes) {
                parts.push(`- Notes: ${data.balance.notes}`);
            }
        }

        if (Object.keys(data.transfers || {}).length > 0) {
            parts.push('\nTransfers:');
            parts.push(this.formatTransfers(data.transfers));
        }

        if (Object.keys(data.posture || {}).length > 0) {
            parts.push('\nPostural Tolerances:');
            Object.entries(data.posture).forEach(([position, status]) => {
                parts.push(`- ${position}: ${status}`);
            });
        }

        return parts.join('\n') || 'No mobility data available';
    }

    protected formatDetailed(data: MobilityData): string {
        return this.formatStandard(data);
    }

    private formatTransfers(transfers: any): string {
        if (!transfers) return 'No transfer data available';

        return Object.entries(transfers)
            .map(([type, status]) => `- ${type.replace(/_/g, ' ')}: ${status}`)
            .join('\n');
    }

    private getBalanceRiskLevel(score: number): string {
        if (score >= 45) return 'Low';
        if (score >= 35) return 'Moderate';
        return 'High';
    }
}