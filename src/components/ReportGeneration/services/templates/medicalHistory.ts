import { AssessmentData } from '../../../../types/assessment';
import { ReportSection } from '../reportTemplateSystem';

export const medicalHistorySection: ReportSection = {
  id: 'medicalHistory',
  title: 'MEDICAL HISTORY',
  order: 2,
  generate: async (data: AssessmentData): Promise<string> => {
    const { medicalHistory } = data.assessment;
    let content = '# MEDICAL HISTORY\n\n';

    // Pre-Existing Conditions
    if (medicalHistory.preExisting) {
      content += 'Pre-Existing Conditions:\n';
      content += `${medicalHistory.preExisting}\n\n`;
    }

    // Current Medications
    content += '## MEDICATIONS\n';
    if (medicalHistory.medications.length > 0) {
      medicalHistory.medications.forEach(med => {
        content += `• ${med.name} ${med.dosage} ${med.frequency}${med.purpose ? ` - ${med.purpose}` : ''}\n`;
      });
      content += '\n';
    } else {
      content += 'No current medications reported\n\n';
    }

    // Current Treatment
    content += '## CURRENT TREATMENT PROVIDERS\n';
    if (medicalHistory.currentTreatment.length > 0) {
      medicalHistory.currentTreatment.forEach(provider => {
        content += `• ${provider.name} (${provider.providerType}) - ${provider.frequency}\n`;
        if (provider.focus) content += `  Focus: ${provider.focus}\n`;
      });
      content += '\n';
    }

    // Treatments
    if (medicalHistory.treatments.length > 0) {
      content += '## TREATMENTS\n';
      content += medicalHistory.treatments.join(', ') + '\n\n';
    }

    // Previous Surgeries
    if (medicalHistory.surgeries) {
      content += '## PREVIOUS SURGERIES\n';
      content += `${medicalHistory.surgeries}\n\n`;
    }

    // Family History
    if (medicalHistory.familyHistory) {
      content += '## FAMILY MEDICAL HISTORY\n';
      content += `${medicalHistory.familyHistory}\n\n`;
    }

    // Allergies
    content += '## ALLERGIES\n';
    if (medicalHistory.allergies.length > 0) {
      content += medicalHistory.allergies.join(', ');
      content += '\n';
    } else {
      content += 'No known allergies\n';
    }

    return content;
  }
};
