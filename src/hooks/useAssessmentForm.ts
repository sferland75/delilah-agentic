import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type AssessmentForm, AssessmentSchema } from '@/types/form';

const DEFAULT_VALUES: AssessmentForm = {
  id: crypto.randomUUID(),
  medicalHistory: {
    preAccidentHistory: '',
    mechanismOfInjury: '',
    natureOfInjury: '',
    currentTreatments: [],
    medications: []
  },
  rangeOfMotion: [],
  environmental: {
    spaces: []
  }
};

export function useAssessmentForm(defaultValues: Partial<AssessmentForm> = {}) {
  return useForm<AssessmentForm>({
    resolver: zodResolver(AssessmentSchema),
    defaultValues: {
      ...DEFAULT_VALUES,
      ...defaultValues
    }
  });
}