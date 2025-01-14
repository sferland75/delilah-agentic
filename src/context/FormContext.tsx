import React, { createContext, useContext, useState, useEffect } from 'react';
import { Assessment } from '../lib/validation/assessment-schema';

type FormContextType = {
  formData: Assessment;
  updateFormData: (data: Partial<Assessment>) => void;
  lastSaved: string | null;
  clearDraft: () => void;
  setFormData: React.Dispatch<React.SetStateAction<Assessment>>;
};

const FormContext = createContext<FormContextType | undefined>(undefined);

const loadFormDraft = () => {
  try {
    console.log('Loading form draft from localStorage');
    const savedData = localStorage.getItem('form_draft');
    if (savedData) {
      const data = JSON.parse(savedData);
      console.log('Found data in localStorage:', data);
      return data;
    }
  } catch (error) {
    console.error('Error loading draft:', error);
  }
  return null;
};

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<Assessment>(() => {
    const saved = loadFormDraft();
    console.log('Initial form data:', saved);
    return saved || {};
  });
  
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  useEffect(() => {
    const savedDraft = loadFormDraft();
    if (savedDraft) {
      console.log('Setting initial form data from storage');
      setFormData(savedDraft);
      setLastSaved(new Date().toISOString());
    }
  }, []);

  const updateFormData = (data: Partial<Assessment>) => {
    console.log('Updating form data with:', data);
    setFormData(prev => {
      const newData = { ...prev, ...data };
      console.log('New form data:', newData);
      
      // Save to localStorage
      try {
        localStorage.setItem('form_draft', JSON.stringify(newData));
        setLastSaved(new Date().toISOString());
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
      
      return newData;
    });
  };

  const clearDraft = () => {
    console.log('Clearing form draft');
    localStorage.removeItem('form_draft');
    setFormData({});
    setLastSaved(null);
  };

  const value = {
    formData,
    updateFormData,
    lastSaved,
    clearDraft,
    setFormData
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
};