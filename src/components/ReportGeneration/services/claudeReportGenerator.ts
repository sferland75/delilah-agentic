import { CLAUDE_CONFIG } from './config';
import claudeClient from '../../../lib/claude';
import * as formatters from '../utils/formatters';
import { transformSymptoms, transformADLs, extractKeyFindings } from '../utils/transformations';

interface GenerationResponse {
  content: string;
  error?: string;
}

interface PromptTemplate {
  system: string;
  human: string;
}

export class ClaudeReportGenerator {
  private readonly promptTemplates: Record<string, PromptTemplate> = {
    'Summary of Findings': {
      system: `You are an experienced occupational therapist writing a medical-legal report. 
Generate a professional summary of findings section using formal clinical language while maintaining objectivity.
Focus on key functional impacts and changes from pre-injury status.
Avoid colloquial language and maintain professional distance.`,
      human: `Based on the following assessment data, generate a comprehensive summary of findings section for an occupational therapy report:

{data}

Focus on:
1. Overall functional changes pre vs post-accident
2. Key physical, cognitive and emotional impacts
3. Changes in independence and daily function
4. Implications for work and life roles

The tone should be professional and objective, using proper medical terminology.`
    },
    
    // Previous prompt templates remain the same...

  };

  private async makeClaudeRequest(prompt: PromptTemplate, data: string): Promise<GenerationResponse> {
    try {
      const response = await claudeClient.chat({
        messages: [
          {
            role: 'user',
            content: prompt.human.replace('{data}', data)
          }
        ],
        model: CLAUDE_CONFIG.MODEL,
        max_tokens: CLAUDE_CONFIG.MAX_TOKENS,
        temperature: CLAUDE_CONFIG.TEMPERATURE,
        system: prompt.system
      });

      if (response.error) {
        throw new Error(response.error);
      }

      return { content: response.content };
    } catch (error) {
      console.error('Claude API error:', error);
      return {
        content: '',
        error: error instanceof Error ? error.message : 'An error occurred during report generation'
      };
    }
  }

  // Rest of the class implementation remains the same...
}

export default new ClaudeReportGenerator();