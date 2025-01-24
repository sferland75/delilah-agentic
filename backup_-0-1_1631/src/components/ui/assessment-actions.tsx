import { Button } from '@/components/ui/button';
import { useAssessmentContext } from '@/contexts/form-context';
import { storageService } from '@/services/storageService';
import { type AssessmentForm } from '@/types/form';

interface AssessmentActionsProps {
  onSave?: (data: AssessmentForm) => void | Promise<void>;
  onReset?: () => void;
}

export function AssessmentActions({ onSave, onReset }: AssessmentActionsProps) {
  const { reset, getValues, formState: { isDirty, isValid } } = useAssessmentContext();

  const handleSave = async () => {
    const data = getValues();
    if (onSave) {
      await onSave(data);
    }
    storageService.save(data);
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
    } else {
      reset();
      storageService.clear();
    }
  };

  return (
    <div className="fixed bottom-0 right-0 w-full md:w-auto p-4 flex gap-2 justify-end bg-background/80 backdrop-blur-sm">
      <Button
        type="button"
        variant="outline"
        onClick={handleReset}
        disabled={!isDirty}
      >
        Reset Form
      </Button>
      <Button
        type="button"
        onClick={handleSave}
        disabled={!isDirty || !isValid}
      >
        Save Progress
      </Button>
    </div>
  );
}