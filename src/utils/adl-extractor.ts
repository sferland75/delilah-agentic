import { BaseExtractor } from './base-extractor';
import { DataSanitizer } from './data-sanitizer';

export interface ADLData {
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
  work?: {
    preAccident: {
      status: string;
      employer: string;
      hours: string;
      duties: string[];
    };
    current: {
      status: string;
      changes: string;
      limitations: string;
    };
  };
}

export class ADLExtractor extends BaseExtractor {
  constructor(content: string) {
    super(content);
  }

  public extractADL(): ADLData {
    const section = this.findSection('Activities of Daily Living');
    
    // Extract work information first as it's optional
    const workSection = this.findSection('Employment Status');
    const work = workSection ? {
      preAccident: {
        status: this.extractField('Pre-Accident Status:', workSection),
        employer: this.extractField('Employer:', workSection),
        hours: this.extractField('Hours:', workSection),
        duties: this.extractList(workSection, 'Job Duties:')
      },
      current: {
        status: this.extractField('Current Status:', workSection),
        changes: this.extractField('Work Changes:', workSection),
        limitations: this.extractField('Work Limitations:', workSection)
      }
    } : undefined;

    return {
      selfCare: {
        preAccident: DataSanitizer.cleanText(this.extractParagraph(section, 'Pre-Accident Self Care:')),
        current: DataSanitizer.cleanText(this.extractParagraph(section, 'Current Self Care:'))
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
      },
      work
    };
  }
}