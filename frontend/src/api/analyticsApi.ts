interface DashboardMetrics {
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