import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type AssessmentForm, assessmentSchema } from '@/lib/validation/assessment-schema';

const defaultValues: Partial<AssessmentForm> = {
  environmental: {
    rooms: [],
    exterior: [],
    propertyOverview: {
      recommendedModifications: [],
      identifiedHazards: []
    },
    safety: {
      hazards: [],
      recommendations: []
    }
  },
  medical: {
    injury: {
      date: '',
      circumstance: '',
      description: ''
    },
    symptoms: [],
    treatments: []
  },
  functional: {
    adl: [],
    iadl: [],
    mobility: [],
    restrictions: []
  }
};

export function useAssessmentForm() {
  return useForm<AssessmentForm>({
    resolver: zodResolver(assessmentSchema),
    mode: 'onChange',
    defaultValues
  });
}