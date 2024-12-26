import { API_BASE_URL, API_ENDPOINTS } from './config';
import { AssessmentTemplate, TemplateStatus } from '../types/template';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new ApiError(response.status, error.message || 'An error occurred');
  }
  return response.json();
};

export const templateApi = {
  async listTemplates(skip = 0, limit = 100): Promise<AssessmentTemplate[]> {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.templates.list}?skip=${skip}&limit=${limit}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return handleResponse(response);
  },

  async getTemplate(id: string): Promise<AssessmentTemplate> {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.templates.get(id)}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return handleResponse(response);
  },

  async createTemplate(template: Omit<AssessmentTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<AssessmentTemplate> {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.templates.create}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(template),
      }
    );
    return handleResponse(response);
  },

  async updateTemplate(
    id: string,
    template: Omit<AssessmentTemplate, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<AssessmentTemplate> {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.templates.update(id)}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(template),
      }
    );
    return handleResponse(response);
  },

  async deleteTemplate(id: string): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.templates.delete(id)}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return handleResponse(response);
  },

  async updateTemplateStatus(id: string, status: TemplateStatus): Promise<AssessmentTemplate> {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.templates.updateStatus(id)}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      }
    );
    return handleResponse(response);
  },

  async getTemplatesByCategory(categoryId: string, skip = 0, limit = 100): Promise<AssessmentTemplate[]> {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.templates.byCategory(categoryId)}?skip=${skip}&limit=${limit}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return handleResponse(response);
  },
};