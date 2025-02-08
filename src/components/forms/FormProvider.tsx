import React, { createContext, useContext } from 'react';
import { useForm, FormProvider as RHFProvider } from 'react-hook-form';
import { useFormManagement } from '@/hooks/useFormManagement';
import { AssessmentFormData } from '@/lib/validation/assessment-schema';
import { ValidationResult } from '@/lib/validation/validation-manager';

interface FormContextProps {
  validationStatus: ValidationResult | undefined;
  isDirty: boolean;
  hasBackup: boolean;
  loadBackup: () => void;
  clearForm: () => void;
}

const FormContext = createContext<FormContextProps | undefined>(undefined);

export const useAssessmentForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useAssessmentForm must be used within FormProvider');
  }
  return context;
};

interface FormProviderProps {
  children: React.ReactNode;
  initialData?: Partial<AssessmentFormData>;
}

export const FormProvider: React.FC<FormProviderProps> = ({ children, initialData }) => {
  const {
    data,
    setData,
    validationStatus,
    isDirty,
    isLoading,
    error,
    hasBackup,
    loadBackup,
    clearForm,
  } = useFormManagement({
    initialData,
    autoSave: true,
    validateOnSave: true,
  });

  const methods = useForm<AssessmentFormData>({
    defaultValues: data,
  });

  // Sync form data with persistence
  const onSubmit = async (formData: AssessmentFormData) => {
    await setData(formData);
  };

  if (isLoading) {
    return <div>Loading form data...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading form: {error.message}
      </div>
    );
  }

  const contextValue: FormContextProps = {
    validationStatus,
    isDirty,
    hasBackup,
    loadBackup,
    clearForm,
  };

  return (
    <FormContext.Provider value={contextValue}>
      <RHFProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          {children}
        </form>
      </RHFProvider>
    </FormContext.Provider>
  );
};