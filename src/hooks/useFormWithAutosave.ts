import { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useToast } from '@/components/ui/use-toast';
import type { AssessmentFormData } from '@/lib/validation/assessment-schema';

const AUTO_SAVE_DELAY = 5000; // 5 seconds

export const useFormWithAutosave = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const { getValues, formState: { isDirty } } = useFormContext<AssessmentFormData>();
  const { toast } = useToast();

  const saveToStorage = async (data: AssessmentFormData) => {
    try {
      setIsSaving(true);
      const jsonData = JSON.stringify(data);
      localStorage.setItem('assessment_draft', jsonData);
      setLastSaved(new Date());
      
      toast({
        title: "Progress Saved",
        description: "Your assessment has been auto-saved.",
        duration: 2000
      });
    } catch (error) {
      console.error('Auto-save error:', error);
      toast({
        variant: "destructive",
        title: "Auto-save Failed",
        description: "Unable to auto-save your progress. Please save manually.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (isDirty) {
      // Clear any existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Set new timeout for auto-save
      saveTimeoutRef.current = setTimeout(() => {
        const formData = getValues();
        saveToStorage(formData);
      }, AUTO_SAVE_DELAY);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [isDirty, getValues]);

  return {
    isSaving,
    lastSaved,
    saveToStorage
  };
};

export default useFormWithAutosave;