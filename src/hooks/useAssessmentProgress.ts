import { useCallback, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import type { AssessmentFormData } from '@/lib/validation/assessment-schema';

export const useAssessmentProgress = () => {
  const { formState: { dirtyFields }, getValues } = useFormContext<AssessmentFormData>();

  const getRequiredFields = useCallback((section: keyof AssessmentFormData) => {
    const formData = getValues();
    switch (section) {
      case 'initial':
        return [
          formData.initial?.personal?.firstName,
          formData.initial?.personal?.lastName,
          formData.initial?.personal?.dateOfBirth
        ];
      case 'medical':
        return [
          formData.medical?.injury?.circumstance,
          formData.medical?.injury?.date,
          formData.medical?.injury?.description
        ];
      case 'functional':
        return [
          formData.functional?.overallNotes,
          Object.keys(formData.functional?.tolerances || {}).length > 0,
          Object.keys(formData.functional?.rangeOfMotion || {}).length > 0
        ];
      case 'environmental':
        return [
          formData.environmental?.propertyOverview?.layoutDescription,
          formData.environmental?.safety?.concerns,
          formData.environmental?.safety?.recommendations
        ];
      case 'adl':
        return [
          Object.keys(formData.adl?.basicADL || {}).length > 0,
          Object.keys(formData.adl?.instrumentalADL || {}).length > 0
        ];
      default:
        return [];
    }
  }, [getValues]);

  const getSectionProgress = useCallback((section: keyof AssessmentFormData) => {
    const requiredFields = getRequiredFields(section);
    const completedFields = requiredFields.filter(Boolean).length;
    return requiredFields.length ? Math.round((completedFields / requiredFields.length) * 100) : 0;
  }, [getRequiredFields]);

  const totalProgress = useMemo(() => {
    const sections: (keyof AssessmentFormData)[] = ['initial', 'medical', 'functional', 'environmental', 'adl'];
    const sectionProgress = sections.map(getSectionProgress);
    const totalProgress = sectionProgress.reduce((acc, curr) => acc + curr, 0);
    return Math.round(totalProgress / sections.length);
  }, [getSectionProgress]);

  const getDirtyFieldCount = useCallback((section: keyof AssessmentFormData) => {
    return Object.keys(dirtyFields[section] || {}).length;
  }, [dirtyFields]);

  return {
    getSectionProgress,
    totalProgress,
    getDirtyFieldCount
  };
};

export default useAssessmentProgress;