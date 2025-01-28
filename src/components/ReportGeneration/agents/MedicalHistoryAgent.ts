import { BaseAgent } from './core/BaseAgent';
import { Assessment, ProcessedData } from '../../../types/report';

interface MedicalHistory {
    injury?: {
        date: string;
        mechanism: string;
        diagnosis: string[];
        impactAreas: string[];
        details?: string;
    };
    treatments?: Array<{
        type: string;
        provider: string;
        frequency: string;
        duration?: string;
        response?: string;
    }>;
    medications?: Array<{
        name: string;
        dosage: string;
        frequency: string;
        purpose: string;
        response?: string;
    }>;
    procedures?: Array<{
        type: string;
        date: string;
        provider: string;
        outcome: string;
    }>;
    currentTreatment?: Array<{
        type: string;
        provider: string;
        frequency: string;
        goals?: string[];
    }>;
}

export class MedicalHistoryAgent extends BaseAgent {
    constructor(context: any) {
        super(context);
        this.name = 'Medical History';
        this.description = 'Analysis of medical history and current treatments';
        this.orderNumber = 2.0;
        this.dataPath = ['medicalHistory'];
    }

    async processData(data: Assessment): Promise<ProcessedData> {
        try {
            const medicalHistory = data.medicalHistory;
            if (!medicalHistory) {
                return this.formatError('No medical history data available');
            }

            return this.formatSuccess({
                injury: this.processInjury(medicalHistory.injury),
                treatments: this.processTreatments(medicalHistory.treatments),
                medications: this.processMedications(medicalHistory.medications),
                procedures: this.processProcedures(medicalHistory.procedures),
                currentTreatment: this.processCurrentTreatment(medicalHistory.currentTreatment)
            });
        } catch (error) {
            return this.formatError('Error processing medical history');
        }
    }

    private processInjury(injury: any) {
        if (!injury) return null;
        return {
            date: injury.date || 'Unknown date',
            mechanism: injury.mechanism || 'Not specified',
            diagnosis: Array.isArray(injury.diagnosis) ? injury.diagnosis : [],
            impactAreas: Array.isArray(injury.impactAreas) ? injury.impactAreas : [],
            details: injury.details || ''
        };
    }

    private processTreatments(treatments: any[]) {
        if (!Array.isArray(treatments)) return [];
        return treatments
            .filter(t => t?.type && t?.provider)
            .map(t => ({
                type: t.type,
                provider: t.provider,
                frequency: t.frequency || 'Not specified',
                duration: t.duration || '',
                response: t.response || ''
            }));
    }

    private processMedications(medications: any[]) {
        if (!Array.isArray(medications)) return [];
        return medications
            .filter(m => m?.name)
            .map(m => ({
                name: m.name,
                dosage: m.dosage || 'Not specified',
                frequency: m.frequency || 'Not specified',
                purpose: m.purpose || '',
                response: m.response || ''
            }));
    }

    private processProcedures(procedures: any[]) {
        if (!Array.isArray(procedures)) return [];
        return procedures
            .filter(p => p?.type && p?.date)
            .map(p => ({
                type: p.type,
                date: p.date,
                provider: p.provider || 'Not specified',
                outcome: p.outcome || ''
            }));
    }

    private processCurrentTreatment(treatments: any[]) {
        if (!Array.isArray(treatments)) return [];
        return treatments
            .filter(t => t?.type && t?.provider)
            .map(t => ({
                type: t.type,
                provider: t.provider,
                frequency: t.frequency || 'Not specified',
                goals: Array.isArray(t.goals) ? t.goals : []
            }));
    }

    protected formatBrief(data: ProcessedData): string {
        if (!data.valid) {
            return 'Medical history not available';
        }

        const sections: string[] = [];

        if (data.data.injury) {
            sections.push(`Injury: ${data.data.injury.mechanism}`);
        }

        if (data.data.medications?.length) {
            const meds = data.data.medications.map(m => m.name).join(', ');
            sections.push(`Medications: ${meds}`);
        }

        if (data.data.currentTreatment?.length) {
            const treatments = data.data.currentTreatment.map(t => t.type).join(', ');
            sections.push(`Current Treatment: ${treatments}`);
        }

        return sections.join('\n') || 'No significant medical history reported';
    }

