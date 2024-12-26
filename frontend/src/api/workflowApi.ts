export type AssessmentStatus = 
  | 'draft'
  | 'in_progress'
  | 'pending_review'
  | 'reviewed'
  | 'completed'
  | 'returned';

export interface ValidationError {
  field: string;
  message: string;
}

const API_BASE_URL = '/api';

export const workflowApi = {
  async transitionStatus(
    assessmentId: string,
    fromStatus: AssessmentStatus,
    toStatus: AssessmentStatus,
    userId: string,
    transitionData?: Record<string, any>
  ): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/workflow/${assessmentId}/transition`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from_status: fromStatus,
        to_status: toStatus,
        user_id: userId,
        transition_data: transitionData,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to transition status');
    }
  },

  async getPossibleTransitions(
    assessmentId: string,
    currentStatus: AssessmentStatus,
    userId: string
  ): Promise<AssessmentStatus[]> {
    const response = await fetch(
      `${API_BASE_URL}/workflow/${assessmentId}/possible-transitions?` +
      new URLSearchParams({
        current_status: currentStatus,
        user_id: userId,
      })
    );

    if (!response.ok) {
      throw new Error('Failed to get possible transitions');
    }

    const data = await response.json();
    return data.possible_transitions;
  },

  async validateAssessment(
    assessmentId: string,
    rules: string[]
  ): Promise<{ isValid: boolean; errors: ValidationError[] }> {
    const response = await fetch(
      `${API_BASE_URL}/workflow/${assessmentId}/validate?` +
      new URLSearchParams({ rules: rules.join(',') })
    );

    if (!response.ok) {
      throw new Error('Failed to validate assessment');
    }

    return response.json();
  },
};