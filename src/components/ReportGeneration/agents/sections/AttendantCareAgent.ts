import { AssessmentData } from '../../types';
import { BaseAgent } from '../core/BaseAgent';
import { ReportSection } from '../core/ReportStructure';
import { SectionContent } from '../core/ReportSectionTypes';

export class AttendantCareAgent extends BaseAgent {
    constructor() {
        super(ReportSection.ATTENDANT_CARE);
    }

    public generateSection(data: AssessmentData): SectionContent {
        const care = data.assessment.care;

        return {
            title: this.config.title,
            type: this.config.type,
            order: this.config.order,
            content: {
                summary: this.generateCareSummary(care),
                details: {
                    personalCare: this.formatCareComponent('Personal Care', care.personalCare),
                    housekeeping: this.formatCareComponent('Housekeeping', care.housekeeping),
                    mealPreparation: this.formatCareComponent('Meal Preparation', care.mealPreparation),
                    transportation: this.formatCareComponent('Transportation', care.transportation)
                },
                costs: this.formatCostSummary(care.costSummary)
            }
        };
    }

    private generateCareSummary(care: any): string {
        if (!care) return '';

        const summary = [];
        const providers = new Set();

        // Collect all care providers
        if (care.personalCare?.provider) providers.add(care.personalCare.provider);
        if (care.housekeeping?.provider) providers.add(care.housekeeping.provider);
        if (care.mealPreparation?.provider) providers.add(care.mealPreparation.provider);
        if (care.transportation?.provider) providers.add(care.transportation.provider);

        const providerList = Array.from(providers);
        if (providerList.length) {
            summary.push(`Care is currently provided by ${this.formatClinicalList(providerList)}.`);
        }

        // Add cost context if available
        if (care.costSummary?.monthly) {
            summary.push(`Total monthly care costs are estimated at $${care.costSummary.monthly.toFixed(2)}.`);
        }

        return summary.join(' ');
    }

    private formatCareComponent(type: string, care: any): any {
        if (!care) return null;

        return {
            type: care.type || '',
            frequency: care.frequency || '',
            provider: care.provider || '',
            notes: care.notes || '',
            formattedText: this.formatCareDetails(type, care)
        };
    }

    private formatCareDetails(type: string, care: any): string {
        if (!care) return '';

        const details = [];
        if (care.type) details.push(care.type);
        if (care.frequency) details.push(`provided ${care.frequency}`);
        if (care.provider) details.push(`by ${care.provider}`);
        if (care.notes) details.push(`- ${care.notes}`);

        return details.length ? `${type}: ${details.join(' ')}` : '';
    }

    private formatCostSummary(costs: any): any {
        if (!costs) return null;

        return {
            monthly: costs.monthly || 0,
            annual: costs.annual || 0,
            notes: costs.notes || '',
            formattedText: this.formatCostDetails(costs)
        };
    }

    private formatCostDetails(costs: any): string {
        if (!costs) return '';

        const details = [];
        if (costs.monthly) details.push(`Monthly Cost: $${costs.monthly.toFixed(2)}`);
        if (costs.annual) details.push(`Annual Cost: $${costs.annual.toFixed(2)}`);
        if (costs.notes) details.push(costs.notes);

        return details.join('\n');
    }
}