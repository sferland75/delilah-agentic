import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useForm } from '../../context/FormContext';
import { useToast } from "@/components/ui/use-toast";

export const ClearFormButton: React.FC = () => {
  const { clearDraft } = useForm();
  const { toast } = useToast();

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all form data? This cannot be undone.')) {
      clearDraft();
      // Force a page reload to ensure all components re-render with empty state
      window.location.reload();
      toast({
        title: "Form Cleared",
        description: "All form data has been cleared successfully."
      });
    }
  };

  return (
    <Button
      onClick={handleClear}
      variant="destructive"
      className="flex items-center gap-2"
    >
      <Trash2 className="h-4 w-4" />
      Clear Form
    </Button>
  );
};