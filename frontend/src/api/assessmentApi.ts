import { AssessmentData } from '../types/assessmentData';

const API_BASE_URL = '/api';

export const assessmentApi = {
  async listAssessments(params?: {
    patientId?: string;
    therapistId?: string;
    status?: string;
  }): Promise<AssessmentData[]> {
    const queryParams = new URLSearchParams();
    if (params?.patientId) queryParams.append('patient_id', params.patientId);
    if (params?.therapistId) queryParams.append('therapist_id', params.therapistId);
    if (params?.status) queryParams.append('status', params.status);

    const response = await fetch(`${API_BASE_URL}/assessments?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch assessments');
    }
    return response.json();
  },

  async getAssessment(id: string): Promise<AssessmentData> {
    const response = await fetch(`${API_BASE_URL}/assessments/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch assessment');
    }
    return response.json();
  },

  async createAssessment(assessment: Partial<AssessmentData>): Promise<AssessmentData> {
    const response = await fetch(`${API_BASE_URL}/assessments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(assessment),
    });
    if (!response.ok) {
      throw new Error('Failed to create assessment');
    }
    return response.json();
  },

  async updateAssessment(id: string, assessment: Partial<AssessmentData>): Promise<AssessmentData> {
    const response = await fetch(`${API_BASE_URL}/assessments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(assessment),
    });
    if (!response.ok) {
      throw new Error('Failed to update assessment');
    }
    return response.json();
  },

  async deleteAssessment(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/assessments/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete assessment');
    }
  },

  async submitAssessment(id: string): Promise<AssessmentData> {
    const response = await fetch(`${API_BASE_URL}/assessments/${id}/submit`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to submit assessment');
    }
    return response.json();
  },

  async reviewAssessment(
    id: string,
    reviewerId: string,
    notes: string,
    approved: boolean
  ): Promise<AssessmentData> {
    const response = await fetch(`${API_BASE_URL}/assessments/${id}/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reviewer_id: reviewerId,
        notes,
        approved,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to review assessment');
    }
    return response.json();
  },
};