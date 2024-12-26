export interface DashboardMetrics {
  overview: {
    total_assessments: number;
    active_patients: number;
    active_therapists: number;
    pending_reviews: number;
  };
  completion_rates: {
    last_7_days: number;
    last_30_days: number;
    last_90_days: number;
  };
  score_distribution: {
    high: number;
    medium: number;
    low: number;
  };
  trends: {
    assessments_per_day: Array<{ date: string; value: number }>;
    average_scores: Array<{ date: string; value: number }>;
    completion_times: Array<{ date: string; value: number }>;
  };
}

export interface PatientMetrics {
  assessment_count: number;
  completion_rate: number;
  average_score: number;
  score_trend: number[];
  last_assessment_date: string | null;
}

export interface TherapistMetrics {
  assessments_assigned: number;
  assessments_completed: number;
  average_review_time: number;
  patient_count: number;
  average_patient_score: number;
}

const API_BASE_URL = '/api';

export const analyticsApi = {
  async getDashboardMetrics(
    startDate?: Date,
    endDate?: Date
  ): Promise<DashboardMetrics> {
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.append('start_date', startDate.toISOString());
    if (endDate) queryParams.append('end_date', endDate.toISOString());

    const response = await fetch(`${API_BASE_URL}/analytics/dashboard?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard metrics');
    }
    return response.json();
  },

  async getTherapistMetrics(
    therapistId: string,
    timeframeDays: number = 30
  ): Promise<TherapistMetrics> {
    const response = await fetch(
      `${API_BASE_URL}/analytics/therapist/${therapistId}?timeframe_days=${timeframeDays}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch therapist metrics');
    }
    return response.json();
  },

  async getPatientMetrics(
    patientId: string,
    timeframeDays: number = 90
  ): Promise<PatientMetrics> {
    const response = await fetch(
      `${API_BASE_URL}/analytics/patient/${patientId}?timeframe_days=${timeframeDays}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch patient metrics');
    }
    return response.json();
  }
};