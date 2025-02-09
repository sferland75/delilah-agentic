function getSectionPrompt(sectionType, data) {
    const prompts = {
        demographics: `You are an occupational therapist writing a professional assessment report. Generate the demographics section based on this data:
${JSON.stringify(data.personal, null, 2)}

Requirements:
- Use professional medical-legal writing style
- Write in clear, objective language
- Avoid first person
- Include all relevant demographic details
- Format as a cohesive paragraph`,
        injury: `You are an occupational therapist writing a professional assessment report. Generate the injury/accident history section based on this data:
${JSON.stringify(data.medical, null, 2)}

Requirements:
- Detail the injury circumstance and date
- Describe initial and current symptoms
- Include imaging results and current treatments
- List current medications and their purposes
- Write in professional medical-legal style`,
        functionalStatus: `You are an occupational therapist writing a professional assessment report. Generate the functional status section based on this data:
${JSON.stringify(data.functionalAssessment, null, 2)}

Requirements:
- Detail all physical tolerances with specific measurements
- Include ROM and MMT findings with clinical interpretation
- Describe functional limitations and adaptations
- Explain impact on daily activities
- Use professional terminology and objective language`,
        adlAssessment: `You are an occupational therapist writing a professional assessment report. Generate the ADL assessment section based on this data:
${JSON.stringify(data.adl, null, 2)}

Requirements:
- Analyze both basic and instrumental ADLs
- Detail independence levels for each activity
- Document adaptive equipment usage
- Specify assistance requirements
- Address safety considerations
- Use professional medical-legal language`,
        environmental: `You are an occupational therapist writing a professional assessment report. Generate the environmental assessment section based on this data:
${JSON.stringify(data.environmental, null, 2)}

Requirements:
- Assess home layout and accessibility
- Provide room-by-room analysis
- Identify safety concerns
- List current and recommended modifications
- Detail equipment needs
- Write in professional evaluative style`,
        recommendations: `You are an occupational therapist writing a professional assessment report. Based on the comprehensive assessment data, generate a recommendations section that includes:

1. Therapeutic Interventions
2. Home Modifications
3. Adaptive Equipment
4. Work Accommodations
5. Safety Measures
6. Follow-up Care

Requirements:
- Provide specific, actionable recommendations
- Justify each recommendation
- Use professional medical-legal language
- Organize in clear categories
- Include timeframes where appropriate`
    };
    return prompts[sectionType];
}
async function generateReportSection(sectionType, data) {
    const prompt = getSectionPrompt(sectionType, data);
    if (!prompt) {
        throw new Error(`Invalid section type: ${sectionType}`);
    }
    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'anthropic-version': '2023-06-01',
                'x-api-key': process.env.ANTHROPIC_API_KEY || ''
            },
            body: JSON.stringify({
                model: 'claude-3-sonnet-20240229',
                messages: [{
                        role: 'user',
                        content: prompt
                    }],
                max_tokens: 2000
            })
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API request failed: ${response.statusText}\n${errorText}`);
        }
        const result = await response.json();
        return result.content[0].text;
    }
    catch (error) {
        console.error(`Error generating ${sectionType} section:`, error);
        throw error;
    }
}
async function generateFullReport(data) {
    const sections = [
        'demographics',
        'injury',
        'functionalStatus',
        'adlAssessment',
        'environmental',
        'recommendations'
    ];
    const reportParts = await Promise.all(sections.map(section => generateReportSection(section, data)));
    return reportParts.join('\n\n---\n\n');
}
export { generateReportSection, generateFullReport };
