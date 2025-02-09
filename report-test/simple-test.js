import 'dotenv/config';
import fetch from 'node-fetch';

async function testClaudeAPI() {
    console.log('Starting simple API test...');
    console.log('Using API key:', process.env.ANTHROPIC_API_KEY ? 'Key found' : 'No key found');
    
    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'anthropic-version': '2023-06-01',
                'x-api-key': process.env.ANTHROPIC_API_KEY
            },
            body: JSON.stringify({
                model: "claude-3-sonnet-20240229",
                max_tokens: 1024,
                messages: [
                    {
                        role: "user",
                        content: "Write a one sentence test response."
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API request failed: ${response.statusText}\n${errorText}`);
        }

        const result = await response.json();
        console.log('API Response:', result);
    } catch (error) {
        console.error('Error:', error);
    }
}

testClaudeAPI();