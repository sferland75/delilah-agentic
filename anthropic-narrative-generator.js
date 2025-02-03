// Narrative generation using Anthropic API
const Anthropic = require('@anthropic-ai/sdk');

class NarrativeGenerator {
  constructor(apiKey = process.env.ANTHROPIC_API_KEY) {
    if (!apiKey) {
      throw new Error('No API key found. Please set ANTHROPIC_API_KEY environment variable.');
    }
    
    this.anthropic = new Anthropic({
      apiKey: apiKey,
    });
  }

  // Rest of the class implementation remains the same...
  async generateBackgroundNarrative(data) {
    const prompt = `
      Generate a detailed, professional narrative about a client's background and current situation using this data:
      
      Name: ${data.firstName} ${data.lastName}
      Age: ${this.calculateAge(data.dateOfBirth)}
      Gender: ${data.gender}
      Marital Status: ${data.maritalStatus}
      Household: ${this.formatHouseholdInfo(data)}
      
      Pre-accident routine:
      ${JSON.stringify(data.typicalDay.preAccident, null, 2)}
      
      Current routine:
      ${JSON.stringify(data.typicalDay.current, null, 2)}
      
      Write a flowing narrative that describes their life before and after the incident. Focus on changes in daily routines, 
      household dynamics, and lifestyle adjustments. Use a professional medical-legal report style.
    `;

    const response = await this.anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }]
    });

    return response.content[0].text;
  }

  async generateSymptomNarrative(data) {
    const prompt = `
      Generate a detailed medical narrative about a client's symptoms using this data:
      
      Physical Symptoms:
      ${JSON.stringify(data.symptoms.physical, null, 2)}
      
      Cognitive Symptoms:
      ${JSON.stringify(data.symptoms.cognitive, null, 2)}
      
      Emotional Symptoms:
      ${JSON.stringify(data.symptoms.emotional, null, 2)}
      
      Create a flowing narrative that describes their symptom presentation, including frequency, severity, 
      impact on daily life, and management strategies. Use professional medical terminology where appropriate.
      Format the response like a medical-legal report section.
    `;

    const response = await this.anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }]
    });

    return response.content[0].text;
  }

  async generateFunctionalNarrative(data) {
    const prompt = `
      Generate a detailed narrative about a client's functional status using this assessment data:
      
      Range of Motion:
      ${JSON.stringify(data.functionalAssessment.rangeOfMotion, null, 2)}
      
      Manual Muscle Testing:
      ${JSON.stringify(data.functionalAssessment.manualMuscleTesting, null, 2)}
      
      Berg Balance:
      ${JSON.stringify(data.functionalAssessment.bergBalance, null, 2)}
      
      Create a professional narrative that describes their functional capabilities, limitations, and clinical implications.
      Include specific measurements but present them in a flowing, readable style. Use appropriate medical terminology.
    `;

    const response = await this.anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }]
    });

    return response.content[0].text;
  }

  async generateADLNarrative(data) {
    const prompt = `
      Generate a detailed narrative about a client's activities of daily living using this assessment data:
      
      Basic ADLs:
      ${JSON.stringify(data.adl.basic, null, 2)}
      
      Instrumental ADLs:
      ${JSON.stringify(data.adl.iadl, null, 2)}
      
      Write a flowing narrative that describes their level of independence, required assistance, and adaptations
      for each activity. Include specific examples and clinical observations. Use professional medical-legal language.
    `;

    const response = await this.anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }]
    });

    return response.content[0].text;
  }

  async generateConclusionNarrative(data) {
    const prompt = `
      Generate a comprehensive conclusion for a medical-legal report using this assessment data:
      
      Functional Status:
      ${JSON.stringify(data.functionalAssessment, null, 2)}
      
      Care Needs:
      ${JSON.stringify(data.care, null, 2)}
      
      AMA Guides Ratings:
      ${JSON.stringify(data.amaGuides, null, 2)}
      
      Create a professional conclusion that:
      1. Summarizes key findings
      2. Discusses functional implications
      3. Outlines care recommendations
      4. Addresses prognosis
      5. Provides specific recommendations for rehabilitation and support
      
      Use appropriate medical-legal language and maintain a professional, objective tone.
    `;

    const response = await this.anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }]
    });

    return response.content[0].text;
  }

  // Helper functions
  calculateAge(dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  formatHouseholdInfo(data) {
    if (!data.householdMembers || data.householdMembers.length === 0) {
      return 'Lives alone';
    }
    return data.householdMembers.map(member => 
      `${member.name}${member.relationship ? ` (${member.relationship})` : ''}${member.notes ? `: ${member.notes}` : ''}`
    ).join(', ');
  }
}

module.exports = NarrativeGenerator;