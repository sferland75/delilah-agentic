import { AssessmentFormData } from '@/lib/validation/assessment-schema';

const STORAGE_KEY = 'assessment_form_draft';
const VERSION = '1.0.0';

interface StoredData {
  version: string;
  timestamp: number;
  data: Partial<AssessmentFormData>;
}

export const saveFormDraft = (data: Partial<AssessmentFormData>) => {
  try {
    const storedData: StoredData = {
      version: VERSION,
      timestamp: Date.now(),
      data,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storedData));
  } catch (error) {
    console.error('Error saving form draft:', error);
  }
};

export const loadFormDraft = (): Partial<AssessmentFormData> | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;

    const storedData: StoredData = JSON.parse(saved);
    
    // Version check
    if (storedData.version !== VERSION) {
      console.warn('Form draft version mismatch, clearing old data');
      clearFormDraft();
      return null;
    }

    // Age check (30 days)
    const age = Date.now() - storedData.timestamp;
    if (age > 30 * 24 * 60 * 60 * 1000) {
      console.warn('Form draft expired, clearing old data');
      clearFormDraft();
      return null;
    }

    return storedData.data;
  } catch (error) {
    console.error('Error loading form draft:', error);
    return null;
  }
};

export const clearFormDraft = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing form draft:', error);
  }
};