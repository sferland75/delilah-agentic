import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import { useAssessmentPersistence } from '@/hooks/useAssessmentPersistence';
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

interface ClearFormButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export const ClearFormButton: React.FC<ClearFormButtonProps> = ({
  variant = 'destructive',
  size = 'default',
  className
}) => {
  const [isClearing, setIsClearing] = useState(false);
  const { clearAssessment } = useAssessmentPersistence();

  const handleClear = async () => {
    setIsClearing(true);
    try {
      await clearAssessment();
      // Force a page reload to ensure all components re-render with empty state
      window.location.reload();
    } catch (error) {
      console.error('Error clearing form:', error);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={`flex items-center gap-2 ${className}`}
          disabled={isClearing}
        >
          {isClearing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          Clear Form
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Clear Form Data</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to clear all form data? This action cannot be undone.
            Any unsaved changes will be permanently lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleClear}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Clear Form
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};