import { BaseAgent } from './core/BaseAgent';
import { Assessment, ProcessedData } from '../../../types/report';

interface TransferData {
    bedMobility?: {
        independence: string;
        modifications?: string[];
        comments?: string;
    };
    sitToStand?: {
        independence: string;
        modifications?: string[];
        comments?: string;
    };
    toileting?: {
        independence: string;
        modifications?: string[];
        comments?: string;
    };
    shower?: {
        independence: string;
        modifications?: string[];
        comments?: string;
    };
    car?: {
        independence: string;
        modifications?: string[];
        comments?: string;
    };
}

export class TransfersAgent extends BaseAgent {
    constructor(context: any) {
        super(context);
        this.name = 'Transfers Assessment';
        this.description = 'Analysis of transfer abilities and modifications';
        this.orderNumber = 5.0;
        this.dataPath = ['functionalAssessment', 'transfers'];
    }

    async processData(data: Assessment): Promise<ProcessedData> {
        try {
            // Extract transfer data from multiple locations for comprehensive analysis
            const transfers = this.extractTransferData(data);
            if (!transfers) {
                return this.formatError('No transfer data available');
            }

            // Process balance data if available
            const balance = data.functionalAssessment?.bergBalance;
            const balanceRisk = this.analyzeBalanceRisk(balance);

            return this.formatSuccess({
                transfers,
                balanceRisk,
                recommendations: this.generateRecommendations(transfers, balanceRisk)
            });
        } catch (error) {
            return this.formatError('Error processing transfer data');
        }
    }

    private extractTransferData(data: Assessment): TransferData | null {
        const functionalData = data.functionalAssessment?.transfers;
        const adlData = data.adl;

        if (!functionalData && !adlData) return null;

        return {
            bedMobility: functionalData?.bedMobility || {
                independence: adlData?.transfers?.independence || 'Not assessed'
            },
            sitToStand: functionalData?.sitToStand || {
                independence: adlData?.transfers?.independence || 'Not assessed'
            },
            toileting: {
                independence: adlData?.toileting?.independence || 'Not assessed',
                modifications: adlData?.toileting?.modifications
            },
            shower: {
                independence: adlData?.bathing?.independence || 'Not assessed',
                modifications: adlData?.bathing?.modifications
            },
            car: functionalData?.car
        };
    }

    private analyzeBalanceRisk(balance: any): string {
        if (!balance?.totalScore) return 'Not assessed';

        const score = balance.totalScore;
        if (score >= 45) return 'Low fall risk';
        if (score >= 35) return 'Moderate fall risk';
        return 'High fall risk';
    }

    private generateRecommendations(transfers: TransferData, balanceRisk: string): string[] {
        const recommendations: string[] = [];

        // Check if any transfers require modifications
        const needsModifications = Object.values(transfers).some(t => 
            t?.independence?.toLowerCase().includes('modified') ||
            (t?.modifications && t.modifications.length > 0)
        );

        if (needsModifications) {
            recommendations.push('Continue use of current transfer modifications for safety');
        }

        // Balance-based recommendations
        if (balanceRisk !== 'Not assessed') {
            if (balanceRisk === 'High fall risk') {
                recommendations.push('Recommend supervision for all transfers');
                recommendations.push('Consider physical therapy for transfer training');
            } else if (balanceRisk === 'Moderate fall risk') {
                recommendations.push('Monitor safety with transfers');
                recommendations.push('Consider balance training program');
            }
        }

        return recommendations;
    }

    protected formatBrief(data: ProcessedData): string {
        if (!data.valid) {
            return 'Transfer status not available';
        }

        const transfers = data.data.transfers;
        const sections: string[] = [];

        sections.push(`Patient demonstrates ${transfers.bedMobility?.independence || 'unknown'} transfer abilities.`);
        
        if (data.data.balanceRisk !== 'Not assessed') {
            sections.push(`Balance testing indicates ${data.data.balanceRisk}.`);
        }

        return sections.join(' ');
    }

    protected formatStandard(data: ProcessedData): string {
        if (!data.valid) {
            return 'Transfer status not available';
        }

        const transfers = data.data.transfers;
        const sections: string[] = [];

        // Transfer status
        sections.push('Transfer Status:');
        Object.entries(transfers).forEach(([type, details]) => {
            if (!details) return;

            let line = `- ${type}: ${details.independence}`;
            if (details.modifications?.length) {
                line += ` using ${details.modifications.join(', ')}`;
            }
            if (details.comments) {
                line += ` - ${details.comments}`;
            }
            sections.push(line);
        });

        // Balance risk
        if (data.data.balanceRisk !== 'Not assessed') {
            sections.push(`\nBalance Assessment: ${data.data.balanceRisk}`);
        }

        // Recommendations
        if (data.data.recommendations?.length) {
            sections.push('\nRecommendations:');
            data.data.recommendations.forEach(rec => {
                sections.push(`- ${rec}`);
            });
        }

        return sections.join('\n');
    }

    protected formatDetailed(data: ProcessedData): string {
        if (!data.valid) {
            return 'Transfer status not available';
        }

        const transfers = data.data.transfers;
        const sections: string[] = [];

        sections.push('TRANSFER AND MOBILITY ASSESSMENT');
        sections.push('==============================\n');

        // Detailed transfer analysis
        sections.push('Transfer Analysis:');
        sections.push('-----------------');
        Object.entries(transfers).forEach(([type, details]) => {
            if (!details) return;

            sections.push(`\n${type.toUpperCase()}:`);
            sections.push(`Independence Level: ${details.independence}`);
            
            if (details.modifications?.length) {
                sections.push(`Modifications: ${details.modifications.join(', ')}`);
            }
            
            if (details.comments) {
                sections.push(`Comments: ${details.comments}`);
            }
        });

        // Balance assessment
        sections.push('\nBALANCE ASSESSMENT');
        sections.push('-----------------');
        sections.push(`Risk Level: ${data.data.balanceRisk}`);

        // Recommendations
        if (data.data.recommendations?.length) {
            sections.push('\nRECOMMENDATIONS');
            sections.push('--------------');
            data.data.recommendations.forEach(rec => {
                sections.push(`• ${rec}`);
            });
        }

        return sections.join('\n');
    }
}