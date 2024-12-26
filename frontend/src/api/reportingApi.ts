export interface ReportConfig {
  id: string;
  name: string;
  type: 'assessment' | 'patient' | 'therapist' | 'summary';
  filters: Record<string, any>;
  grouping?: string[];
  metrics: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
}

export interface ReportResult {
  id: string;
  configId: string;
  generatedAt: string;
  data: any[];
  summary?: Record<string, any>;
  metadata?: Record<string, any>;
}

const API_BASE_URL = '/api';

export const reportingApi = {
  async generateReport(config: ReportConfig): Promise<ReportResult> {
    const response = await fetch(`${API_BASE_URL}/reports/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      throw new Error('Failed to generate report');
    }

    return response.json();
  },

  async getReport(reportId: string): Promise<ReportResult> {
    const response = await fetch(`${API_BASE_URL}/reports/${reportId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch report');
    }

    return response.json();
  },

  async listReports(params?: {
    reportType?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<ReportResult[]> {
    const queryParams = new URLSearchParams();
    if (params?.reportType) queryParams.append('report_type', params.reportType);
    if (params?.startDate) queryParams.append('start_date', params.startDate.toISOString());
    if (params?.endDate) queryParams.append('end_date', params.endDate.toISOString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const response = await fetch(`${API_BASE_URL}/reports/?${queryParams}`);

    if (!response.ok) {
      throw new Error('Failed to fetch reports');
    }

    return response.json();
  },

  async deleteReport(reportId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/reports/${reportId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete report');
    }
  },
};