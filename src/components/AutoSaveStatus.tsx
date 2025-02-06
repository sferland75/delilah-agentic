import React from 'react';
import { useFormWithAutosave } from '@/hooks/useFormWithAutosave';
import { useAssessmentPersistence } from '@/hooks/useAssessmentPersistence';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Loader2, Save, Download, Trash2 } from 'lucide-react';

interface AutoSaveStatusProps {
  className?: string;
}

export const AutoSaveStatus: React.FC<AutoSaveStatusProps> = ({ className }) => {
  const { isSaving, lastSaved } = useFormWithAutosave();
  const { clearAssessment, exportAssessment } = useAssessmentPersistence();

  return (
    <Card className={`flex items-center gap-4 bg-white/90 backdrop-blur p-4 ${className}`}>
      <div className="flex items-center gap-2">
        {isSaving ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Saving...</span>
          </>
        ) : (
          <>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span className="text-sm text-muted-foreground">
              {lastSaved ? (
                `Last saved: ${lastSaved.toLocaleTimeString()}`
              ) : (
                'All changes saved'
              )}
            </span>
          </>
        )}
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => exportAssessment()}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => clearAssessment()}
          className="flex items-center gap-2 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          Clear
        </Button>
      </div>
    </Card>
  );
};