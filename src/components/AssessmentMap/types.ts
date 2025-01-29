export type AssessmentType = 'ROM' | 'MMT';

export interface AssessmentArea {
  id: string;
  path: string;
  type: 'visual' | 'joint' | 'muscle';
  label: string;
  assessments: AssessmentType[];
}

export interface ROMAssessment {
  percentage: string;
  painLevel: string;
  restrictions: string;
  notes: string;
}

export interface MMTAssessment {
  grade: string;
  painLevel: string;
  compensation: boolean;
  observations: string;
}