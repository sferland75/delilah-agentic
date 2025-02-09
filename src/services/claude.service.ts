import { AssessmentData } from '../templates/data/assessment_data';
import Anthropic from '@anthropic-ai/sdk';

export class ClaudeService {
    private client: Anthropic;
    private model = 'claude-3-5-sonnet-20241022';

    constructor(apiKey: string) {
        this.client = new Anthropic({
            apiKey: apiKey
        });
    }

    async generateSummaryOfFindings(data: AssessmentData): Promise<string> {
        try {
            const response = await this.client.messages.create({
                model: this.model,
                max_tokens: 4000,
                temperature: 0.3,
                messages: [{
                    role: 'user',
                    content: generateSummaryPrompt(data)
                }]
            });

            return response.content[0].text;
        } catch (error) {
            console.error('Error generating summary:', error);
            throw error;
        }
    }

    async generateAMAAnalysis(data: AssessmentData): Promise<string> {
        try {
            const response = await this.client.messages.create({
                model: this.model,
                max_tokens: 4000,
                temperature: 0.3,
                messages: [{
                    role: 'user',
                    content: generateAMAAnalysisPrompt(data)
                }]
            });

            return response.content[0].text;
        } catch (error) {
            console.error('Error generating AMA analysis:', error);
            throw error;
        }
    }

    async generateAttendantCareRationale(
        data: AssessmentData,
        task: string,
        category: 'Level1' | 'Level2' | 'Level3'
    ): Promise<string> {
        try {
            const response = await this.client.messages.create({
                model: this.model,
                max_tokens: 1000,
                temperature: 0.3,
                messages: [{
                    role: 'user',
                    content: generateAttendantCareRationalePrompt(data, task, category)
                }]
            });

            return response.content[0].text;
        } catch (error) {
            console.error('Error generating attendant care rationale:', error);
            throw error;
        }
    }

    async generateHousekeepingRationale(
        data: AssessmentData,
        task: string
    ): Promise<string> {
        try {
            const response = await this.client.messages.create({
                model: this.model,
                max_tokens: 1000,
                temperature: 0.3,
                messages: [{
                    role: 'user',
                    content: generateHousekeepingRationalePrompt(data, task)
                }]
            });

            return response.content[0].text;
        } catch (error) {
            console.error('Error generating housekeeping rationale:', error);
            throw error;
        }
    }

    // Helper function to format Claude's responses
    private formatResponse(text: string): string {
        return text.trim();
    }
}

// Helper function to handle system messages and context
function generateSystemContext(): string {
    return `You are an expert occupational therapist with extensive experience in assessment and report writing. 
Focus on:
- Clear, professional clinical language
- Evidence-based analysis
- Objective observations
- Clear relationships between injuries and functional impacts
- Specific examples from assessment data`;
}

export const createClaudeService = (apiKey: string) => {
    return new ClaudeService(apiKey);
};