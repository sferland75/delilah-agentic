export interface Score {
  raw_score: number;
  percentile: number;
}

export interface Scores {
  [key: string]: Score;
}

export interface Assessment {
  id: string;
  status: 'draft' | 'in_progress' | 'completed' | 'reviewed';
  assessment_type: string;
  patient_name: string;
  date: string;
  scores: Scores;
}

export interface Documentation {
  id: string;
  assessment_id: string;
  content: string;
}

export interface Analysis {
  id: string;
  assessment_id: string;
  findings: string;
}

export interface TestData {
  assessments: Assessment[];
  documentations: Documentation[];
  analyses: Analysis[];
}