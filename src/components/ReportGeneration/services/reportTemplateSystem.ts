import { AssessmentData } from '../../../types/assessment';

export interface ReportTemplate {
  metadata: {
    version: string;
    dateGenerated: string;
    assessor: {
      name: string;
      credentials: string;
      contact: {
        phone: string;
        email: string;
      };
    };
    client: {
      firstName: string;
      lastName: string;
      dateOfBirth: string;
      dateOfLoss: string;
    };
  };
  sections: ReportSection[];
}

export interface ReportSection {
  id: string;
  title: string;
  order: number;
  generate: (data: AssessmentData) => Promise<string>;
}

export class ReportGenerator {
  private template: ReportTemplate;
  private data: AssessmentData;

  constructor(template: ReportTemplate, data: AssessmentData) {
    this.template = template;
    this.data = data;
  }

  async generateReport(): Promise<string> {
    let report = `
OCCUPATIONAL THERAPY IN-HOME ASSESSMENT
Client Name: ${this.template.metadata.client.firstName} ${this.template.metadata.client.lastName}
Date of Birth: ${this.template.metadata.client.dateOfBirth}
Date of Assessment: ${this.template.metadata.dateGenerated}
Assessor: ${this.template.metadata.assessor.name} ${this.template.metadata.assessor.credentials}
`;

    for (const section of this.template.sections) {
      const content = await section.generate(this.data);
      report += '\n' + content;
    }

    return report;
  }
}
