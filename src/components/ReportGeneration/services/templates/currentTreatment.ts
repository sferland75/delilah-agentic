import { AssessmentData } from '../../../../types/assessment';
import { ReportSection } from '../reportTemplateSystem';

export const currentTreatmentSection: ReportSection = {
  id: 'currentTreatment',
  title: 'CURRENT TREATMENT',
  order: 4,
  generate: async (data: AssessmentData): Promise<string> => {
    const { medicalHistory } = data.assessment;
    let content = '# CURRENT MEDICAL AND REHABILITATION TEAM\n\n';

    // Medications
    content += '## CURRENT MEDICATIONS\n';
    if (medicalHistory.medications && medicalHistory.medications.length > 0) {
      medicalHistory.medications.forEach(med => {
        content += `• ${med.name} ${med.dosage} ${med.frequency}${med.purpose ? ` (${med.purpose})` : ''}\n`;
      });
    } else {
      content += 'No current medications reported\n';
    }

    // Healthcare Providers
    content += '\n## CURRENT HEALTHCARE PROVIDERS\n';
    if (medicalHistory.currentTreatment && medicalHistory.currentTreatment.length > 0) {
      medicalHistory.currentTreatment.forEach(provider => {
        content += `• ${provider.name} (${provider.providerType})\n`;
        content += `  Frequency: ${provider.frequency}\n`;
        if (provider.focus) content += `  Focus: ${provider.focus}\n`;
      });
    } else {
      content += 'No current healthcare providers reported\n';
    }

    return content;
  }
};
