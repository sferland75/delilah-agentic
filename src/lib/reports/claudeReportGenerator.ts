import { CLAUDE_CONFIG } from '../../config/claude';
import claudeClient from '../../lib/claude';
import { promptTemplates, formatPrompt, PromptTemplate } from './promptTemplates';
import { TransformedSection } from './sectionTransformer';
import { withRetry } from './retryManager';
import { CacheManager } from './cacheManager';

export interface GenerationResponse {
  content: string;
  error?: string;
}

export class ClaudeReportGenerator {
  private cache: CacheManager<string>;
  
  constructor() {
    this.cache = new CacheManager({
      ttl: 60 * 60 * 1000  // 1 hour cache
    });
  }

  private async makeClaudeRequest(prompt: PromptTemplate): Promise<GenerationResponse> {
    // Try to get from cache first
    const cacheKey = JSON.stringify(prompt);
    const cachedResult = this.cache.get(cacheKey);
    if (cachedResult) {
      return { content: cachedResult };
    }

    try {
      // Use retry logic for the API call
      const response = await withRetry(
        async () => {
          return await claudeClient.chat({
            messages: [
              {
                role: 'user',
                content: prompt.human
              }
            ],
            model: CLAUDE_CONFIG.MODEL,
            max_tokens: CLAUDE_CONFIG.MAX_TOKENS,
            temperature: CLAUDE_CONFIG.TEMPERATURE,
            system: prompt.system
          });
        },
        {
          maxAttempts: 3,
          initialDelay: 2000  // Start with 2 second delay
        }
      );

      if (response.error) {
        throw new Error(response.error);
      }

      // Cache successful response
      this.cache.set(cacheKey, response.content);

      return { content: response.content };

    } catch (error) {
      console.error('Claude API error:', error);
      return {
        content: '',
        error: error instanceof Error ? error.message : 'An error occurred during report generation'
      };
    }
  }

  public async generateNarrative(
    sectionKey: string,
    content: string,
    subsections: Record<string, string>
  ): Promise<string> {
    // Format the section data
    const formattedData = Object.entries(subsections)
      .map(([key, desc]) => `${key.toUpperCase()}:\n${content}`)
      .join('\n\n');

    // Get and format the prompt
    const prompt = formatPrompt(
      sectionKey as keyof typeof promptTemplates,
      formattedData
    );

    // Generate the narrative with retries and caching
    const response = await this.makeClaudeRequest(prompt);

    if (response.error) {
      throw new Error(response.error);
    }

    return response.content;
  }

  // Utility method to pre-warm cache with examples
  public async preWarmCache(examples: Record<string, string>): Promise<void> {
    for (const [key, content] of Object.entries(examples)) {
      const prompt = formatPrompt(
        key as keyof typeof promptTemplates,
        content
      );
      const cacheKey = JSON.stringify(prompt);
      this.cache.set(cacheKey, content);
    }
  }

  // Clear cache if needed
  public clearCache(): void {
    this.cache.clear();
  }
}