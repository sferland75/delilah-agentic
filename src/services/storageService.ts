import { AssessmentSchema } from '@/types/assessment-schema';
import type { Assessment } from '@/types/assessment-schema';

const STORAGE_KEY = 'assessment_form_data';

class StorageService {
  async save(data: Assessment): Promise<void> {
    try {
      // Validate before saving
      AssessmentSchema.parse(data);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save assessment data:', error);
      throw new Error('Failed to save assessment data');
    }
  }

  async load(): Promise<Assessment | null> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;

      const data = JSON.parse(stored);
      // Validate loaded data
      return AssessmentSchema.parse(data);
    } catch (error) {
      console.error('Failed to load assessment data:', error);
      return null;
    }
  }

  async clear(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export const storageService = new StorageService();