import { OTReport } from './schemas/ot-report-schema';
import { 
  ROMAssessment, 
  StrengthAssessment, 
  Symptom,
  AMASphereDomain
} from './schemas/supporting-types';
import { cleanString } from './utils/transformations';

type SectionGenerator = keyof Pick<OTReportGenerator, 
  | 'generateHeader'
  | 'generateTherapistQualifications'
  | 'generateDocumentationReviewed'
  | 'generateSummaryOfFindings'
  | 'generatePreAccidentMedicalHistory'
  | 'generateMechanismOfInjury'
  | 'generateCourseOfRecovery'
  | 'generateCurrentMedicalRehab'
  | 'generateFunctionalAssessment'
  | 'generateAMAAnalysis'
  | 'generateRecommendations'
  | 'generateClosingComments'
>;

export class OTReportGenerator {
  private readonly report: OTReport;
  private readonly sections: SectionGenerator[];

  constructor(reportData: OTReport) {
    this.report = reportData;
    this.sections = [
      'generateHeader',
      'generateTherapistQualifications',
      'generateDocumentationReviewed',
      'generateSummaryOfFindings',
      'generatePreAccidentMedicalHistory',
      'generateMechanismOfInjury',
      'generateCourseOfRecovery',
      'generateCurrentMedicalRehab',
      'generateFunctionalAssessment',
      'generateAMAAnalysis',
      'generateRecommendations',
      'generateClosingComments'
    ];
  }

  public generateReport(): string {
    const content = this.sections
      .map(section => this[section]())
      .join('\n\n')
      .trim();
      
    return cleanString(content);
  }

  public generateHeader(): string {
    const { assessor, assessment, client } = this.report.metadata;
    return cleanString(`
OCCUPATIONAL THERAPY IN-HOME ASSESSMENT

Client Name: ${client.demographics.firstName} ${client.demographics.lastName}
Address: ${client.demographics.address}
Date of Birth: ${client.demographics.dateOfBirth}
Date of Assessment: ${assessment.date}
Date of Report: ${assessment.reportDate}`);
  }

  public generateTherapistQualifications(): string {
    const { assessor } = this.report.metadata;
    return cleanString(`
THERAPIST QUALIFICATIONS:

${assessor.name} is an Occupational Therapist with ${assessor.experience} providing rehabilitation and expert opinion services in the province of Ontario.

${assessor.qualifications.join('\n')}`);
  }

  public generateDocumentationReviewed(): string {
    const docs = this.report.metadata.documentation.reviewed;
    if (!docs.length) return '';
    
    return cleanString(`
DOCUMENTATION REVIEWED:

${docs.map(doc => {
  const parts = [];
  if (doc.source) parts.push(doc.source);
  if (doc.dateRange) parts.push(doc.dateRange);
  if (doc.details) parts.push(doc.details);
  return parts.join('\n');
}).join('\n\n')}`);
  }

  public generateSummaryOfFindings(): string {
    const { demographics } = this.report.metadata.client;
    const { accident, preAccident } = this.report.clinicalHistory;
    
    return cleanString(`
SUMMARY OF FINDINGS:

${demographics.firstName} ${demographics.lastName}, a ${demographics.gender}, sustained significant injuries in a ${accident.mechanism} on ${accident.date}. Prior to the accident, ${preAccident.functionalStatus}.

The comprehensive assessment of his current functioning reveals significant changes across all aspects of daily living, affecting his independence, family roles, and quality of life.`);
  }

  public generatePreAccidentMedicalHistory(): string {
    const { preAccident } = this.report.clinicalHistory;
    return cleanString(`
PRE-ACCIDENT MEDICAL HISTORY:

${preAccident.medicalHistory.join('\n\n')}`);
  }

  public generateMechanismOfInjury(): string {
    const { accident } = this.report.clinicalHistory;
    return cleanString(`
MECHANISM OF INJURY:

${accident.mechanism}

Initial Medical Response:
${accident.immediateResponse}

Initial Treatment:
${accident.initialTreatment}

${accident.subsequentCare.length ? `Subsequent Care:\n${accident.subsequentCare.join('\n')}` : ''}`);
  }

  public generateCourseOfRecovery(): string {
    const { postAccident } = this.report.clinicalHistory;
    return postAccident.courseOfRecovery ? cleanString(`
COURSE OF RECOVERY TO DATE:

${postAccident.courseOfRecovery}`) : '';
  }

  public generateCurrentMedicalRehab(): string {
    const { postAccident } = this.report.clinicalHistory;
    const { currentTreatment, medications } = postAccident;

    const treatmentSection = currentTreatment.length ? `
Healthcare Provider | Frequency | Focus
------------------|-----------|-------
${currentTreatment.map(t => 
  `${t.provider} (${t.type || ''}) | ${t.frequency || ''} | ${t.focus || ''}`
).join('\n')}` : '';

    const medicationSection = medications.length ? `
Current Medications:
${medications.map(m =>
  `• ${m.name} ${m.dosage} ${m.frequency} for ${m.purpose}`
).join('\n')}` : '';

    return cleanString(`
CURRENT MEDICAL/REHABILITATION TEAM:
${treatmentSection}

${medicationSection}`);
  }

