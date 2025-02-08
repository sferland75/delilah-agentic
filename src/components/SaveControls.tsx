import React from 'react';
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
import { FileDown, RotateCcw, History } from 'lucide-react';
import { useAssessmentForm } from '@/context/FormProvider';
import { toast } from '@/components/ui/use-toast';

export function SaveControls() {
  const { clearForm, exportForm, formData, validationStatus, hasBackup, loadBackup } = useAssessmentForm();
  const [showAlert, setShowAlert] = React.useState(false);

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
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: "Assessment data has been exported successfully."
      });
    } catch (error) {
      console.error('Error exporting form:', error);
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "Failed to export the form. Please try again."
      });
    }
  };

  return (
    <div className="flex gap-2">
      {hasBackup && (
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={loadBackup}
        >
          <History className="h-4 w-4" />
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