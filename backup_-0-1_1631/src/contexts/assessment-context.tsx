import { createContext, useContext, ReactNode, useState } from 'react';
import type { Assessment } from '@/types/assessment-schema';

interface AssessmentContextValue {
  currentAssessment: Assessment | null;
  setCurrentAssessment: (assessment: Assessment | null) => void;
  isLoading: boolean;
}

const AssessmentContext = createContext<AssessmentContextValue | null>(null);

interface AssessmentProviderProps {
  children: ReactNode;
  initialAssessment?: Assessment | null;
}

export function AssessmentProvider({ 
  children, 
  initialAssessment = null
}: AssessmentProviderProps) {
  const [currentAssessment, setCurrentAssessment] = useState<Assessment | null>(initialAssessment);
  const [isLoading, setIsLoading] = useState(false);

  const value: AssessmentContextValue = {
    currentAssessment,
    setCurrentAssessment,
    isLoading
  };

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within AssessmentProvider');
  }
  return context;
}