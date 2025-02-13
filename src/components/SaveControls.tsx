import React from 'react';
<<<<<<< HEAD
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FileDown, RotateCcw, RotateCw } from 'lucide-react';
import { useAssessmentForm } from '@/context/FormProvider';
import { toast } from '@/components/ui/use-toast';

export function SaveControls() {
  const { clearForm, exportForm, formData, validationStatus, hasBackup, loadBackup } = useAssessmentForm();
  const [showAlert, setShowAlert] = React.useState(false);

  const handleRestore = React.useCallback(() => {
    try {
      loadBackup();
      toast({
        title: "Backup Restored",
        description: "Previous form data has been restored."
      });
    } catch (error) {
      console.error('Error restoring backup:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to restore the backup. Please try again."
      });
    }
  }, [loadBackup]);

  const handleClear = React.useCallback(() => {
    try {
      clearForm();
      toast({
        title: "Form Cleared",
        description: "All form data has been cleared."
      });
      setShowAlert(false);
    } catch (error) {
      console.error('Error clearing form:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to clear the form. Please try again."
      });
    }
  }, [clearForm]);

  const handleExport = async () => {
    try {
      // Validate before export
      if (validationStatus && !validationStatus.isValid) {
        const errorCount = Object.values(validationStatus.errors).flat().length;
        const warningCount = Object.values(validationStatus.warnings).flat().length;
        
        let message = '';
        if (errorCount > 0) {
          message += `${errorCount} validation error${errorCount > 1 ? 's' : ''} `;
        }
        if (warningCount > 0) {
          message += `${warningCount} warning${warningCount > 1 ? 's' : ''}`;
        }

        toast({
          variant: "warning",
          title: "Form Validation Issues",
          description: `Please fix ${message} before exporting.`
        });
        return;
      }

      const jsonStr = await exportForm();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `assessment_${new Date().toISOString().split('T')[0]}.json`;
=======
import { Button } from '@/components/ui/button';
import { Save, Download } from 'lucide-react';
import { useForm } from '../context/FormContext';
import { validateAssessmentData } from '../utils/validation';
import { useToast } from "@/components/ui/use-toast";

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
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
<<<<<<< HEAD
        title: "Export Successful",
        description: "Assessment data has been exported successfully."
      });
    } catch (error) {
      console.error('Error exporting form:', error);
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "Failed to export the form. Please try again."
=======
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
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
      });
    }
  };

  return (
<<<<<<< HEAD
    <div className="flex gap-2">
      {hasBackup && (
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={handleRestore}
        >
          <RotateCw className="h-4 w-4" />
          Restore Backup
        </Button>
      )}

      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Clear Form
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will clear all form data. This action cannot be undone.
              {hasBackup && " A backup will be preserved in case you need to restore it later."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClear}>
              Clear Form
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Button 
        variant="outline" 
        className="gap-2" 
        onClick={handleExport}
        disabled={validationStatus && !validationStatus.isValid}
      >
        <FileDown className="h-4 w-4" />
        Export
      </Button>
    </div>
  );
}
=======
    <div className="fixed top-4 right-4 flex gap-2 z-50">
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
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
