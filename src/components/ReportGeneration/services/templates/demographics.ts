import { AssessmentData } from '../../../../types/assessment';
import { ReportSection } from '../reportTemplateSystem';

async function enhanceWithClaude(templateContent: string, data: AssessmentData): Promise<string> {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        temperature: 0.7,
        messages: [
          {
            role: 'user',
            content: `You are an occupational therapist writing a professional assessment report.
Please enhance this demographics section while maintaining all the factual information:

${templateContent}

Client Data:
${JSON.stringify(data.assessment, null, 2)}

Please enhance this to be more professional and detailed while maintaining accuracy.`
          }
        ]
      })
    });

    if (!response.ok) {
      console.error('Claude API call failed, using template version');
      return templateContent;
    }

    const result = await response.json();
    return result.content[0].text;
  } catch (error) {
    console.error('Error calling Claude:', error);
    return templateContent;
  }
}

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

    // Enhance the content using Claude
    const enhancedContent = await enhanceWithClaude(content, data);
    return enhancedContent;
  }
};