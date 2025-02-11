import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle } from 'lucide-react';
import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert';

interface PromptEditorProps {
  sectionKey: string;
  originalPrompt: {
    system: string;
    human: string;
  };
  onSubmit: (newPrompt: { system: string; human: string }) => Promise<void>;
  onClose: () => void;
}

export const PromptEditor: React.FC<PromptEditorProps> = ({
  sectionKey,
  originalPrompt,
  onSubmit,
  onClose,
}) => {
  const [systemPrompt, setSystemPrompt] = useState(originalPrompt.system);
  const [humanPrompt, setHumanPrompt] = useState(originalPrompt.human);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      setError(null);
      setIsSubmitting(true);
      await onSubmit({
        system: systemPrompt,
        human: humanPrompt,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating prompt');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSystemPrompt(originalPrompt.system);
    setHumanPrompt(originalPrompt.human);
    setError(null);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Customize Section Prompt</DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="systemPrompt">System Prompt</Label>
            <Textarea
              id="systemPrompt"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="h-[200px] resize-none font-mono text-sm"
              placeholder="Enter system prompt..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="humanPrompt">Human Prompt</Label>
            <Textarea
              id="humanPrompt"
              value={humanPrompt}
              onChange={(e) => setHumanPrompt(e.target.value)}
              className="h-[200px] resize-none font-mono text-sm"
              placeholder="Enter human prompt..."
            />
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={isSubmitting}
            >
              Reset to Original
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Regenerating...' : 'Regenerate Section'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};