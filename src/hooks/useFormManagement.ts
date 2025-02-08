import { useState, useEffect, useCallback } from 'react';
import { AssessmentFormData } from '../lib/validation/assessment-schema';
import { ValidationResult } from '../lib/validation/validation-manager';
import { formPersistence } from '../lib/persistence/form-persistence-manager';

interface UseFormManagementProps {
  initialData?: Partial<AssessmentFormData>;
  autoSave?: boolean;
  validateOnSave?: boolean;
}

interface FormManagementResult {
  data: Partial<AssessmentFormData>;
  setData: (data: Partial<AssessmentFormData>, section?: string) => Promise<void>;
  validationStatus: ValidationResult | undefined;
  isDirty: boolean;
  isLoading: boolean;
  error: Error | null;
  hasBackup: boolean;
  loadBackup: () => void;
  clearForm: () => void;
}

export const useFormManagement = ({
  initialData,
  autoSave = true,
  validateOnSave = true,
}: UseFormManagementProps = {}): FormManagementResult => {
  const [data, setDataState] = useState<Partial<AssessmentFormData>>(initialData ?? {});
  const [validationStatus, setValidationStatus] = useState<ValidationResult>();
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasBackup, setHasBackup] = useState(false);

  // Configure persistence manager
  useEffect(() => {
    formPersistence.configure({
      autoSave,
      validateOnSave,
      keepBackups: true,
    });
  }, [autoSave, validateOnSave]);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: savedData, backupAvailable, validationStatus: savedValidation } = formPersistence.loadFormDraft();
        
        if (savedData) {
          setDataState(savedData);
          setValidationStatus(savedValidation);
        } else if (initialData) {
          setDataState(initialData);
        }
        
        setHasBackup(backupAvailable);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load form data'));
        setIsLoading(false);
      }
    };

    loadData();
  }, [initialData]);

  const setData = useCallback(async (
    newData: Partial<AssessmentFormData>,
    section?: string
  ) => {
    try {
      setDataState(newData);
      setIsDirty(true);
      formPersistence.markPendingChanges();

      const success = await formPersistence.saveFormDraft(newData, section);
      if (!success) {
        console.warn('Form save queued for offline sync');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to save form data'));
    }
  }, []);

  const loadBackup = useCallback(() => {
    const { data: backupData, validationStatus: backupValidation } = formPersistence.loadFormDraft();
    if (backupData) {
      setDataState(backupData);
      setValidationStatus(backupValidation);
      setIsDirty(false);
    }
  }, []);

  const clearForm = useCallback(() => {
    formPersistence.clearFormDraft();
    setDataState({});
    setValidationStatus(undefined);
    setIsDirty(false);
    setHasBackup(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isDirty) {
        formPersistence.saveFormDraft(data);
      }
    };
  }, [data, isDirty]);

  return {
    data,
    setData,
    validationStatus,
    isDirty,
    isLoading,
    error,
    hasBackup,
    loadBackup,
    clearForm,
  };
};