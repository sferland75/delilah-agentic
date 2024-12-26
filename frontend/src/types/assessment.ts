export interface PatientInfo {
  name: string;
  age: number;
  gender: string;
}

export interface Assessment {
  id: string;
  assessment_type: string;
  patient_info: PatientInfo;
  status: 'draft' | 'in_progress' | 'completed' | 'reviewed';
  created_at: string;
  updated_at: string;
  client_id?: string;
  therapist_id?: string;
  data?: {
    notes?: string;
    [key: string]: any;
  };
}