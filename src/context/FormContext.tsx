import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";

interface FormContextType {
  formData: any;
  updateFormData: (data: any) => void;
  lastSaved: string | null;
  clearDraft: () => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const FormContext = createContext<FormContextType | null>(null);

const STORAGE_KEY = 'form_draft';

const loadFormDraft = () => {
  try {
    console.log('Loading form draft from localStorage');
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      console.log('Found data in primary storage:', parsed);
      return parsed;
    }
  } catch (error) {
    console.error('Error loading draft:', error);
  }
  return {
    personal: {},
    medical: {},
    environmental: {},
    typicalDay: {},
    functionalAssessment: {
      capacities: [],
      overallNotes: '',
      recommendedAccommodations: [],
      followUpNeeded: false,
      followUpNotes: '',
      rangeOfMotion: {
        assessments: {},
        generalNotes: ''
      },
      manualMuscleTesting: {
        assessments: {},
        generalNotes: ''
      }
    }
  };
};

export function FormProvider({ children }: { children: React.ReactNode }) {
  const [formData, setFormData] = useState<any>(() => {
    const saved = loadFormDraft();
    console.log('Initial form data:', saved);
    return saved;
  });
  
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const { toast } = useToast();
  
  const saveToStorage = useCallback((data: any) => {
    try {
      console.log('Saving form data to storage:', data);
      const dataStr = JSON.stringify(data);
      localStorage.setItem(STORAGE_KEY, dataStr);
      const saveTime = new Date().toISOString();
      setLastSaved(saveTime);
      return true;
    } catch (error) {
      console.error('Error saving to storage:', error);
      toast({
        variant: "destructive",
        title: "Auto-save Failed",
        description: "Unable to save your work. Please manually save your progress.",
      });
      return false;
    }
  }, [toast]);

  const updateFormData = useCallback((newData: any) => {
    console.log('==================== UPDATE FORM DATA ====================');
    console.log('Current form data:', formData);
    console.log('New data received:', newData);
    
    setFormData(prevData => {
      const updatedData = {
        ...prevData,
        ...newData,
        functionalAssessment: {
          ...prevData.functionalAssessment,
          ...newData.functionalAssessment,
          capacities: [
            ...(prevData.functionalAssessment?.capacities || []),
            ...(newData.functionalAssessment?.capacities || [])
          ].filter((cap, index, self) => 
            index === self.findIndex(t => t.activity === cap.activity)
          )
        },
        environmental: {
          ...prevData.environmental,
          ...newData.environmental,
          propertyOverview: {
            ...prevData.environmental?.propertyOverview,
            ...newData.environmental?.propertyOverview,
            rooms: {
              ...prevData.environmental?.propertyOverview?.rooms,
              ...newData.environmental?.propertyOverview?.rooms
            }
          }
        }
      };

      console.log('Updated data:', updatedData);
      saveToStorage(updatedData);
      return updatedData;
    });
  }, [formData, saveToStorage]);

  const clearDraft = useCallback(() => {
    try {
      console.log('Clearing form draft');
      const emptyData = {
        personal: {},
        medical: {},
        environmental: {
          propertyOverview: {
            type: '',
            levels: '',
            exteriorAccess: '',
            interiorAccess: '',
            rooms: {},
            generalNotes: ''
          },
          safety: {
            hazards: [],
            concerns: '',
            recommendations: ''
          }
        },
        typicalDay: {},
        functionalAssessment: {
          capacities: [],
          overallNotes: '',
          recommendedAccommodations: [],
          followUpNeeded: false,
          followUpNotes: '',
          rangeOfMotion: {
            assessments: {},
            generalNotes: ''
          },
          manualMuscleTesting: {
            assessments: {},
            generalNotes: ''
          }
        }
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(emptyData));
      setFormData(emptyData);
      setLastSaved(null);
      
      toast({
        title: "Form Cleared",
        description: "Started new assessment"
      });
    } catch (error) {
      console.error('Error clearing draft:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to clear the form. Please try again.",
      });
    }
  }, [toast]);

  useEffect(() => {
    console.log('Form data updated in context:', formData);
  }, [formData]);

  const value = {
    formData,
    updateFormData,
    lastSaved,
    clearDraft,
    setFormData
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
}

export const useForm = useFormContext;