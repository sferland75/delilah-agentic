import { Assessment } from '../types/assessment';
import { config } from '../config';

export const fetchAssessments = async (): Promise<Assessment[]> => {
  const response = await fetch(`${config.apiBaseUrl}/api/assessments`, {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log('Raw API response:', JSON.stringify(data, null, 2));

  if (!Array.isArray(data)) {
    throw new Error('API response is not an array');
  }

  return data.map(item => {
    if (!item || typeof item !== 'object') {
      throw new Error('Invalid assessment data');
    }

    return {
      id: String(item.id || ''),
      status: item.status as Assessment['status'],
      assessment_type: String(item.assessment_type || ''),
      patient_info: item.patient_info,
      created_at: String(item.created_at || new Date().toISOString()),
      updated_at: String(item.updated_at || new Date().toISOString())
    };
  });
};