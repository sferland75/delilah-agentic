export interface AssessmentData {
  metadata: {
    version: string;
    exportDate: string;
    lastModified: string;
    exportType: string;
  };
  assessment: {
    demographics: any;
    medicalHistory: any;
    symptoms: any;
    functionalAssessment: any;
    environmental: any;
    adl: any;
    amaGuides: any;
    documentation?: any;
    typicalDay?: any;
  };
}

export class ReportTemplateService {
  private formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  private generateDemographicsSection(demographics: any): string {
    const fullName = `${demographics.firstName} ${demographics.lastName}`;
    const dob = this.formatDate(demographics.dateOfBirth);
    
    return `
CLIENT INFORMATION:
Name: ${fullName}
Date of Birth: ${dob}
Address: ${demographics.address}
Phone: ${demographics.phone}
Email: ${demographics.email}

Emergency Contact: ${demographics.emergencyContact.name} (${demographics.emergencyContact.relationship})
Phone: ${demographics.emergencyContact.phone}
`;
  }

  private generateMedicalHistorySection(medicalHistory: any): string {
    const medications = medicalHistory.medications.map((med: any) => 
      `● ${med.name} ${med.dosage} ${med.frequency} - ${med.purpose}`
    ).join('\n');

    const currentTreatments = medicalHistory.currentTreatment
      .filter((treatment: any) => treatment.name)
      .map((treatment: any) => 
        `● ${treatment.name} (${treatment.providerType}): ${treatment.frequency} - ${treatment.focus}`
      ).join('\n');

    return `
MEDICAL HISTORY:
Pre-existing Conditions:
${medicalHistory.preExisting}

Current Medications:
${medications}

Current Treatment:
${currentTreatments}

Previous Surgeries:
${medicalHistory.surgeries}
`;
  }

  private generateSymptomsSection(symptoms: any): string {
    const physical = symptoms.physical.map((symptom: any) => 
      `● ${symptom.location}: ${symptom.painType} pain, ${symptom.severity}, ${symptom.frequency}
    Aggravating: ${symptom.aggravating}
    Relieving: ${symptom.relieving}`
    ).join('\n\n');

    const cognitive = symptoms.cognitive.map((symptom: any) => 
      `● ${symptom.symptom}: ${symptom.severity}, ${symptom.frequency}
    Impact: ${symptom.impact}
    Management: ${symptom.management || 'Not specified'}`
    ).join('\n\n');

    return `
SYMPTOMS:
Physical Symptoms:
${physical}

Cognitive Symptoms:
${cognitive}

General Notes:
${symptoms.generalNotes}
`;
  }

  public async generateSection(data: AssessmentData, sectionName: string): Promise<string> {
    const {
      demographics,
      medicalHistory,
      symptoms,
      functionalAssessment,
      environmental,
      adl,
      amaGuides
    } = data.assessment;

    switch(sectionName) {
      case 'Demographics and Background':
        return this.generateDemographicsSection(demographics);
      case 'Medical History':
        return this.generateMedicalHistorySection(medicalHistory);
      case 'Symptoms':
        return this.generateSymptomsSection(symptoms);
      // Add other section generators
      default:
        return '';
    }
  }
}

export const defaultTemplate = {
  sections: [
    {
      id: 'demographics',
      title: 'Demographics and Background',
      order: 1,
      generate: async (data: AssessmentData) => {
        const service = new ReportTemplateService();
        return service.generateSection(data, 'Demographics and Background');
      }
    },
    {
      id: 'medicalHistory',
      title: 'Medical History',
      order: 2,
      generate: async (data: AssessmentData) => {
        const service = new ReportTemplateService();
        return service.generateSection(data, 'Medical History');
      }
    },
    {
      id: 'symptoms',
      title: 'Symptoms',
      order: 3,
      generate: async (data: AssessmentData) => {
        const service = new ReportTemplateService();
        return service.generateSection(data, 'Symptoms');
      }
    }
  ]
};