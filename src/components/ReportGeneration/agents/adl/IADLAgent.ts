import { BaseAgent } from '../core/BaseAgent';
import { AgentContext, ProcessedData } from '../../types';
import { Assessment } from '../../../../types/report';
import { ADLStatus, ADLLevel } from './ADLTypes';

interface IADLData {
    household: {
        cleaning?: ADLStatus;
        laundry?: ADLStatus;
        meal_prep?: ADLStatus;
        home_maintenance?: ADLStatus;
    };
    community: {
        transportation?: ADLStatus;
        shopping?: ADLStatus;
        money_management?: ADLStatus;
        communication?: ADLStatus;
    };
    health: {
        medications?: ADLStatus;
        appointments?: ADLStatus;
        monitoring?: ADLStatus;
        exercise?: ADLStatus;
    };
    generalNotes?: string;
}

export class IADLAgent extends BaseAgent {
    constructor(context: AgentContext) {
        super(context);
        this.name = 'Instrumental ADL Assessment';
        this.description = 'Assessment of instrumental activities of daily living';
        this.orderNumber = 5;
        this.dataPath = ['assessment', 'adl', 'iadl'];
    }

    protected async processData(data: Assessment): Promise<ProcessedData> {
        try {
            const processed = await super.processData(data);
            if (!processed.valid) return processed;

            const iadlData = processed.data as IADLData;
            if (!this.validateIADLData(iadlData)) {
                return this.formatError('Invalid IADL data structure');
            }

            return this.formatSuccess(iadlData);
        } catch (error) {
            return this.formatError(error.message || 'Error processing IADL data');
        }
    }

    protected formatBrief(data: IADLData): string {
        const sections = ['IADL Status:'];

        // Household
        if (data.household) {
            const householdStatus = this.formatHouseholdStatus(data.household);
            if (householdStatus) sections.push(householdStatus);
        }

        // Community
        if (data.community) {
            const communityStatus = this.formatCommunityStatus(data.community);
            if (communityStatus) sections.push(communityStatus);
        }

        // Health Management
        if (data.health) {
            const healthStatus = this.formatHealthStatus(data.health);
            if (healthStatus) sections.push(healthStatus);
        }

        return sections.join('\n') || 'No IADL data available';
    }

    protected formatStandard(data: IADLData): string {
        const sections = ['Instrumental ADL Assessment'];

        // Household Section
        sections.push('\nHousehold Management:');
        if (data.household) {
            Object.entries(data.household).forEach(([activity, status]) => {
                if (status) {
                    sections.push(`- ${this.formatActivityName(activity)}: ${this.formatLevel(status.independence)}`);
                    if (status.notes) sections.push(`  Notes: ${status.notes}`);
                }
            });
        }

        // Community Section
        sections.push('\nCommunity Integration:');
        if (data.community) {
            Object.entries(data.community).forEach(([activity, status]) => {
                if (status) {
                    sections.push(`- ${this.formatActivityName(activity)}: ${this.formatLevel(status.independence)}`);
                    if (status.notes) sections.push(`  Notes: ${status.notes}`);
                }
            });
        }

        // Health Management Section
        sections.push('\nHealth Management:');
        if (data.health) {
            Object.entries(data.health).forEach(([activity, status]) => {
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

    protected formatDetailed(data: IADLData): string {
        return this.formatStandard(data);
    }

    private validateIADLData(data: any): boolean {
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

    private formatHouseholdStatus(household: IADLData['household']): string {
        const status = [];
        if (household.cleaning) status.push(`cleaning: ${this.formatLevel(household.cleaning.independence)}`);
        if (household.meal_prep) status.push(`meal prep: ${this.formatLevel(household.meal_prep.independence)}`);
        return status.length ? '  Household: ' + status.join(', ') : '';
    }

    private formatCommunityStatus(community: IADLData['community']): string {
        const status = [];
        if (community.transportation) status.push(`transportation: ${this.formatLevel(community.transportation.independence)}`);
        if (community.shopping) status.push(`shopping: ${this.formatLevel(community.shopping.independence)}`);
        return status.length ? '  Community: ' + status.join(', ') : '';
    }

    private formatHealthStatus(health: IADLData['health']): string {
        const status = [];
        if (health.medications) status.push(`medications: ${this.formatLevel(health.medications.independence)}`);
        if (health.appointments) status.push(`appointments: ${this.formatLevel(health.appointments.independence)}`);
        return status.length ? '  Health Management: ' + status.join(', ') : '';
    }
}