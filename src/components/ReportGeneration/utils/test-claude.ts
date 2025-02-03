import claudeClient from '../../../lib/claude';

async function testClaudeIntegration() {
  try {
    console.log('Testing Claude API integration...');
    
    const response = await claudeClient.chat({
      messages: [
        {
          role: 'user',
          content: 'Please confirm you can receive this message by responding with a brief confirmation.'
        }
      ],
      model: 'claude-3-opus-20240229',
      max_tokens: 100,
      temperature: 0.7
    });

    if (response.error) {
      console.error('Test failed:', response.error);
      return false;
    }

    console.log('Test successful. Claude response:', response.content);
    return true;
  } catch (error) {
    console.error('Test failed with error:', error);
    return false;
  }
}

export default testClaudeIntegration;