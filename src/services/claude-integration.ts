import { AssessmentData } from '../types/assessment';

interface ClaudeResponse {
  content: string;
  success: boolean;
  error?: string;
}

interface SectionGenerationOptions {
  temperature?: number;
  maxTokens?: number;
  template?: string;
  examples?: string[];
}

export class ClaudeReportService {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl = 'https://api.anthropic.com/v1/messages') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  private async makeClaudeRequest(prompt: string, options: SectionGenerationOptions = {}): Promise<ClaudeResponse> {
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
          max_tokens: options.maxTokens || 1024,
          temperature: options.temperature || 0.7,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        content: data.content[0].text,
        success: true
      };
    } catch (error) {
      return {
        content: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private async generateSectionPrompt(
    sectionName: string,
    data: any,
    template?: string,
    examples?: string[]
  ): string {
    let prompt = `Please generate the ${sectionName} section of an occupational therapy report based on the following assessment data:\n\n`;
    
    prompt += `Assessment Data:\n${JSON.stringify(data, null, 2)}\n\n`;

    if (template) {
      prompt += `Please follow this template:\n${template}\n\n`;
    }

    if (examples && examples.length > 0) {
      prompt += 'Here are some examples of well-written sections:\n\n';
      examples.forEach((example, index) => {
        prompt += `Example ${index + 1}:\n${example}\n\n`;
      });
    }

    prompt += `Please generate a professional, detailed ${sectionName} section following the style of the examples and template.`;
    
    return prompt;
  }

  async generateDemographicsSection(data: AssessmentData, options: SectionGenerationOptions = {}): Promise<ClaudeResponse> {
    const prompt = await this.generateSectionPrompt(
      'Demographics',
      data.assessment.demographics,
      options.template,
      options.examples
    );
    return this.makeClaudeRequest(prompt, options);
  }

  async generateMedicalHistorySection(data: AssessmentData, options: SectionGenerationOptions = {}): Promise<ClaudeResponse> {
    const prompt = await this.generateSectionPrompt(
      'Medical History',
      data.assessment.medicalHistory,
      options.template,
      options.examples
    );
    return this.makeClaudeRequest(prompt, options);
  }

  async generateFunctionalAssessmentSection(data: AssessmentData, options: SectionGenerationOptions = {}): Promise<ClaudeResponse> {
    const prompt = await this.generateSectionPrompt(
      'Functional Assessment',
      data.assessment.functionalAssessment,
      options.template,
      options.examples
    );
    return this.makeClaudeRequest(prompt, options);
  }

  async generateADLSection(data: AssessmentData, options: SectionGenerationOptions = {}): Promise<ClaudeResponse> {
    const prompt = await this.generateSectionPrompt(
      'Activities of Daily Living',
      data.assessment.adl,
      options.template,
      options.examples
    );
    return this.makeClaudeRequest(prompt, options);
  }

  async generateEnvironmentalSection(data: AssessmentData, options: SectionGenerationOptions = {}): Promise<ClaudeResponse> {
    const prompt = await this.generateSectionPrompt(
      'Environmental Assessment',
      data.assessment.environmental,
      options.template,
      options.examples
    );
    return this.makeClaudeRequest(prompt, options);
  }

  // Helper to generate the full report
  async generateFullReport(data: AssessmentData, options: SectionGenerationOptions = {}): Promise<ClaudeResponse[]> {
    const sections = [
      this.generateDemographicsSection(data, options),
      this.generateMedicalHistorySection(data, options),
      this.generateFunctionalAssessmentSection(data, options),
      this.generateADLSection(data, options),
      this.generateEnvironmentalSection(data, options)
    ];

    return Promise.all(sections);
  }
}

// Example usage:
/*
const reportService = new ClaudeReportService('your-api-key');

// Generate a single section
const demographicsSection = await reportService.generateDemographicsSection(assessmentData, {
  template: demographicsTemplate,
  examples: demographicsExamples
});

// Generate full report
const fullReport = await reportService.generateFullReport(assessmentData, {
  template: mainTemplate,
  examples: reportExamples
});
*/