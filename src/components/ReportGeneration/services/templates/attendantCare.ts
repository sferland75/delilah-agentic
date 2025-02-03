import { AssessmentData } from '../../../../types/assessment';
import { generateForm1Section } from './attendantCare/form1';
import { ReportSection } from '../reportTemplateSystem';

export const attendantCareSection: ReportSection = {
  id: 'attendantCare',
  title: 'ATTENDANT CARE',
  order: 6,
  generate: async (data: AssessmentData): Promise<string> => {
    const form1Data = generateForm1Section(data);
    let content = '# ATTENDANT CARE NEEDS\n\n';

    content += '## CURRENT CARE ARRANGEMENTS\n';
    const { care } = data.assessment;
    if (care.personalCare?.type) {
      content += `Type: ${care.personalCare.type}\n`;
      content += `Frequency: ${care.personalCare.frequency}\n`;
      if (care.personalCare.notes) content += `Notes: ${care.personalCare.notes}\n`;
    } else {
      content += 'No current attendant care arrangements\n';
    }

    content += '\n## ASSISTANCE NEEDS\n';
    content += `Bathing/Showering: ${form1Data.bathing.independence}\n`;
    if (form1Data.bathing.notes) content += `Notes: ${form1Data.bathing.notes}\n`;

    content += `\nDressing: ${form1Data.dressing.independence}\n`;
    if (form1Data.dressing.notes) content += `Notes: ${form1Data.dressing.notes}\n`;

    return content;
  }
};
