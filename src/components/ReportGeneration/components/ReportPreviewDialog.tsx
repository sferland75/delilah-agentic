import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ReportPreviewDialogProps {
  content: string;
  onDownload: () => void;
  onClose: () => void;
  isOpen: boolean;
}

export const ReportPreviewDialog: React.FC<ReportPreviewDialogProps> = ({
  content,
  onDownload,
  onClose,
  isOpen
}) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Report Preview</DialogTitle>
          <button onClick={onClose} className="absolute right-4 top-4">
            <X className="w-4 h-4" />
          </button>
        </DialogHeader>
        <div className="space-y-4">
          <div className="max-h-96 overflow-y-auto border rounded p-4">
            <pre className="whitespace-pre-wrap font-mono text-sm">
              {content}
            </pre>
          </div>
          <div className="flex justify-end space-x-2">
            <Button onClick={onDownload} variant="default">
              Download Report
            </Button>
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};