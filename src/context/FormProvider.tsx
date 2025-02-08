import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { FormProvider as RHFFormProvider, useForm } from 'react-hook-form';
import { useToast } from "@/components/ui/use-toast";
import { assessmentSchema, type AssessmentFormData } from '@/lib/validation/assessment-schema';
import { z } from 'zod';
import { formPersistence } from '@/lib/persistence/form-persistence-manager';
import { validationManager, type ValidationResult } from '@/lib/validation/validation-manager';

interface FormContextType {
  formData: AssessmentFormData;
  updateForm: (data: Partial<AssessmentFormData>, section?: string) => void;
  lastSaved: Date | null;
  clearForm: () => void;
  isValid: boolean;
  validationStatus: ValidationResult | null;
  isSaving: boolean;
  exportForm: () => Promise<string>;
  progress: number;
  hasBackup: boolean;
  loadBackup: () => void;
  isDirty: boolean;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

const defaultValues: AssessmentFormData = {
  initial: {
    personal: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      phone: '',
      email: ''
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
  functional: {},
  environmental: {
    rooms: [],
    description: '',
    hazards: '',
    notes: '',
    outdoor: {
      access: '',
      yard: ''
    }
  }
};

export function FormProvider({ children }: { children: React.ReactNode }) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [validationStatus, setValidationStatus] = useState<ValidationResult | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasBackup, setHasBackup] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const { toast } = useToast();

  // Initialize form with persisted data or defaults
  const initialFormData = useMemo(() => {
    try {
      const { data: savedData, backupAvailable } = formPersistence.loadFormDraft();
      setHasBackup(backupAvailable);
      return savedData || defaultValues;
    } catch (error) {
      console.error('Error loading initial form data:', error);
      return defaultValues;
    }
  }, []);

  const methods = useForm<AssessmentFormData>({
    defaultValues: initialFormData,
    mode: 'onChange'
  });

  // Calculate form completion progress
  const calculateProgress = useCallback((data: AssessmentFormData) => {
    const requiredFields = [
      data.initial?.personal?.firstName,
      data.initial?.personal?.lastName,
      data.initial?.personal?.dateOfBirth,
      data.medical?.injury?.circumstance,
      data.medical?.injury?.date,
      data.medical?.injury?.description
    ];

    const filledFields = requiredFields.filter(field => field && field.trim() !== '').length;
    return Math.round((filledFields / requiredFields.length) * 100);
  }, []);

  // Save form data using the persistence manager
  const saveForm = useCallback(async (data: AssessmentFormData, section?: string) => {
    try {
      setIsSaving(true);
      const success = await formPersistence.saveFormDraft(data, section);
      if (success) {
        setLastSaved(new Date());
        setProgress(calculateProgress(data));
        setIsDirty(false);
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
  }, [calculateProgress, toast]);

  // Subscribe to form changes with debounced auto-save
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const subscription = methods.watch((value) => {
      if (value) {
        setIsDirty(true);
        formPersistence.markPendingChanges();
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          saveForm(value as AssessmentFormData);
        }, 1000);
      }
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [methods.watch, saveForm]);

  // Load backup handler
  const loadBackup = useCallback(() => {
    const { data: backupData, validationStatus: backupValidation } = formPersistence.loadFormDraft();
    if (backupData) {
      methods.reset(backupData);
      setValidationStatus(backupValidation ?? null);
      setIsDirty(false);
      toast({
        title: "Backup Restored",
        description: "Previous version of the form has been restored."
      });
    }
  }, [methods, toast]);

  // Clear form data
  const clearForm = useCallback(() => {
    try {
      formPersistence.clearFormDraft();
      methods.reset(defaultValues);
      setLastSaved(null);
      setValidationStatus(null);
      setIsValid(false);
      setProgress(0);
      setHasBackup(false);
      setIsDirty(false);
      
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
  }, [methods, toast]);

  // Export form data
  const exportForm = useCallback(async (): Promise<string> => {
    try {
      const formData = methods.getValues();
      const validationResult = validationManager.validateFullAssessment(formData);
      if (!validationResult.isValid) {
        throw new Error('Form data is invalid');
      }

      const exportData = {
        ...formData,
        metadata: {
          exportDate: new Date().toISOString(),
          version: '1.0.0',
          isValid: true,
          validationStatus: validationResult
        }
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Error exporting form:', error);
      throw error;
    }
  }, [methods]);

  const formContextValue = useMemo(() => ({
    formData: methods.getValues(),
    updateForm: methods.setValue,
    lastSaved,
    clearForm,
    isValid,
    validationStatus,
    isSaving,
    exportForm,
    progress,
    hasBackup,
    loadBackup,
    isDirty
  }), [
    methods,
    lastSaved,
    clearForm,
    isValid,
    validationStatus,
    isSaving,
    exportForm,
    progress,
    hasBackup,
    loadBackup,
    isDirty
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