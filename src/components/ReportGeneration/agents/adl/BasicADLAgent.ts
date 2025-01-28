import { BaseAgent } from '../core/BaseAgent';
import { AgentContext, ProcessedData } from '../../types';
import { Assessment } from '../../../../types/report';
import { ADLStatus, ADLLevel } from './ADLTypes';

interface BasicADLData {
    bathing: {
        shower?: ADLStatus;
        grooming?: ADLStatus;
        oral_care?: ADLStatus;
        toileting?: ADLStatus;
    };
    dressing: {
        upper_body?: ADLStatus;
        lower_body?: ADLStatus;
        footwear?: ADLStatus;
    };
    feeding: {
        eating?: ADLStatus;
        setup?: ADLStatus;
        drinking?: ADLStatus;
    };
    transfers: {
        bed_transfer?: ADLStatus;
        toilet_transfer?: ADLStatus;
        shower_transfer?: ADLStatus;
        position_changes?: ADLStatus;
    };
    generalNotes?: string;
}

export class BasicADLAgent extends BaseAgent {
    constructor(context: AgentContext) {
        super(context);
        this.name = 'Basic ADL Assessment';
        this.description = 'Assessment of basic activities of daily living';
        this.orderNumber = 4;
        this.dataPath = ['assessment', 'adl', 'basic'];
    }

    protected async processData(data: Assessment): Promise<ProcessedData> {
        try {
            const processed = await super.processData(data);
            if (!processed.valid) return processed;

            const basicADL = processed.data as BasicADLData;
            if (!this.validateADLData(basicADL)) {
                return this.formatError('Invalid ADL data structure');
            }

            return this.formatSuccess(basicADL);
        } catch (error) {
            return this.formatError(error.message || 'Error processing ADL data');
        }
    }

    protected formatBrief(data: BasicADLData): string {
        const sections = ['ADL Status:'];

        // Bathing
        if (data.bathing) {
            const bathingStatus = this.formatBathingStatus(data.bathing);
            if (bathingStatus) sections.push(bathingStatus);
        }

        // Dressing
        if (data.dressing) {
            const dressingStatus = this.formatDressingStatus(data.dressing);
            if (dressingStatus) sections.push(dressingStatus);
        }

        // Feeding
        if (data.feeding) {
            const feedingStatus = this.formatFeedingStatus(data.feeding);
            if (feedingStatus) sections.push(feedingStatus);
        }

        // Transfers
        if (data.transfers) {
            const transferStatus = this.formatTransferStatus(data.transfers);
            if (transferStatus) sections.push(transferStatus);
        }

        return sections.join('\n') || 'No ADL data available';
    }

    protected formatStandard(data: BasicADLData): string {
        const sections = ['Basic ADL Assessment'];

        // Bathing Section
        sections.push('\nBathing & Hygiene:');
        if (data.bathing) {
            Object.entries(data.bathing).forEach(([activity, status]) => {
                if (status) {
                    sections.push(`- ${this.formatActivityName(activity)}: ${this.formatLevel(status.independence)}`);
                    if (status.notes) sections.push(`  Notes: ${status.notes}`);
                }
            });
        }

        // Dressing Section
        sections.push('\nDressing:');
        if (data.dressing) {
            Object.entries(data.dressing).forEach(([activity, status]) => {
                if (status) {
                    sections.push(`- ${this.formatActivityName(activity)}: ${this.formatLevel(status.independence)}`);
                    if (status.notes) sections.push(`  Notes: ${status.notes}`);
                }
            });
        }

        // Feeding Section
        sections.push('\nFeeding:');
        if (data.feeding) {
            Object.entries(data.feeding).forEach(([activity, status]) => {
                if (status) {
                    sections.push(`- ${this.formatActivityName(activity)}: ${this.formatLevel(status.independence)}`);
                    if (status.notes) sections.push(`  Notes: ${status.notes}`);
                }
            });
        }

        // Transfers Section
        sections.push('\nTransfers:');
        if (data.transfers) {
            Object.entries(data.transfers).forEach(([activity, status]) => {
                if (status) {
                    sections.push(`- ${this.formatActivityName(activity)}: ${this.formatLevel(status.independence)}`);
                    if (status.notes) sections.push(`  Notes: ${status.notes}`);
                }
            });
        }

        if (data.generalNotes) {
            sections.push('\nGeneral Notes:', data.generalNotes);
        }

        return sections.join('\n');
    }

    protected formatDetailed(data: BasicADLData): string {
        return this.formatStandard(data);
    }

    private validateADLData(data: any): boolean {
        return data && typeof data === 'object';
    }

    private formatLevel(level?: ADLLevel): string {
        if (!level) return 'Not Assessed';
        return level.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    private formatActivityName(name: string): string {
        return name.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    private formatBathingStatus(bathing: BasicADLData['bathing']): string {
        const status = [];
        if (bathing.shower) status.push(`showering: ${this.formatLevel(bathing.shower.independence)}`);
        if (bathing.grooming) status.push(`grooming: ${this.formatLevel(bathing.grooming.independence)}`);
        return status.length ? '  Bathing: ' + status.join(', ') : '';
    }

    private formatDressingStatus(dressing: BasicADLData['dressing']): string {
        const status = [];
        if (dressing.upper_body) status.push(`upper body: ${this.formatLevel(dressing.upper_body.independence)}`);
        if (dressing.lower_body) status.push(`lower body: ${this.formatLevel(dressing.lower_body.independence)}`);
        return status.length ? '  Dressing: ' + status.join(', ') : '';
    }

    private formatFeedingStatus(feeding: BasicADLData['feeding']): string {
        const status = [];
        if (feeding.eating) status.push(`eating: ${this.formatLevel(feeding.eating.independence)}`);
        if (feeding.setup) status.push(`setup: ${this.formatLevel(feeding.setup.independence)}`);
        return status.length ? '  Feeding: ' + status.join(', ') : '';
    }

    private formatTransferStatus(transfers: BasicADLData['transfers']): string {
        const status = [];
        if (transfers.bed_transfer) status.push(`bed: ${this.formatLevel(transfers.bed_transfer.independence)}`);
        if (transfers.toilet_transfer) status.push(`toilet: ${this.formatLevel(transfers.toilet_transfer.independence)}`);
        return status.length ? '  Transfers: ' + status.join(', ') : '';
    }
}