import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { useToast } from '@/components/ui/use-toast';
import type { AssessmentFormData } from '@/lib/validation/assessment-schema';

const STORAGE_KEY = 'assessment_draft';

export const useAssessmentPersistence = () => {
  const { getValues, reset } = useFormContext<AssessmentFormData>();
  const { toast } = useToast();

  const saveAssessment = useCallback(async () => {
    try {
      const formData = getValues();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      
      toast({
        title: "Assessment Saved",
        description: "Your progress has been saved successfully.",
      });
      
      return true;
    } catch (error) {
      console.error('Error saving assessment:', error);
      toast({
        variant: "destructive",
        title: "Save Error",
        description: "Failed to save your progress. Please try again.",
      });
      return false;
    }
  }, [getValues, toast]);

  const loadAssessment = useCallback(async () => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        reset(parsedData);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error loading assessment:', error);
      toast({
        variant: "destructive",
        title: "Load Error",
        description: "Failed to load saved assessment. Please try again.",
      });
      return false;
    }
  }, [reset, toast]);

  const exportAssessment = useCallback(async () => {
    try {
      const formData = getValues();
      const exportData = {
        ...formData,
        metadata: {
          exportDate: new Date().toISOString(),
          version: '1.0.0'
        }
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `assessment_${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Assessment Exported",
        description: "Your assessment has been exported successfully.",
      });

      return true;
    } catch (error) {
      console.error('Error exporting assessment:', error);
      toast({
        variant: "destructive",
        title: "Export Error",
        description: "Failed to export assessment. Please try again.",
      });
      return false;
    }
  }, [getValues, toast]);

  const clearAssessment = useCallback(async () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      reset({});
      
      toast({
        title: "Assessment Cleared",
        description: "Started new assessment.",
      });
      
      return true;
    } catch (error) {
      console.error('Error clearing assessment:', error);
      toast({
        variant: "destructive",
        title: "Clear Error",
        description: "Failed to clear assessment. Please try again.",
      });
      return false;
    }
  }, [reset, toast]);

  return {
    saveAssessment,
    loadAssessment,
    exportAssessment,
    clearAssessment
  };
};

export default useAssessmentPersistence;