import { cleanString } from './utils/transformations';
import {
  generateSummaryPrompt,
  generateMedicalHistoryPrompt,
  generateFunctionalAssessmentPrompt,
  generateRecommendationsPrompt
} from './promptTemplates';
import fs from 'fs/promises';
import path from 'path';

interface ReportSections {
  summary: string;
  medicalHistory: string;
  functionalAssessment: string;
  recommendations: string;
}

export class ClaudeReportGenerator {
  private readonly ANTHROPIC_API_ENDPOINT = "https://api.anthropic.com/v1/messages";
  private readonly MODEL = "claude-3-opus-20240229";
  private readonly MAX_TOKENS = 4096;
  private readonly MAX_RETRIES = 5;
  private readonly RETRY_DELAY = 5000; // 5 seconds
  private readonly SECTION_DELAY = 3000; // 3 seconds between sections

  constructor(
    private readonly apiKey: string,
    private readonly reportData: any,
    private readonly contextDocuments: string[] = []
  ) {}

  async generateFullReport(): Promise<string> {
    try {
      console.log("\nStarting report generation...");

      // Generate sections sequentially with delays
      console.log("\n1. Generating Summary...");
      const summary = await this.generateSection("SUMMARY OF FINDINGS", await this.buildSummaryPrompt());
      await this.delay(this.SECTION_DELAY);
      
      console.log("\n2. Generating Medical History...");
      const medicalHistory = await this.generateSection("MEDICAL HISTORY", await this.buildMedicalHistoryPrompt());
      await this.delay(this.SECTION_DELAY);
      
      console.log("\n3. Generating Functional Assessment...");
      const functionalAssessment = await this.generateSection("FUNCTIONAL ASSESSMENT", await this.buildFunctionalPrompt());
      await this.delay(this.SECTION_DELAY);
      
      console.log("\n4. Generating Recommendations...");
      const recommendations = await this.generateSection("RECOMMENDATIONS", await this.buildRecommendationsPrompt());

      // Save each section separately
      await this.saveSectionToFile("summary", summary);
      await this.saveSectionToFile("medical-history", medicalHistory);
      await this.saveSectionToFile("functional-assessment", functionalAssessment);
      await this.saveSectionToFile("recommendations", recommendations);

      // Combine sections into final report
      console.log("\nCombining report sections...");
      const report = this.combineReportSections({
        summary,
        medicalHistory,
        functionalAssessment,
        recommendations
      });

      return report;

    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }

  private async generateSection(section: string, prompt: string, retryCount = 0): Promise<string> {
    try {
      console.log(`Attempting to generate ${section}...`);
      
      const response = await fetch(this.ANTHROPIC_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: this.MODEL,
          max_tokens: this.MAX_TOKENS,
          messages: [
            {
              role: "user", 
              content: prompt
            }
          ]
        })
      });

      if (response.status === 429 && retryCount < this.MAX_RETRIES) {
        const delayTime = this.RETRY_DELAY * (retryCount + 1); // Exponential backoff
        console.log(`Rate limit hit for ${section}, waiting ${delayTime/1000} seconds before retry ${retryCount + 1}...`);
        await this.delay(delayTime);
        return this.generateSection(section, prompt, retryCount + 1);
      }

      if (!response.ok) {
        throw new Error(`API request failed for ${section}: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log(`✓ ${section} complete`);
      return cleanString(result.content[0].text);

    } catch (error) {
      if (retryCount < this.MAX_RETRIES) {
        const delayTime = this.RETRY_DELAY * (retryCount + 1);
        console.log(`Error generating ${section}, retrying in ${delayTime/1000} seconds...`);
        await this.delay(delayTime);
        return this.generateSection(section, prompt, retryCount + 1);
      }
      console.error(`Error generating ${section}:`, error);
      throw error;
    }
  }

  private async buildSummaryPrompt(): Promise<string> {
    const demographics = this.reportData.assessment.demographics;
    const medicalHistory = this.reportData.assessment.medicalHistory;
    const symptoms = this.reportData.assessment.symptoms;

    return generateSummaryPrompt({
      name: `${demographics.firstName} ${demographics.lastName}`,
      age: this.calculateAge(demographics.dateOfBirth),
      gender: demographics.gender,
      injury: medicalHistory.injury,
      symptoms: {
        physical: JSON.stringify(symptoms.physical, null, 2),
        cognitive: JSON.stringify(symptoms.cognitive, null, 2),
        emotional: JSON.stringify(symptoms.emotional, null, 2)
      }
    });
  }

  private async buildMedicalHistoryPrompt(): Promise<string> {
    return generateMedicalHistoryPrompt(this.reportData.assessment.medicalHistory);
  }

  private async buildFunctionalPrompt(): Promise<string> {
    return generateFunctionalAssessmentPrompt(this.reportData.assessment.functionalAssessment);
  }

  private async buildRecommendationsPrompt(): Promise<string> {
    return generateRecommendationsPrompt({
      functionalAssessment: this.reportData.assessment.functionalAssessment,
      symptoms: this.reportData.assessment.symptoms,
      adl: this.reportData.assessment.adl,
      environmental: this.reportData.assessment.environmental
    });
  }

  private combineReportSections(sections: ReportSections): string {
    const header = this.generateHeader();
    const methodology = this.generateMethodology();
    
    return [
      header,
      methodology,
      sections.summary,
      sections.medicalHistory,
      sections.functionalAssessment,
      sections.recommendations,
      this.generateSignature()
    ].join('\n\n');
  }

  private generateHeader(): string {
    const demographics = this.reportData.assessment.demographics;
    
    return `
MEDICO-LEGAL ASSESSMENT REPORT

Date of Report: ${new Date().toISOString().split('T')[0]}
Date of Assessment: ${this.reportData.metadata.lastModified.split('T')[0]}

IDENTIFYING INFORMATION
Name: ${demographics.firstName} ${demographics.lastName}
Date of Birth: ${demographics.dateOfBirth}
Age: ${this.calculateAge(demographics.dateOfBirth)}
Gender: ${demographics.gender}
Address: ${demographics.address || 'Not provided'}
Phone: ${demographics.phone || 'Not provided'}
Email: ${demographics.email || 'Not provided'}

REFERRAL INFORMATION
Referral Source: [To be added]
Claim Number: [To be added]
Date of Incident: [To be added]
    `;
  }

  private generateMethodology(): string {
    return `
METHODOLOGY

The following assessment methods were employed:
1. Comprehensive review of medical and legal documentation
2. In-person functional assessment
3. Clinical interview and observation
4. Standardized testing including:
   - Range of motion measurements
   - Manual muscle testing
   - Berg Balance Scale
   - Activities of daily living assessment
5. Environmental assessment
6. Analysis of functional capacity across multiple domains
7. Review of current symptoms and limitations
8. Evaluation of care needs and support requirements

All testing was performed in accordance with standardized protocols and professional guidelines.
    `;
  }

  private generateSignature(): string {
    return `
Sincerely,

[Assessor Name]
[Credentials]
[License Number]
[Professional Designation]
    `;
  }

  private async saveSectionToFile(sectionName: string, content: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputDir = path.join(__dirname, 'output');
    const fileName = `${sectionName}-${timestamp}.txt`;
    const filePath = path.join(outputDir, fileName);
    
    await fs.writeFile(filePath, content, 'utf8');
    console.log(`Saved ${sectionName} to ${fileName}`);
  }

  private calculateAge(dateOfBirth: string): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}