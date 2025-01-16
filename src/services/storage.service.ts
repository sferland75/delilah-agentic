const STORAGE_KEY = 'delilah_assessments_drafts';
const AUTO_SAVE_KEY = 'delilah_autosave';

export class StorageService {
  static saveDraft(assessmentId: string, data: any) {
    try {
      const drafts = this.getAllDrafts();
      drafts[assessmentId] = {
        data,
        lastModified: new Date().toISOString(),
        id: assessmentId
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
      return true;
    } catch (error) {
      console.error('Error saving draft:', error);
      return false;
    }
  }

  static getDraft(assessmentId: string) {
    try {
      const drafts = this.getAllDrafts();
      return drafts[assessmentId];
    } catch (error) {
      console.error('Error getting draft:', error);
      return null;
    }
  }

  static getAllDrafts() {
    try {
      const drafts = localStorage.getItem(STORAGE_KEY);
      return drafts ? JSON.parse(drafts) : {};
    } catch (error) {
      console.error('Error getting all drafts:', error);
      return {};
    }
  }

  static deleteDraft(assessmentId: string) {
    try {
      const drafts = this.getAllDrafts();
      delete drafts[assessmentId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
      return true;
    } catch (error) {
      console.error('Error deleting draft:', error);
      return false;
    }
  }

  static saveAutoSave(data: any) {
    try {
      const autoSave = {
        data,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(autoSave));
      return true;
    } catch (error) {
      console.error('Error saving auto-save:', error);
      return false;
    }
  }

  static getAutoSave() {
    try {
      const autoSave = localStorage.getItem(AUTO_SAVE_KEY);
      return autoSave ? JSON.parse(autoSave) : null;
    } catch (error) {
      console.error('Error getting auto-save:', error);
      return null;
    }
  }

  static clearAutoSave() {
    localStorage.removeItem(AUTO_SAVE_KEY);
  }

  // Export to file (for backup/portability)
  static exportDrafts() {
    const drafts = this.getAllDrafts();
    const blob = new Blob([JSON.stringify(drafts, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `assessment-drafts-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Import from file
  static async importDrafts(file: File) {
    try {
      const text = await file.text();
      const drafts = JSON.parse(text);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
      return true;
    } catch (error) {
      console.error('Error importing drafts:', error);
      return false;
    }
  }
}