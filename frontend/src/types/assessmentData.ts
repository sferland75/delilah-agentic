import { AssessmentTemplate } from './template';

export interface AssessmentResponse {
  fieldId: string;
  value: string | number | boolean | string[];
  notes?: string;
}

export interface AssessmentSectionData {
  sectionId: string;
  responses: AssessmentResponse[];
}

export interface AssessmentData {
  id: string;
  templateId: string;
  patientId: string;
  therapistId: string;
  status: 'draft' | 'in_progress' | 'completed' | 'reviewed';
  sections: AssessmentSectionData[];
  createdAt: string;
  updatedAt: string;
  score?: number;
  notes?: string;
  reviewerId?: string;
  reviewedAt?: string;
  reviewNotes?: string;
}