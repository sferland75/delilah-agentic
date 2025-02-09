import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { FormProvider as RHFFormProvider, useForm } from 'react-hook-form';
import { useToast } from "@/components/ui/use-toast";
import { assessmentSchema, type AssessmentFormData } from '@/lib/validation/assessment-schema';
import { z } from 'zod';
import { formPersistence } from '@/lib/persistence/form-persistence-manager';
import { validationManager, type ValidationResult } from '@/lib/validation/validation-manager';

// Define the context interface
interface FormContextType {
  lastSaved: Date | null;
  isSaving: boolean;
  validationStatus: ValidationResult | null;
  isValid: boolean;
  progress: number;
  hasBackup: boolean;
  isDirty: boolean;
  saveForm: (data: AssessmentFormData, section?: string) => Promise<boolean>;
  exportForm: () => Promise<string>;
  clearForm: () => void;
  loadBackup: () => void;
}

// Create the form context
const FormContext = createContext<FormContextType | undefined>(undefined);

// Create clean default values from schema
const defaultValues: AssessmentFormData = {
  initial: {
    personal: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      phone: '',
      email: '',
      streetAddress: '',
      city: '',
      postalCode: ''
    }
  },
  medical: {
    injury: {
      circumstance: '',
      date: '',
      description: '',
      notes: ''
    },
    symptoms: [],
    pain: {},
    treatments: [],
    medications: [],
    imaging: []
  },
  environmental: {
    rooms: [],
    description: '',
    hazards: '',
    notes: '',
    outdoor: {
      access: '',
      yard: ''
    }
  },
  functional: {}
};

// Calculate form completion progress
const calculateProgress = (data: AssessmentFormData): number => {
  try {
    // Get all required fields from the schema
    const requiredFields = Object.entries(assessmentSchema.shape)
      .filter(([_, field]) => field._def.required)
      .map(([key]) => key);

    // Count how many required fields are filled
    const filledFields = requiredFields.filter(field => {
      const value = data[field as keyof AssessmentFormData];
      return value !== undefined && value !== null && value !== '';
    });

    // Calculate percentage
    return Math.round((filledFields.length / requiredFields.length) * 100);
  } catch (error) {
    console.error('Error calculating progress:', error);
    return 0;
  }
};

export function FormProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  
  // State declarations
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [validationStatus, setValidationStatus] = useState<ValidationResult | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasBackup, setHasBackup] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Check for backup status
  const checkBackupStatus = useCallback(() => {
    const hasAvailableBackup = formPersistence.hasBackups();
    console.log('Backup status:', hasAvailableBackup);
    setHasBackup(hasAvailableBackup);
  }, []);

  // Initialize form with persisted data or defaults
  const initialFormData = useMemo(() => {
    try {
      const { data: savedData, backupAvailable } = formPersistence.loadFormDraft();
      setHasBackup(backupAvailable);
      console.log('Initial backup available:', backupAvailable);
      return savedData || defaultValues;
    } catch (error) {
      console.error('Error loading initial form data:', error);
      return defaultValues;
    }
  }, []);

  // Form methods initialization
  const methods = useForm<AssessmentFormData>({
    defaultValues: initialFormData,
    mode: 'onChange'
  });

  // Export form data
  const exportForm = useCallback(async (): Promise<string> => {
    try {
      const formData = methods.getValues();
      // Add any necessary data cleaning or formatting here
      return JSON.stringify(formData, null, 2);
    } catch (error) {
      console.error('Error exporting form:', error);
      throw new Error('Failed to export form data');
    }
  }, [methods]);

  // Save form data using the persistence manager
  const saveForm = useCallback(async (data: AssessmentFormData, section?: string) => {
    try {
      setIsSaving(true);
      const success = await formPersistence.saveFormDraft(data, section);
      if (success) {
        setLastSaved(new Date());
        setProgress(calculateProgress(data));
        setIsDirty(false);
        checkBackupStatus();
      } else {
        toast({
          variant: "warning",
          title: "Auto-save Pending",
          description: "Changes will be saved when back online.",
        });
      }
      return success;
    } catch (error) {
      console.error('Error saving form:', error);
      toast({
        variant: "destructive",
        title: "Save Error",
        description: "Unable to save your work. Please try again.",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [toast, checkBackupStatus]);

  // Clear form data
  const clearForm = useCallback(() => {
    try {
      // Create backup of current data before clearing
      const currentData = methods.getValues();
      if (Object.keys(currentData).length > 0) {
        formPersistence.saveBackup(currentData);
      }

      // Clear persistence
      formPersistence.clearFormDraft();
      
      // Reset form to default values
      methods.reset(defaultValues);
      
      // Reset all state
      setLastSaved(null);
      setValidationStatus(null);
      setIsValid(false);
      setProgress(0);
      setIsDirty(false);
      
      // Update backup status
      checkBackupStatus();
      
      toast({
        title: "Form Cleared",
        description: "Started new assessment"
      });
    } catch (error) {
      console.error('Error clearing form:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to clear the form. Please try again.",
      });
    }
  }, [methods, toast, checkBackupStatus]);

  // Load backup handler
  const loadBackup = useCallback(() => {
    try {
      const { data: backupData, validationStatus: backupValidation } = formPersistence.loadFormDraft();
      if (backupData) {
        methods.reset(backupData);
        setValidationStatus(backupValidation ?? null);
        setIsDirty(false);
        checkBackupStatus();
        toast({
          title: "Backup Restored",
          description: "Previous version of the form has been restored."
        });
      }
    } catch (error) {
      console.error('Error restoring backup:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to restore the backup. Please try again."
      });
    }
  }, [methods, toast, checkBackupStatus]);

  // Check backup status periodically
  useEffect(() => {
    const checkInterval = setInterval(checkBackupStatus, 5000);
    return () => clearInterval(checkInterval);
  }, [checkBackupStatus]);

  // Form context value
  const formContextValue = useMemo(() => ({
    lastSaved,
    isSaving,
    validationStatus,
    isValid,
    progress,
    hasBackup,
    isDirty,
    saveForm,
    exportForm,
    clearForm,
    loadBackup
  }), [
    lastSaved,
    isSaving,
    validationStatus,
    isValid,
    progress,
    hasBackup,
    isDirty,
    saveForm,
    exportForm,
    clearForm,
    loadBackup
  ]);

  return (
    <FormContext.Provider value={formContextValue}>
      <RHFFormProvider {...methods}>
        {children}
      </RHFFormProvider>
    </FormContext.Provider>
  );
}

export function useAssessmentForm() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useAssessmentForm must be used within FormProvider');
  }
  return context;
}