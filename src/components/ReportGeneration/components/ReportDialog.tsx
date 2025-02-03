import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useReportGeneration } from '../hooks/useReportGeneration';

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ReportDialog: React.FC<ReportDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const {
    progress,
    currentSection,
    error,
    isGenerating,
    cancelGeneration,
    downloadReport,
  } = useReportGeneration();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Generating Report</DialogTitle>
          <DialogDescription>
            Creating a draft medical-legal report from your assessment data.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Progress value={progress} className="mb-2" />
          <p className="text-sm text-muted-foreground">
            {currentSection || 'Preparing report...'}
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mt-2">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end gap-2 mt-4">
          {isGenerating ? (
            <Button variant="outline" onClick={cancelGeneration}>
              Cancel
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              {progress === 100 && (
                <Button onClick={downloadReport}>
                  Download Report
                </Button>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDialog;