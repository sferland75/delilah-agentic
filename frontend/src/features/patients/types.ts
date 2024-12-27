export interface Patient {
  id: string;
  external_id?: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  contact_number?: string;
  email?: string;
  address?: string;
  medical_history?: string;
  therapist_id: string;
  created_at: string;
  updated_at: string;
}

export interface PatientCreate {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  contact_number?: string;
  email?: string;
  address?: string;
  medical_history?: string;
}

export interface PatientUpdate extends Partial<PatientCreate> {}