import { AssessmentData } from '../../../../types/assessment';
import { ReportSection } from '../reportTemplateSystem';

export const medicalCourseSection: ReportSection = {
  id: 'medicalCourse',
  title: 'MEDICAL COURSE',
  order: 3,
  generate: async (data: AssessmentData): Promise<string> => {
    const { medicalHistory } = data.assessment;

    let content = '# MEDICAL COURSE\n\n';

    // Pre-Existing Conditions
    if (medicalHistory.preExisting) {
      content += '## PRE-EXISTING CONDITIONS\n';
      content += `${medicalHistory.preExisting}\n\n`;
    }

    // Injury Description
    if (medicalHistory.injury) {
      content += '## INCIDENT DESCRIPTION\n';
      const { position, circumstance, immediateResponse, subsequentCare } = medicalHistory.injury;
      if (position) content += `Position: ${position}\n`;
      if (circumstance) content += `Circumstance: ${circumstance}\n`;
      if (immediateResponse) content += `Immediate Response: ${immediateResponse}\n`;
      if (subsequentCare) content += `Subsequent Care: ${subsequentCare}\n\n`;
    }

    // Treatments
    if (medicalHistory.treatments && medicalHistory.treatments.length > 0) {
      content += '## TREATMENTS\n';
      medicalHistory.treatments.forEach(treatment => {
        content += `• ${treatment}\n`;
      });
      content += '\n';
    }

    // Current Treatment
    content += '## CURRENT TREATMENT PROVIDERS\n';
    if (medicalHistory.currentTreatment && medicalHistory.currentTreatment.length > 0) {
      medicalHistory.currentTreatment.forEach(treatment => {
        content += `• ${treatment.providerType}: ${treatment.name}\n`;
        if (treatment.frequency) content += `  Frequency: ${treatment.frequency}\n`;
        if (treatment.focus) content += `  Focus: ${treatment.focus}\n`;
      });
    } else {
      content += 'No current treatment providers\n';
    }

    return content;
  }
};
