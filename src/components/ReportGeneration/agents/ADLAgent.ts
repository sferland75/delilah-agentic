import { BaseAgent } from './core/BaseAgent';
import { Assessment, ProcessedData } from '../../../types/report';

export class ADLAgent extends BaseAgent {
    constructor(context: any) {
        super(context);
        this.name = 'ADL Assessment';
        this.description = 'Analysis of Activities of Daily Living';
        this.orderNumber = 4.0;
        this.dataPath = ['adl'];
    }

    async processData(data: Assessment): Promise<ProcessedData> {
        try {
            const adl = data.adl;
            if (!adl) {
                return {
                    valid: false,
                    error: 'No ADL data available'
                };
            }

            return {
                valid: true,
                data: {
                    feeding: this.processADLItem(adl.feeding),
                    bathing: this.processADLItem(adl.bathing),
                    dressing: this.processADLItem(adl.dressing),
                    toileting: this.processADLItem(adl.toileting),
                    transfers: this.processADLItem(adl.transfers)
                }
            };
        } catch (error) {
            return {
                valid: false,
                error: 'Error processing ADL data'
            };
        }
    }

    private processADLItem(item: any) {
        if (!item) return null;
        return {
            independence: item.independence || 'Not assessed',
            modifications: item.modifications || [],
            comments: item.comments || '',
            equipment: item.equipment || []
        };
    }

    protected formatBrief(data: ProcessedData): string {
        if (!data.valid || !data.data) {
            return 'ADL status not available';
        }

        const items = Object.entries(data.data)
            .filter(([_, value]) => value)
            .map(([key, value]: [string, any]) => 
                `${key}: ${value.independence}`
            );

        return items.length ? items.join(', ') : 'No ADL information available';
    }

    protected formatStandard(data: ProcessedData): string {
        if (!data.valid || !data.data) {
            return 'ADL status not available';
        }

        const sections = [];
        for (const [activity, details] of Object.entries(data.data)) {
            if (!details) continue;

            let section = `${activity}: ${(details as any).independence}`;
            if ((details as any).modifications?.length) {
                section += ` using ${(details as any).modifications.join(', ')}`;
            }
            if ((details as any).comments) {
                section += ` - ${(details as any).comments}`;
            }
            sections.push(section);
        }

        return sections.length ? sections.join('\n') : 'No ADL information available';
    }

    protected formatDetailed(data: ProcessedData): string {
        if (!data.valid || !data.data) {
            return 'ADL status not available';
        }

        const sections = [];
        sections.push('Activities of Daily Living Assessment');
        sections.push('=====================================');

        for (const [activity, details] of Object.entries(data.data)) {
            if (!details) continue;

            sections.push(`\n${activity.toUpperCase()}`);
            sections.push(`Independence Level: ${(details as any).independence}`);
            
            if ((details as any).modifications?.length) {
                sections.push(`Modifications: ${(details as any).modifications.join(', ')}`);
            }
            
            if ((details as any).equipment?.length) {
                sections.push(`Equipment: ${(details as any).equipment.join(', ')}`);
            }
            
            if ((details as any).comments) {
                sections.push(`Notes: ${(details as any).comments}`);
            }
        }

        return sections.join('\n');
    }
}