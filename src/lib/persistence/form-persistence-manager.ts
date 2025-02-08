import { AssessmentFormData } from '../validation/assessment-schema';
import { ValidationResult } from '../validation/validation-manager';

const STORAGE_KEY = 'assessment_form_draft';
const VERSION = '1.0.0';
const AUTO_SAVE_INTERVAL = 5000; // 5 seconds
const MAX_BACKUP_VERSIONS = 3;

interface StoredData {
  version: string;
  timestamp: number;
  data: Partial<AssessmentFormData>;
  lastModifiedSection?: string;
  validationStatus?: ValidationResult;
}

interface PersistenceOptions {
  autoSave?: boolean;
  keepBackups?: boolean;
  validateOnSave?: boolean;
}

export class FormPersistenceManager {
  private static instance: FormPersistenceManager;
  private autoSaveTimer: NodeJS.Timeout | null = null;
  private pendingChanges: boolean = false;
  private offlineQueue: Array<{
    data: Partial<AssessmentFormData>;
    section?: string;
    timestamp: number;
  }> = [];
  private options: PersistenceOptions = {
    autoSave: true,
    keepBackups: true,
    validateOnSave: true
  };

  private constructor() {
    this.setupAutoSave();
    this.setupOfflineSupport();
  }

  static getInstance(): FormPersistenceManager {
    if (!FormPersistenceManager.instance) {
      FormPersistenceManager.instance = new FormPersistenceManager();
    }
    return FormPersistenceManager.instance;
  }

  configure(options: Partial<PersistenceOptions>) {
    this.options = { ...this.options, ...options };
    if (!this.options.autoSave && this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    } else if (this.options.autoSave && !this.autoSaveTimer) {
      this.setupAutoSave();
    }
  }

  async saveFormDraft(
    data: Partial<AssessmentFormData>,
    section?: string
  ): Promise<boolean> {
    try {
      const storedData: StoredData = {
        version: VERSION,
        timestamp: Date.now(),
        data,
        lastModifiedSection: section
      };

      // Save backup if enabled
      if (this.options.keepBackups) {
        const currentData = localStorage.getItem(STORAGE_KEY);
        if (currentData) {
          const backupKey = `${STORAGE_KEY}_backup_${Date.now()}`;
          localStorage.setItem(backupKey, currentData);
          this.cleanupOldBackups();
        }
      }

      // Save new version
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storedData));
      this.pendingChanges = false;

      // Attempt to sync if online
      if (navigator.onLine) {
        await this.syncOfflineChanges();
      }

      return true;
    } catch (error) {
      console.error('Error saving form draft:', error);
      this.offlineQueue.push({ data, section, timestamp: Date.now() });
      return false;
    }
  }

  loadFormDraft(): {
    data: Partial<AssessmentFormData> | null;
    backupAvailable: boolean;
    validationStatus?: ValidationResult;
  } {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        return { data: null, backupAvailable: false };
      }

      const storedData: StoredData = JSON.parse(saved);

      // Version check
      if (storedData.version !== VERSION) {
        console.warn('Form draft version mismatch');
        const backup = this.loadLatestBackup();
        return {
          data: backup?.data ?? null,
          backupAvailable: backup !== null,
          validationStatus: backup?.validationStatus
        };
      }

      // Age check (30 days)
      const age = Date.now() - storedData.timestamp;
      if (age > 30 * 24 * 60 * 60 * 1000) {
        console.warn('Form draft expired');
        return { data: null, backupAvailable: false };
      }

      return {
        data: storedData.data,
        backupAvailable: this.hasBackups(),
        validationStatus: storedData.validationStatus
      };
    } catch (error) {
      console.error('Error loading form draft:', error);
      const backup = this.loadLatestBackup();
      return {
        data: backup?.data ?? null,
        backupAvailable: backup !== null,
        validationStatus: backup?.validationStatus
      };
    }
  }

  markPendingChanges() {
    this.pendingChanges = true;
  }

  hasPendingChanges(): boolean {
    return this.pendingChanges;
  }

  clearFormDraft() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      if (this.options.keepBackups) {
        this.cleanupAllBackups();
      }
    } catch (error) {
      console.error('Error clearing form draft:', error);
    }
  }

  private setupAutoSave() {
    if (this.options.autoSave && !this.autoSaveTimer) {
      this.autoSaveTimer = setInterval(() => {
        if (this.pendingChanges) {
          const currentData = localStorage.getItem(STORAGE_KEY);
          if (currentData) {
            const storedData: StoredData = JSON.parse(currentData);
            this.saveFormDraft(storedData.data, storedData.lastModifiedSection);
          }
        }
      }, AUTO_SAVE_INTERVAL);
    }
  }

  private setupOfflineSupport() {
    window.addEventListener('online', async () => {
      await this.syncOfflineChanges();
    });
  }

  private async syncOfflineChanges() {
    while (this.offlineQueue.length > 0) {
      const { data, section, timestamp } = this.offlineQueue[0];
      try {
        await this.saveFormDraft(data, section);
        this.offlineQueue.shift();
      } catch (error) {
        console.error('Error syncing offline changes:', error);
        break;
      }
    }
  }

  private cleanupOldBackups() {
    const allKeys = Object.keys(localStorage);
    const backupKeys = allKeys
      .filter(key => key.startsWith(`${STORAGE_KEY}_backup_`))
      .sort()
      .reverse();

    if (backupKeys.length > MAX_BACKUP_VERSIONS) {
      backupKeys
        .slice(MAX_BACKUP_VERSIONS)
        .forEach(key => localStorage.removeItem(key));
    }
  }

  private cleanupAllBackups() {
    const allKeys = Object.keys(localStorage);
    allKeys
      .filter(key => key.startsWith(`${STORAGE_KEY}_backup_`))
      .forEach(key => localStorage.removeItem(key));
  }

  private loadLatestBackup(): StoredData | null {
    const allKeys = Object.keys(localStorage);
    const latestBackup = allKeys
      .filter(key => key.startsWith(`${STORAGE_KEY}_backup_`))
      .sort()
      .reverse()[0];

    if (latestBackup) {
      try {
        const backupData = localStorage.getItem(latestBackup);
        if (backupData) {
          return JSON.parse(backupData);
        }
      } catch (error) {
        console.error('Error loading backup:', error);
      }
    }
    return null;
  }

  private hasBackups(): boolean {
    return Object.keys(localStorage).some(key => 
      key.startsWith(`${STORAGE_KEY}_backup_`)
    );
  }

  destroy() {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
  }
}

// Export a singleton instance
export const formPersistence = FormPersistenceManager.getInstance();