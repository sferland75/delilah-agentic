import { AssessmentData } from '../../../../types/assessment';
import { ReportSection } from '../reportTemplateSystem';

export const demographicsSection: ReportSection = {
  id: 'demographics',
  title: 'DEMOGRAPHICS',
  order: 1,
  generate: async (data: AssessmentData): Promise<string> => {
    const { demographics } = data.assessment;
    let content = '# DEMOGRAPHICS\n\n';

    content += '## PERSONAL INFORMATION\n';
    content += `Full Name: ${demographics.firstName} ${demographics.lastName}\n`;
    content += `Date of Birth: ${demographics.dateOfBirth}\n`;
    content += `Gender: ${demographics.gender}\n`;
    content += `Marital Status: ${demographics.maritalStatus}\n`;

    if (demographics.numberOfChildren !== undefined) {
      content += `Number of Children: ${demographics.numberOfChildren}\n`;
      content += `Children Details: ${demographics.childrenDetails || 'Not provided'}\n`;
    }

    content += '\n## CONTACT INFORMATION\n';
    content += `Phone: ${demographics.phone || 'Not provided'}\n`;
    content += `Email: ${demographics.email || 'Not provided'}\n`;
    content += `Address: ${demographics.address || 'Not provided'}\n`;

    content += '\n## EMERGENCY CONTACT\n';
    content += `Name: ${demographics.emergencyContact.name}\n`;
    content += `Relationship: ${demographics.emergencyContact.relationship}\n`;
    content += `Phone: ${demographics.emergencyContact.phone || 'Not provided'}\n`;

    return content;
  }
};