  public generateFunctionalAssessment(): string {
    const { functionalAssessment: fa } = this.report;
    return cleanString(`
FUNCTIONAL AND BEHAVIOURAL OBSERVATIONS:

${this.formatSymptoms(fa.subjective.reportedSymptoms)}

${this.formatObjectiveFindings(fa.objective)}

${this.formatADLs(fa.adl)}`);
  }

  public generateAMAAnalysis(): string {
    const { amaAnalysis: ama } = this.report;
    return cleanString(`
ASSESSMENT OF THE FOUR SPHERES OF FUNCTION (AMA GUIDES TO THE EVALUATION OF PERMANENT IMPAIRMENT, 4TH EDITION):

Activities of Daily Living:
${this.formatAMADomain(ama.activities)}

Social Functioning:
${this.formatAMADomain(ama.social)}

Concentration, Persistence and Pace:
${this.formatAMADomain(ama.concentration)}

Adaptation:
${this.formatAMADomain(ama.adaptation)}`);
  }

  public generateRecommendations(): string {
    const { recommendations: rec } = this.report;
    return cleanString(`
RECOMMENDATIONS:

${rec.rehabilitation.length ? `Rehabilitation Services:\n${rec.rehabilitation.map(r => `• ${r}`).join('\n')}\n` : ''}
${rec.equipment.length ? `Equipment Needs:\n${rec.equipment.map(e => `• ${e}`).join('\n')}\n` : ''}
${rec.homeModifications.length ? `Home Modifications:\n${rec.homeModifications.map(m => `• ${m}`).join('\n')}\n` : ''}
${rec.support.length ? `Support Services:\n${rec.support.map(s => `• ${s}`).join('\n')}\n` : ''}
${rec.followUp.length ? `Follow-up Plan:\n${rec.followUp.map(f => `• ${f}`).join('\n')}` : ''}`);
  }

  public generateClosingComments(): string {
    const { assessor } = this.report.metadata;
    return cleanString(`
CLOSING COMMENTS:

This therapist may be contacted through the offices of FERLAND & ASSOCIATES REHABILITATION INC.
at 613-204-1549 or by email at ferland@ferlandassociates.com.

Sincerely,

${assessor.name}
${assessor.credentials}`);
  }

  private formatSymptoms(symptoms: Symptom[]): string {
    if (!symptoms.length) return 'No symptoms reported.';
    
    const byType = symptoms.reduce((acc, s) => {
      if (!acc[s.type]) acc[s.type] = [];
      acc[s.type].push(s);
      return acc;
    }, {} as Record<string, Symptom[]>);

    return Object.entries(byType).map(([type, typeSymptoms]) => `
${type.toUpperCase()} SYMPTOMS:
${typeSymptoms.map(s => cleanString(`
• ${s.description}: ${s.severity}, ${s.frequency}
  ${s.aggravating ? `Aggravating: ${s.aggravating.join(', ')}` : ''}
  ${s.relieving ? `Relieving: ${s.relieving.join(', ')}` : ''}
  ${s.impact ? `Impact: ${s.impact}` : ''}`)).join('\n')}`).join('\n\n');
  }

  private formatObjectiveFindings(objective: any): string {
    return cleanString(`
OBJECTIVE FINDINGS:

Range of Motion:
${objective.rangeOfMotion.map((rom: ROMAssessment) => 
  `${rom.joint} ${rom.movement}: ${rom.left?.active || 'N/A'} / ${rom.right?.active || 'N/A'} - ${rom.notes}`
).join('\n')}

Strength:
${objective.strength.map((s: StrengthAssessment) => 
  `${s.muscle}: L=${s.left}, R=${s.right} ${s.notes ? `- ${s.notes}` : ''}`
).join('\n')}

Balance:
${objective.balance.notes}

Tolerances:
${Object.entries(objective.tolerances)
  .filter(([_, v]) => v)
  .map(([k, v]) => `${k}: ${v}`)
  .join('\n')}`);
  }

  private formatADLs(adl: any): string {
    const formatSection = (section: any[]) => {
      if (!section.length) return '';
      return section.map(a => cleanString(`
${a.activity}:
Pre-accident: ${a.preAccidentStatus}
Current: ${a.currentStatus}
${a.independence ? `Independence: ${a.independence}` : ''}`)).join('\n\n');
    };

    const sections = [
      ['SELF CARE:', formatSection(adl.selfCare)],
      ['HOME MANAGEMENT:', formatSection(adl.homeManagement)],
      ['LEISURE:', formatSection(adl.leisure)]
    ].filter(([_, content]) => content);

    return sections.map(([title, content]) => `${title}\n${content}`).join('\n\n');
  }

  private formatAMADomain(domain: AMASphereDomain): string {
    if (!domain.description && !domain.preAccidentStatus && !domain.currentStatus) {
      return 'No data available.';
    }

    return cleanString(`
${domain.description ? `Description: ${domain.description}\n` : ''}
${domain.preAccidentStatus ? `Pre-accident Status:\n${domain.preAccidentStatus}\n` : ''}
${domain.currentStatus ? `Current Status:\n${domain.currentStatus}\n` : ''}
${domain.impairments.length ? `Impairments:\n${domain.impairments.map(i => `• ${i}`).join('\n')}\n` : ''}
${domain.evidence.length ? `Supporting Evidence:\n${domain.evidence.map(e => `• ${e}`).join('\n')}` : ''}`);
  }
}