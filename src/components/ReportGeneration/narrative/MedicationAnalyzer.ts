interface Medication {
    name: string;
    dosage?: string;
    frequency?: string;
    purpose?: string;
}

export class MedicationAnalyzer {
    analyzeMedications(medications: any[]): Medication[] {
        if (!Array.isArray(medications)) {
            return [];
        }

        return medications
            .filter(med => med?.name)
            .map(med => ({
                name: med.name,
                dosage: med.dosage,
                frequency: med.frequency,
                purpose: med.purpose
            }));
    }

    formatMedication(med: Medication): string {
        const parts = [med.name];
        if (med.dosage) parts.push(med.dosage);
        if (med.frequency) parts.push(med.frequency);
        if (med.purpose) parts.push(`for ${med.purpose}`);
        return parts.join(' ');
    }

    formatMedicationList(medications: Medication[]): string {
        if (medications.length === 0) {
            return 'No current medications reported';
        }

        return medications
            .map(med => this.formatMedication(med))
            .join('\n');
    }
}