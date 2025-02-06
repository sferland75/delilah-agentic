import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { assessmentSchema, type AssessmentFormData } from '@/lib/validation/assessment-schema';
import { z } from 'zod';

interface FormContextType {
  formData: AssessmentFormData;
  updateForm: (data: Partial<AssessmentFormData>) => void;
  lastSaved: Date | null;
  clearForm: () => void;
  isValid: boolean;
  validationErrors: z.ZodError | null;
  isSaving: boolean;
  exportForm: () => Promise<string>;
  progress: number;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

const STORAGE_KEY = 'assessment_draft';
const AUTO_SAVE_DELAY = 5000; // 5 seconds

// Initial empty form structure
const initialFormState: AssessmentFormData = {
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
    treatments: [],
    medications: [],
    imaging: []
  },
  functional: {
    tolerances: {},
    rangeOfMotion: {},
    manualMuscleTesting: {},
    overallNotes: '',
    recommendations: [],
    followUpNeeded: false,
    followUpNotes: ''
  },
  environmental: {
    propertyOverview: {
      propertyType: '',
      layoutDescription: '',
      access: {
        exterior: {
          description: ''
        },
        interior: {
          description: '',
          hasStairs: false,
          numberOfStairs: 0
        }
      },
      recommendedModifications: [],
      identifiedHazards: []
    },
    safety: {
      hazards: [],
      concerns: '',
      recommendations: ''
    }
  }
};

const loadSavedForm = (): AssessmentFormData => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      return { ...initialFormState, ...parsed };
    }
  } catch (error) {
    console.error('Error loading saved form:', error);
  }
  return initialFormState;
};

export function FormProvider({ children }: { children: React.ReactNode }) {
  const [formData, setFormData] = useState<AssessmentFormData>(() => loadSavedForm());
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<z.ZodError | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  // Calculate form completion progress
  const calculateProgress = useCallback((data: AssessmentFormData) => {
    const requiredFields = [
      data.initial.personal.firstName,
      data.initial.personal.lastName,
      data.initial.personal.dateOfBirth,
      data.medical.injury.circumstance,
      data.medical.injury.date,
      data.medical.injury.description,
      data.functional.overallNotes,
      data.environmental.propertyOverview.layoutDescription,
      data.environmental.safety.concerns
    ];

    const filledFields = requiredFields.filter(field => field && field.trim() !== '').length;
    return Math.round((filledFields / requiredFields.length) * 100);
  }, []);

  // Validate form data
  const validateForm = useCallback((data: AssessmentFormData) => {
    try {
      assessmentSchema.parse(data);
      setValidationErrors(null);
      setIsValid(true);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setValidationErrors(error);
        setIsValid(false);
      }
      return false;
    }
  }, []);

  // Save form data to storage
  const saveForm = useCallback(async (data: AssessmentFormData) => {
    try {
      setIsSaving(true);
      const isValidData = validateForm(data);
      
      if (!isValidData) {
        console.warn('Form data is invalid, but saving anyway');
      }

      const dataStr = JSON.stringify(data);
      localStorage.setItem(STORAGE_KEY, dataStr);
      
      const saveTime = new Date();
      setLastSaved(saveTime);
      
      // Update progress
      const newProgress = calculateProgress(data);
      setProgress(newProgress);

      return true;
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
  }, [validateForm, calculateProgress, toast]);

  // Update form data
  const updateForm = useCallback((newData: Partial<AssessmentFormData>) => {
    setFormData(prevData => {
      const updatedData = {
        ...prevData,
        ...newData
      };
      
      // Schedule auto-save
      const timeoutId = setTimeout(() => {
        saveForm(updatedData);
      }, AUTO_SAVE_DELAY);

      return updatedData;
    });
  }, [saveForm]);

  // Clear form data
  const clearForm = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setFormData(initialFormState);
      setLastSaved(null);
      setValidationErrors(null);
      setIsValid(false);
      setProgress(0);
      
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
  }, [toast]);

  // Export form data
  const exportForm = useCallback(async (): Promise<string> => {
    try {
      const isValidData = validateForm(formData);
      if (!isValidData) {
        throw new Error('Form data is invalid');
      }

      const exportData = {
        ...formData,
        metadata: {
          exportDate: new Date().toISOString(),
          version: '1.0.0',
          isValid: true
        }
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Error exporting form:', error);
      throw error;
    }
  }, [formData, validateForm]);

  // Initial validation on load
  useEffect(() => {
    validateForm(formData);
    const initialProgress = calculateProgress(formData);
    setProgress(initialProgress);
  }, []);

  const value = {
    formData,
    updateForm,
    lastSaved,
    clearForm,
    isValid,
    validationErrors,
    isSaving,
    exportForm,
    progress
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
}

export default FormContext;