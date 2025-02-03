import fetch from 'node-fetch';

async function testApiKey() {
    const API_KEY = process.env.ANTHROPIC_API_KEY;
    
    if (!API_KEY) {
        console.error('No API key found. Please set ANTHROPIC_API_KEY environment variable.');
        return;
    }
    
    try {
        console.log("Testing API key with a simple request...");
        
        const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: "claude-3-opus-20240229",
                max_tokens: 100,
                messages: [
                    {
                        role: "user",
                        content: "Say hello in one word."
                    }
                ]
            })
        });

        console.log("Response status:", response.status);
        console.log("Response status text:", response.statusText);
        
        const data = await response.json();
        console.log("\nAPI Response:", JSON.stringify(data, null, 2));

    } catch (error) {
        console.error("Error testing API key:", error);
    }
}

testApiKey();