export enum AssessmentType {
  INITIAL = 'initial',
  FOLLOW_UP = 'follow_up',
  DISCHARGE = 'discharge'
}

export enum AssessmentStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface Assessment {
  id: string;
  patient_id: string;
  therapist_id: string;
  assessment_type: AssessmentType;
  status: AssessmentStatus;
  observations?: string;
  measurements: Record<string, any>;
  recommendations?: string;
  goals: Record<string, any>;
  created_at: string;
  updated_at: string;
}