import React from 'react';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export interface ProgressDialogProps {
  isOpen: boolean;
  progress: number;
  status: string;
  message?: string;
  error?: string;
  onCancel: () => void;
}

export const ProgressDialog: React.FC<ProgressDialogProps> = ({
  isOpen,
  progress,
  status,
  message,
  error,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => onCancel()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {error ? 'Error Generating Report' : 'Generating Report'}
          </DialogTitle>
        </DialogHeader>

        {!error && (
          <>
            <div className="flex items-center space-x-4 mb-4">
              <Loader2 
                className="animate-spin h-6 w-6" 
                data-testid="spinner"
              />
              <div>
                <div>{status}</div>
                <div>Progress: {progress}%</div>
              </div>
            </div>

            <div className="mb-4">
              {message || 'Please wait while we generate your report.'}
            </div>

            <div 
              className="h-2 bg-gray-200 rounded overflow-hidden"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div 
                className="h-full bg-blue-600 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-6 flex justify-end">
              <Button 
                variant="outline" 
                onClick={onCancel}
                data-testid="cancel-button"
              >
                Cancel
              </Button>
            </div>
          </>
        )}

        {error && (
          <>
            <div className="text-red-600 mb-4">Failed to generate</div>
            <div className="mb-6">
              An error occurred while generating the report.
            </div>
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                onClick={onCancel}
                data-testid="close-button"
              >
                Close
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProgressDialog;