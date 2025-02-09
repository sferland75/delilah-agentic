import { BaseExtractor } from './base-extractor';
import { ValidationError, TableData } from '../templates/data/table_types';
import { DataSanitizer } from './data-sanitizer';

export interface IHAData {
  clientInfo: {
    name: string;
    dob: string;
    dol: string;
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
    preAccident: string[];
    injury: {
      mechanism: string;
      nature: string[];
      complications: string[];
    };
    currentTeam: Array<{
      provider: string;
      specialty: string;
      frequency: string;
    }>;
    medications: Array<{
      name: string;
      dosage: string;
      frequency: string;
      reason: string;
    }>;
  };
  functionalStatus: {
    mobility: string;
    balance: string;
    coordination: string;
    strength: string;
  };
  adl: {
    selfCare: {
      preAccident: string;
      current: string;
    };
    homeManagement: Array<{
      task: string;
      preAccident: string;
      current: string;
      timeAllotted?: string;
    }>;
    leisure: {
      preAccident: string[];
      current: string[];
    };
  };
  environment: {
    homeType: string;
    layout: string;
    accessibility: string;
    modifications: Array<{
      area: string;
      details: string;
      priority: string;
    }>;
  };
  recommendations: Array<{
    category: string;
    details: string;
    priority: string;
  }>;
}

export class IHAExtractor extends BaseExtractor {
  private validate(): ValidationError[] {
    const errors: ValidationError[] = [];
    
    if (!this.content) {
      errors.push({
        code: 'MISSING_CONTENT',
        message: 'No content provided for extraction'
      });
    }

    return errors;
  }

  private extractClientInfo(): IHAData['clientInfo'] {
    const section = this.findSection('Client Information');
    return {
      name: this.extractField('Name:', section),
      dob: this.extractField('Date of Birth:', section),
      dol: this.extractField('Date of Loss:', section),
      phone: this.extractField('Phone:', section),
      address: this.extractField('Address:', section),
      insurance: {
        company: this.extractField('Insurance Company:', section),
        claimNumber: this.extractField('Claim Number:', section),
        adjuster: this.extractField('Adjuster:', section)
      },
      lawyer: {
        name: this.extractField('Lawyer:', section),
        firm: this.extractField('Law Firm:', section)
      }
    };
  }

  private extractMedicalHistory(): IHAData['medicalHistory'] {
    const section = this.findSection('Medical History');
    return {
      preAccident: this.extractList(section, 'Pre-Accident Conditions:'),
      injury: {
        mechanism: this.extractParagraph(section, 'Mechanism of Injury:'),
        nature: this.extractList(section, 'Nature of Injuries:'),
        complications: this.extractList(section, 'Complications:')
      },
      currentTeam: this.extractTable(section, 'Current Medical Team').rows.map(row => ({
        provider: row['Provider'],
        specialty: row['Specialty'],
        frequency: row['Frequency']
      })),
      medications: this.extractTable(section, 'Current Medications').rows.map(row => ({
        name: row['Medication'],
        dosage: row['Dosage'],
        frequency: row['Frequency'],
        reason: row['Purpose']
      }))
    };
  }

  public extractFunctionalStatus(): IHAData['functionalStatus'] {
    const section = this.findSection('Functional Status Assessment');
    return {
      mobility: DataSanitizer.cleanText(this.extractParagraph(section, 'Mobility Status:')),
      balance: DataSanitizer.cleanText(this.extractParagraph(section, 'Balance Assessment:')),
      coordination: DataSanitizer.cleanText(this.extractParagraph(section, 'Coordination:')),
      strength: DataSanitizer.cleanText(this.extractParagraph(section, 'Strength Testing:'))
    };
  }

  public extractADL(): IHAData['adl'] {
    const section = this.findSection('Activities of Daily Living');
    return {
      selfCare: {
        preAccident: this.extractParagraph(section, 'Pre-Accident Self Care:'),
        current: this.extractParagraph(section, 'Current Self Care:')
      },
      homeManagement: this.extractTable(section, 'Home Management').rows.map(row => ({
        task: row['Task'],
        preAccident: row['Pre-Accident'],
        current: row['Current'],
        timeAllotted: row['Time Allotted']
      })),
      leisure: {
        preAccident: this.extractList(section, 'Pre-Accident Leisure:'),
        current: this.extractList(section, 'Current Leisure:')
      }
    };
  }

  public extractEnvironment(): IHAData['environment'] {
    const section = this.findSection('Environmental Assessment');
    return {
      homeType: this.extractField('Property Type:', section),
      layout: this.extractField('Layout:', section),
      accessibility: this.extractField('Accessibility:', section),
      modifications: this.extractTable(section, 'Recommended Modifications').rows.map(row => ({
        area: row['Area'],
        details: row['Details'],
        priority: row['Priority']
      }))
    };
  }

  public extractRecommendations(): IHAData['recommendations'] {
    const section = this.findSection('Recommendations');
    return this.extractTable(section, 'Recommendations').rows.map(row => ({
      category: row['Category'],
      details: row['Details'],
      priority: row['Priority']
    }));
  }

  public extract(): { success: boolean; data?: IHAData; errors?: ValidationError[] } {
    const errors = this.validate();
    
    if (errors.length > 0) {
      return {
        success: false,
        errors
      };
    }

    try {
      const data: IHAData = {
        clientInfo: this.extractClientInfo(),
        medicalHistory: this.extractMedicalHistory(),
        functionalStatus: this.extractFunctionalStatus(),
        adl: this.extractADL(),
        environment: this.extractEnvironment(),
        recommendations: this.extractRecommendations()
      };

      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        errors: [{
          code: 'EXTRACTION_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error occurred'
        }]
      };
    }
  }
}