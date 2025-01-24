export interface BergScoring {
  score: number;
  criteria: string;
}

export interface BergItem {
  id: number;
  title: string;
  description: string;
  scoring: BergScoring[];
}

export interface BergFormData {
  [key: string]: {
    score: string;
    notes: string;
  };
}

export interface BergRiskCategory {
  risk: string;
  description: string;
}

export const BERG_SCORE_INTERPRETATIONS = {
  0: {
    range: '0-20',
    risk: 'High Fall Risk',
    description: 'Wheelchair bound',
    recommendations: [
      'Close supervision required',
      'Consider wheelchair mobility assessment',
      'Focus on seated balance and transfer training'
    ]
  },
  21: {
    range: '21-40',
    risk: 'Medium Fall Risk',
    description: 'Walking with assistance',
    recommendations: [
      'Gait training with appropriate assistive device',
      'Balance exercises with supervision',
      'Environmental modifications as needed'
    ]
  },
  41: {
    range: '41-56',
    risk: 'Low Fall Risk',
    description: 'Independent',
    recommendations: [
      'Continue balance maintenance exercises',
      'Progress to more challenging balance activities',
      'Regular reassessment recommended'
    ]
  }
};

export const MINIMAL_DETECTABLE_CHANGE = {
  HIGH_FUNCTION: 4,  // For scores 45-56
  MEDIUM_FUNCTION: 5,  // For scores 35-44
  LOW_FUNCTION: 7  // For scores 0-34
};

export const getMinimalDetectableChange = (score: number): number => {
  if (score >= 45) return MINIMAL_DETECTABLE_CHANGE.HIGH_FUNCTION;
  if (score >= 35) return MINIMAL_DETECTABLE_CHANGE.MEDIUM_FUNCTION;
  return MINIMAL_DETECTABLE_CHANGE.LOW_FUNCTION;
};