    protected formatStandard(data: ProcessedData): string {
        if (!data.valid) {
            return 'Medical history not available';
        }

        const sections: string[] = [];

        // Injury Information
        if (data.data.injury) {
            sections.push('Injury Information:');
            sections.push(`- Mechanism: ${data.data.injury.mechanism}`);
            if (data.data.injury.diagnosis.length) {
                sections.push(`- Diagnosis: ${data.data.injury.diagnosis.join(', ')}`);
            }
            if (data.data.injury.impactAreas.length) {
                sections.push(`- Impact Areas: ${data.data.injury.impactAreas.join(', ')}`);
            }
            sections.push('');
        }

        // Current Medications
        if (data.data.medications?.length) {
            sections.push('Current Medications:');
            data.data.medications.forEach(med => {
                sections.push(`- ${med.name} ${med.dosage} ${med.frequency}${med.purpose ? ` for ${med.purpose}` : ''}`);
            });
            sections.push('');
        }

        // Current Treatment
        if (data.data.currentTreatment?.length) {
            sections.push('Current Treatment:');
            data.data.currentTreatment.forEach(treatment => {
                sections.push(`- ${treatment.type} at ${treatment.provider} (${treatment.frequency})`);
                if (treatment.goals?.length) {
                    sections.push(`  Goals: ${treatment.goals.join(', ')}`);
                }
            });
        }

        return sections.join('\n') || 'No significant medical history reported';
    }

    protected formatDetailed(data: ProcessedData): string {
        if (!data.valid) {
            return 'Medical history not available';
        }

        const sections: string[] = [];
        sections.push('MEDICAL HISTORY ASSESSMENT');
        sections.push('=========================\n');

        // Injury Details
        if (data.data.injury) {
            sections.push('INJURY INFORMATION');
            sections.push('-----------------');
            sections.push(`Date: ${data.data.injury.date}`);
            sections.push(`Mechanism: ${data.data.injury.mechanism}`);
            if (data.data.injury.diagnosis.length) {
                sections.push(`Diagnosis: ${data.data.injury.diagnosis.join(', ')}`);
            }
            if (data.data.injury.impactAreas.length) {
                sections.push(`Impact Areas: ${data.data.injury.impactAreas.join(', ')}`);
            }
            if (data.data.injury.details) {
                sections.push(`Additional Details: ${data.data.injury.details}`);
            }
            sections.push('');
        }

        // Medications
        if (data.data.medications?.length) {
            sections.push('CURRENT MEDICATIONS');
            sections.push('-----------------');
            data.data.medications.forEach(med => {
                sections.push(`Medication: ${med.name}`);
                sections.push(`- Dosage: ${med.dosage}`);
                sections.push(`- Frequency: ${med.frequency}`);
                if (med.purpose) sections.push(`- Purpose: ${med.purpose}`);
                if (med.response) sections.push(`- Response: ${med.response}`);
                sections.push('');
            });
        }

        // Current Treatment
        if (data.data.currentTreatment?.length) {
            sections.push('CURRENT TREATMENT');
            sections.push('----------------');
            data.data.currentTreatment.forEach(treatment => {
                sections.push(`Treatment: ${treatment.type}`);
                sections.push(`- Provider: ${treatment.provider}`);
                sections.push(`- Frequency: ${treatment.frequency}`);
                if (treatment.goals?.length) {
                    sections.push(`- Goals: ${treatment.goals.join(', ')}`);
                }
                sections.push('');
            });
        }

        // Past Procedures
        if (data.data.procedures?.length) {
            sections.push('PAST PROCEDURES');
            sections.push('--------------');
            data.data.procedures.forEach(procedure => {
                sections.push(`Procedure: ${procedure.type}`);
                sections.push(`- Date: ${procedure.date}`);
                sections.push(`- Provider: ${procedure.provider}`);
                if (procedure.outcome) sections.push(`- Outcome: ${procedure.outcome}`);
                sections.push('');
            });
        }

        return sections.join('\n');
    }
}