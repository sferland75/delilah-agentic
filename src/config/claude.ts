export const CLAUDE_CONFIG = {
  apiKey: process.env.CLAUDE_API_KEY || 'test-key',
  model: 'claude-3-sonnet-20240229',
  maxTokens: 4096,
  temperature: 0.7,
  topP: 0.9,
  timeout: 60000,
  systemPrompt: 'You are an AI assistant helping to generate medical assessment reports.',
};

export default CLAUDE_CONFIG;