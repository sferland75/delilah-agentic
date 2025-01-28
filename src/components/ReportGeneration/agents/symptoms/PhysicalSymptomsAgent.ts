import { BaseAgent } from '../core/BaseAgent';
import { Assessment, ProcessedData } from '../../../../types/report';

interface PhysicalSymptom {
    location: string;
    severity: string;
    frequency: string;
    painType?: string;
    temporalPattern?: string;
    aggravating?: string;
    relieving?: string;
    impact?: string[];
}

export class PhysicalSymptomsAgent extends BaseAgent {
    constructor(context: any) {
        super(context);
        this.name = 'Physical Symptoms';
        this.description = 'Analysis of physical symptoms and pain patterns';
        this.orderNumber = 3.1;
        this.dataPath = ['symptoms', 'physical'];
    }

    async processData(data: Assessment): Promise<ProcessedData> {
        try {
            const symptoms = data.symptoms?.physical;
            if (!Array.isArray(symptoms)) {
                return this.formatError('No physical symptoms data available');
            }

            return this.formatSuccess({
                symptoms: symptoms.filter(s => s?.location && s?.severity)
            });
        } catch (error) {
            return this.formatError('Error processing physical symptoms');
        }
    }

    protected formatBrief(data: ProcessedData): string {
        if (!data.valid || !Array.isArray(data.data?.symptoms)) {
            return 'No physical symptoms reported';
        }

        const symptoms = data.data.symptoms as PhysicalSymptom[];
        if (!symptoms.length) {
            return 'No physical symptoms reported';
        }

        return symptoms
            .map(s => `${s.location} (${s.severity})`)
            .join(', ');
    }

    protected formatStandard(data: ProcessedData): string {
        if (!data.valid || !Array.isArray(data.data?.symptoms)) {
            return 'No physical symptoms reported';
        }

        const symptoms = data.data.symptoms as PhysicalSymptom[];
        if (!symptoms.length) {
            return 'No physical symptoms reported';
        }

        const sections = ['Physical Symptoms:'];

        symptoms.forEach(symptom => {
            let description = `${symptom.location}: ${symptom.severity}`;
            if (symptom.frequency) description += `, ${symptom.frequency}`;
            if (symptom.painType) description += `, ${symptom.painType} pain`;
            sections.push(description);
        });

        return sections.join('\n');
    }

    protected formatDetailed(data: ProcessedData): string {
        if (!data.valid || !Array.isArray(data.data?.symptoms)) {
            return 'No physical symptoms reported';
        }

        const symptoms = data.data.symptoms as PhysicalSymptom[];
        if (!symptoms.length) {
            return 'No physical symptoms reported';
        }

        const sections = ['Physical Symptoms Assessment'];
        sections.push('===========================\n');

        symptoms.forEach(symptom => {
            sections.push(`Location: ${symptom.location}`);
            sections.push(`Severity: ${symptom.severity}`);
            sections.push(`Frequency: ${symptom.frequency}`);
            
            if (symptom.painType) {
                sections.push(`Pain Type: ${symptom.painType}`);
            }
            
            if (symptom.temporalPattern) {
                sections.push(`Pattern: ${symptom.temporalPattern}`);
            }

            if (symptom.aggravating) {
                sections.push(`Aggravating Factors: ${symptom.aggravating}`);
            }

            if (symptom.relieving) {
                sections.push(`Relieving Factors: ${symptom.relieving}`);
            }

            if (Array.isArray(symptom.impact) && symptom.impact.length) {
                sections.push(`Functional Impact: ${symptom.impact.join(', ')}`);
            }

            sections.push(''); // Add spacing between symptoms
        });

        return sections.join('\n');
    }
}