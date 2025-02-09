import { AssessmentData } from '../types/assessment';
import { ReportSection } from '../components/ReportGeneration/services/reportTemplateSystem';

export class ClaudeService {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl = 'https://api.anthropic.com/v1/messages') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async generateSectionContent(
    section: ReportSection,
    data: AssessmentData,
    existingContent: string
  ): Promise<string> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 2000,
          temperature: 0.7,
          messages: [
            {
              role: 'user',
              content: `Please enhance the following occupational therapy report section:

Current Content:
${existingContent}

Section: ${section.title}
Assessment Data:
${JSON.stringify(data.assessment, null, 2)}

Please generate a professional, detailed report section using the provided data. 
Maintain the same structure but enhance the content with more clinical detail and professional language.
Focus on the analysis and implications of the data rather than just listing facts.`
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.content[0].text;
    } catch (error) {
      console.error('Error generating content:', error);
      return existingContent; // Fall back to template-generated content
    }
  }

  async enhanceReport(
    sections: ReportSection[],
    data: AssessmentData
  ): Promise<Map<string, string>> {
    const enhancedSections = new Map<string, string>();

    for (const section of sections) {
      // First generate content using existing template
      const templateContent = await section.generate(data);
      
      // Then enhance it with Claude
      const enhancedContent = await this.generateSectionContent(
        section,
        data,
        templateContent
      );

      enhancedSections.set(section.id, enhancedContent);
    }

    return enhancedSections;
  }
}

// Example usage:
/*
const claudeService = new ClaudeService('your-api-key');

// Enhance a specific section
const enhancedContent = await claudeService.generateSectionContent(
  demographicsSection,
  assessmentData,
  existingContent
);

// Or enhance all sections
const enhancedSections = await claudeService.enhanceReport(
  [demographicsSection, medicalHistorySection, ...],
  assessmentData
);
*/