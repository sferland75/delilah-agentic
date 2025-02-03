import { claudeClient } from '../../../lib/claude';

interface NarrativeEnhancementContext {
  section: string;
  rawContent: string;
  clinicalTone?: boolean;
  includeExamples?: boolean;
  formatType?: 'paragraph' | 'bullet' | 'table';
}

class NarrativeEnhancer {
  private static readonly BASE_PROMPT = `You are an experienced occupational therapist writing a medical-legal report. 
Generate professional clinical content focusing on functional impacts while maintaining objectivity.
Enhance the following section while preserving all factual information:`;

  async enhance(context: NarrativeEnhancementContext): Promise<string> {
    const prompt = this.buildPrompt(context);
    
    try {
      const response = await claudeClient.chat({
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        model: 'claude-3-opus-20240229',
        max_tokens: 1000,
        temperature: 0.7
      });

      if (!response || !response.content) {
        throw new Error('Failed to get valid response from Claude');
      }

      return response.content;
      
    } catch (error) {
      console.error('Narrative enhancement failed:', error);
      // Return original content if enhancement fails
      return context.rawContent;
    }
  }

  private buildPrompt(context: NarrativeEnhancementContext): string {
    let prompt = NarrativeEnhancer.BASE_PROMPT + '\n\n';
    
    if (context.clinicalTone) {
      prompt += 'Use professional medical terminology and maintain an objective clinical tone.\n';
    }

    if (context.includeExamples) {
      prompt += 'Include specific examples to illustrate functional impacts.\n';
    }

    if (context.formatType) {
      prompt += `Format the response as a ${context.formatType}.\n`;
    }

    prompt += `Section: ${context.section}\n\n`;
    prompt += `Content: ${context.rawContent}`;

    return prompt;
  }
}

export { NarrativeEnhancer, type NarrativeEnhancementContext };