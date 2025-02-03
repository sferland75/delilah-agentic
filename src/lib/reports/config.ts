export type GeneratorMethod = () => string;

export enum ReportSection {
  Header = 'header',
  TherapistQualifications = 'therapistQualifications',
  DocumentationReviewed = 'documentationReviewed',
  SummaryOfFindings = 'summaryOfFindings',
  PreAccidentMedicalHistory = 'preAccidentMedicalHistory',
  MechanismOfInjury = 'mechanismOfInjury',
  CourseOfRecovery = 'courseOfRecovery',
  CurrentMedicalRehab = 'currentMedicalRehab',
  FunctionalAssessment = 'functionalAssessment',
  AMAAnalysis = 'amaAnalysis',
  Recommendations = 'recommendations',
  ClosingComments = 'closingComments'
}