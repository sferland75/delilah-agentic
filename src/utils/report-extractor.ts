import { BaseExtractor } from './base-extractor';
import { TableData } from '../templates/data/table_types';
import { DataSanitizer } from './data-sanitizer';

export interface ReportData {
  demographics: {
    name: string;
    dateOfBirth: string;
    dateOfLoss: string;
    dateOfAssessment: string;
    phone: string;
    address: string;
    insurance: {
      company: string;
      claimNumber: string;
      adjuster: string;
    };
    lawyer: {
      name: string;
      firm: string;
    };
  };
  medicalHistory: {
    preAccidentConditions: string[];
    diagnoses: Array<{
      condition: string;
      date: string;
      status: string;
    }>;
    medications: Array<{
      name: string;
      dosage: string;
      frequency: string;
      purpose: string;
    }>;
    treatment: Array<{
      provider: string;
      type: string;
      frequency: string;
      duration: string;
    }>;
  };
  symptoms: {
    physical: Array<{
      complaint: string;
      details: string;
      painRating: string;
    }>;
    cognitive: string[];
    emotional: string[];
  };
}

export class ReportExtractor extends BaseExtractor {
  constructor(content: string) {
    super(content);
  }

  public extract(): { success: boolean; data?: ReportData; error?: string } {
    try {
      const data: ReportData = {
        demographics: this.extractDemographics(),
        medicalHistory: this.extractMedicalHistory(),
        symptoms: this.extractSymptoms()
      };

      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error extracting report data'
      };
    }
  }

  private extractDemographics(): ReportData['demographics'] {
    // Look for demographic information at the start of the report
    const tablePattern = /\*\*Client Name:\*\*.*?(?=\*\*PRE-ACCIDENT|$)/s;
    const tableMatch = this.content.match(tablePattern);
    if (!tableMatch) {
      throw new Error('Demographics table not found');
    }

    const tableContent = tableMatch[0];
    
    // Extract each field using specific patterns
    const name = this.extractPattern(tableContent, /\*\*Client Name:\*\*\s*\[([^\]]+)\]/);
    const dob = this.extractPattern(tableContent, /\*\*Date of\s+Birth:\*\*\s*([^\n]+)/);
    const dol = this.extractPattern(tableContent, /\*\*Date of\s+Loss:\*\*\s*([^\n]+)/);
    const address = this.extractPattern(tableContent, /\*\*Address:\*\*\s*([^\n]+(?:\n[^*]+)*)/);
    const phone = this.extractPattern(tableContent, /\*\*Telephone #:\*\*\s*([^\n]+)/);
    const lawyer = this.extractPattern(tableContent, /\*\*Lawyer:\*\*\s*([^\n]+)/);
    const firm = this.extractPattern(tableContent, /\*\*Firm:\*\*\s*([^\n]+)/);
    const adjuster = this.extractPattern(tableContent, /\*\*Adjuster:\*\*\s*([^\n]+)/);
    const insurer = this.extractPattern(tableContent, /\*\*Insurer:\*\*\s*([^\n]+)/);
    const claimNo = this.extractPattern(tableContent, /\*\*Claim No\.:\*\*\s*([^\n]+)/);
    const dateOfAssessment = this.extractPattern(tableContent, /\*\*Date of\s+Assessment:\*\*\s*([^\n]+)/);

    return {
      name: DataSanitizer.sanitizeString(name),
      dateOfBirth: DataSanitizer.sanitizeString(dob),
      dateOfLoss: DataSanitizer.sanitizeString(dol),
      dateOfAssessment: DataSanitizer.sanitizeString(dateOfAssessment),
      phone: DataSanitizer.sanitizeString(phone),
      address: DataSanitizer.sanitizeString(address),
      insurance: {
        company: DataSanitizer.sanitizeString(insurer),
        claimNumber: DataSanitizer.sanitizeString(claimNo),
        adjuster: DataSanitizer.sanitizeString(adjuster)
      },
      lawyer: {
        name: DataSanitizer.sanitizeString(lawyer),
        firm: DataSanitizer.sanitizeString(firm)
      }
    };
  }

  private extractMedicalHistory(): ReportData['medicalHistory'] {
    const section = this.findSectionByMarker('**PRE-ACCIDENT MEDICAL HISTORY:**', '**');
    if (!section) {
      return {
        preAccidentConditions: [],
        diagnoses: [],
        medications: [],
        treatment: []
      };
    }

    // Extract bullet points as pre-accident conditions
    const conditionsPattern = /-\s*([^\n]+)/g;
    const conditions: string[] = [];
    let match;
    while ((match = conditionsPattern.exec(section)) !== null) {
      conditions.push(DataSanitizer.sanitizeString(match[1]));
    }

    return {
      preAccidentConditions: conditions,
      diagnoses: [], // These would be extracted from a different section
      medications: [],
      treatment: []
    };
  }

  private extractSymptoms(): ReportData['symptoms'] {
    const section = this.findSectionByMarker('**Physical Symptoms:**', '**');
    if (!section) {
      return {
        physical: [],
        cognitive: [],
        emotional: []
      };
    }

    // Extract the table content
    const tablePattern = /----------.*?----------/s;
    const tableMatch = section.match(tablePattern);
    if (!tableMatch) {
      return {
        physical: [],
        cognitive: [],
        emotional: []
      };
    }

    // Parse the table row
    const rowPattern = /\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|/;
    const match = section.match(rowPattern);
    if (!match) {
      return {
        physical: [],
        cognitive: [],
        emotional: []
      };
    }

    return {
      physical: [{
        complaint: DataSanitizer.sanitizeString(match[1]),
        details: DataSanitizer.sanitizeString(match[2]),
        painRating: DataSanitizer.sanitizeString(match[3])
      }],
      cognitive: [],
      emotional: []
    };
  }

  private extractPattern(content: string, pattern: RegExp): string {
    const match = content.match(pattern);
    return match ? match[1].trim() : '';
  }

  private findSectionByMarker(startMarker: string, endMarker: string): string | null {
    const startIndex = this.content.indexOf(startMarker);
    if (startIndex === -1) return null;

    const searchStartIndex = startIndex + startMarker.length;
    const nextMarkerIndex = this.content.indexOf(endMarker, searchStartIndex);
    
    if (nextMarkerIndex === -1) {
      return this.content.slice(searchStartIndex);
    }

    return this.content.slice(searchStartIndex, nextMarkerIndex);
  }
}