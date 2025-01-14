const AUTOSAVE_KEY = 'delilah_autosave_draft';
const AUTOSAVE_TIMESTAMP_KEY = 'delilah_autosave_timestamp';

let saveTimeout: number | null = null;

export const saveFormDraft = (formData: any) => {
  try {
    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(formData));
    localStorage.setItem(AUTOSAVE_TIMESTAMP_KEY, new Date().toISOString());
  } catch (error) {
    console.error('Error saving draft:', error);
  }
};

export const loadFormDraft = () => {
  try {
    const savedData = localStorage.getItem(AUTOSAVE_KEY);
    const timestamp = localStorage.getItem(AUTOSAVE_TIMESTAMP_KEY);
    return savedData ? { data: JSON.parse(savedData), timestamp } : null;
  } catch (error) {
    console.error('Error loading draft:', error);
    return null;
  }
};

export const clearFormDraft = () => {
  localStorage.removeItem(AUTOSAVE_KEY);
  localStorage.removeItem(AUTOSAVE_TIMESTAMP_KEY);
};

// Custom debounce implementation for autosave
export const debouncedSave = (formData: any) => {
  if (saveTimeout) {
    window.clearTimeout(saveTimeout);
  }
  
  saveTimeout = window.setTimeout(() => {
    saveFormDraft(formData);
    saveTimeout = null;
  }, 5000);
};