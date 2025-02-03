export const claudeClient = {
  chat: async ({ messages, model, max_tokens, temperature }: any) => {
    // Mock response for testing
    return {
      content: "This is a mock response from Claude API"
    };
  }
};