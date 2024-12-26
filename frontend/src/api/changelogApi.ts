export interface ChangelogEntry {
  id: string;
  assessmentId: string;
  userId: string;
  action: string;
  changes: Record<string, any>;
  createdAt: string;
  metadata?: Record<string, any>;
}

const API_BASE_URL = '/api';

export const changelogApi = {
  async getAssessmentHistory(assessmentId: string, startDate?: Date, endDate?: Date): Promise<ChangelogEntry[]> {
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.append('start_date', startDate.toISOString());
    if (endDate) queryParams.append('end_date', endDate.toISOString());

    const response = await fetch(`${API_BASE_URL}/changelog/assessment/${assessmentId}?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch assessment history');
    }
    return response.json();
  },

  async getUserActivity(userId: string, startDate?: Date, endDate?: Date): Promise<ChangelogEntry[]> {
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.append('start_date', startDate.toISOString());
    if (endDate) queryParams.append('end_date', endDate.toISOString());

    const response = await fetch(`${API_BASE_URL}/changelog/user/${userId}?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user activity');
    }
    return response.json();
  },
};