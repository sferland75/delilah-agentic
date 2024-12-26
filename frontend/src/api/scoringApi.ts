export interface ScoreRange {
  min: number;
  max: number;
  label: string;
  description?: string;
}

export interface ScoringRule {
  fieldId: string;
  weight: number;
  scoringMethod: string;
  valueMap?: Record<string, number>;
  customLogic?: string;
}

export interface ScoringResult {
  totalScore: number;
  sectionScores: Record<string, number>;
  fieldScores: Record<string, number>;
  scoreLabel?: string;
  details?: Record<string, any>;
}

const API_BASE_URL = '/api';

export const scoringApi = {
  async scoreAssessment(assessmentId: string): Promise<ScoringResult> {
    const response = await fetch(`${API_BASE_URL}/scoring/assessment/${assessmentId}`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error('Failed to score assessment');
    }
    
    return response.json();
  },

  async getAssessmentScore(assessmentId: string): Promise<ScoringResult> {
    const response = await fetch(`${API_BASE_URL}/scoring/assessment/${assessmentId}/score`);
    
    if (!response.ok) {
      throw new Error('Failed to get assessment score');
    }
    
    return response.json();
  },

  async updateScoringRules(
    templateId: string,
    rules: {
      method: string;
      rules: ScoringRule[];
      ranges: ScoreRange[];
      customLogic?: string;
    }
  ): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/scoring/template/${templateId}/rules`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rules),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update scoring rules');
    }
  },
};