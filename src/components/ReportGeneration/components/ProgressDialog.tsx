import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

interface ProgressDialogProps {
  progress: number;
  section?: string;
  error?: Error | null;
  onCancel: () => void;
  onRetry?: () => void;
  isOpen: boolean;
}

export const ProgressDialog: React.FC<ProgressDialogProps> = ({
  progress,
  section,
  error,
  onCancel,
  onRetry,
  isOpen
}) => {
  const isCompleting = progress > 95;
  
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {error ? 'Error Generating Report' : 'Generating Report'}
          </DialogTitle>
          <DialogDescription>
            {error ? 'An error occurred while generating the report.' : 'Please wait while we generate your report.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <Progress 
            value={progress} 
            className="w-full" 
            aria-valuenow={progress}
            role="progressbar"
          />
          
          {!error && section && (
            <div className="flex items-center space-x-2">
              {!isCompleting && <Loader2 className="w-4 h-4 animate-spin" />}
              <p className="text-sm text-gray-500">
                {isCompleting ? 'Finalizing report...' : `Processing: ${section}`}
              </p>
            </div>
          )}

          <p className="text-sm text-gray-500">
            Progress: {Math.round(progress)}%
          </p>

          {error && (
            <Alert>
              <AlertDescription>
                {error.message}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          {error && onRetry ? (
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onCancel} data-testid="cancel-button">
                Cancel
              </Button>
              <Button onClick={onRetry} data-testid="retry-button">
                Retry
              </Button>
            </div>
          ) : (
            <Button variant="outline" onClick={onCancel} data-testid="close-button">
              {progress === 100 ? 'Close' : 'Cancel'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};