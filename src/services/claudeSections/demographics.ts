import { AssessmentData } from '../../types/assessment';

const DEMOGRAPHICS_PROMPT = `You are tasked with writing the DEMOGRAPHICS section of an in-home occupational therapy assessment report. 
Please organize and present the following client information in a professional, clinical format.

Guidelines:
- Write in a professional, clinical tone
- Present key information clearly and logically
- Include relevant insurance and legal representation details
- Maintain standard OT report formatting

Please structure your response like this example:

DEMOGRAPHICS

Mr. John Smith is a 45-year-old male who resides at [address]. He was assessed on [date] following a motor vehicle accident that occurred on [date of loss]. Mr. Smith is currently married and resides with his spouse.

Mr. Smith's claim is being managed by [insurance company] (claim #[number]), with [adjuster name] serving as the claims adjuster. Legal representation is being provided by [lawyer name] of [firm name].

Mr. Smith can be reached at [phone] or [email].`;

export async function generateDemographicsSection(
  apiKey: string,
  data: AssessmentData
): Promise<string> {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        temperature: 0.7,
        messages: [
          {
            role: 'user',
            content: `${DEMOGRAPHICS_PROMPT}

Client Information:
${JSON.stringify(data.clientInfo, null, 2)}

Please generate the demographics section now.`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result.content[0].text;
  } catch (error) {
    console.error('Error generating demographics section:', error);
    // Fallback to basic template if Claude fails
    return generateBasicDemographics(data);
  }
}

// Fallback function if Claude API fails
function generateBasicDemographics(data: AssessmentData): string {
  const { clientInfo } = data;
  
  return `DEMOGRAPHICS

${clientInfo.name} was assessed on [Assessment Date]. The client, born ${clientInfo.dob}, resides at ${clientInfo.address}.

Insurance claim (${clientInfo.insurance.claimNumber}) is being managed by ${clientInfo.insurance.adjuster} of ${clientInfo.insurance.company}.

Legal representation is being provided by ${clientInfo.lawyer.name} of ${clientInfo.lawyer.firm}.

Contact Information:
Phone: ${clientInfo.phone}`;
}

// Usage example:
/*
const demoSection = await generateDemographicsSection(
  'your-api-key',
  assessmentData
);
*/