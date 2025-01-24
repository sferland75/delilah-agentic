import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, Download } from 'lucide-react';
import { useForm } from '../context/FormContext';
import { validateAssessmentData } from '../utils/validation';
import { useToast } from "@/components/ui/use-toast";
import { ClearFormButton } from './ui/ClearFormButton';

export const SaveControls: React.FC = () => {
  const { formData } = useForm();
  const { toast } = useToast();

  const validateAndSave = (data: any, exportType: 'current' | 'final'): boolean => {
    const validation = validateAssessmentData(data);
    if (!validation.valid) {
      toast({
        variant: "destructive",
        title: "Cannot Save Assessment",
        description: "Required data is missing: " + validation.errors.join(', ')
      });
      return false;
    }
    return true;
  };

  const saveLocal = () => {
    try {
      if (!validateAndSave(formData, 'current')) return;

      const timestamp = new Date().toISOString().split('T')[0];
      const dataStr = JSON.stringify(formData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `delilah_assessment_${timestamp}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Assessment Saved",
        description: "Your work has been saved successfully."
      });
    } catch (error) {
      console.error('Error saving file:', error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "There was an error saving your work. Please try again."
      });
    }
  };

  const exportFinalJSON = () => {
    try {
      const finalData = {
        ...formData,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };

      if (!validateAndSave(finalData, 'final')) return;
      
      const dataStr = JSON.stringify(finalData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `delilah_final_assessment.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Final Assessment Exported",
        description: "Your assessment has been exported successfully."
      });
    } catch (error) {
      console.error('Error exporting JSON:', error);
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "There was an error exporting your assessment. Please try again."
      });
    }
  };

  return (
    <div className="fixed top-4 right-4 flex gap-2 z-50">
      <ClearFormButton />
      
      <Button
        onClick={saveLocal}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
      >
        <Save className="h-4 w-4" />
        Save Current Work
      </Button>
      
      <Button
        onClick={exportFinalJSON}
        variant="outline"
        className="flex items-center gap-2 border-green-600 text-green-600 hover:bg-green-50"
      >
        <Download className="h-4 w-4" />
        Export Final JSON
      </Button>
    </div>
  );
};