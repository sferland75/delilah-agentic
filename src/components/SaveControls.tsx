import React, { useRef } from 'react';
import { useFormContext } from "react-hook-form";
import { Button } from '@/components/ui/button';
import { Save, Download, Upload, Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { ClearFormButton } from './ui/ClearFormButton';
import { ReportGenerationButton } from './ReportGeneration/components/ReportGenerationButton';
import type { AssessmentFormData } from '@/lib/validation/assessment-schema';
import { assessmentSchema } from '@/lib/validation/assessment-schema';
import { useAssessmentPersistence } from '@/hooks/useAssessmentPersistence';

interface SaveControlsProps {
  className?: string;
}

export const SaveControls: React.FC<SaveControlsProps> = ({ className }) => {
  const { getValues, reset, formState: { isDirty, isValid } } = useFormContext<AssessmentFormData>();
  const { saveAssessment, exportAssessment } = useAssessmentPersistence();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const validateForm = async (data: AssessmentFormData) => {
    try {
      await assessmentSchema.parseAsync(data);
      return { valid: true, errors: [] };
    } catch (error) {
      return {
        valid: false,
        errors: error.errors?.map((e: any) => e.message) || ['Invalid form data']
      };
    }
  };

  const handleFileLoad = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const content = await file.text();
      const data = JSON.parse(content);
      
      // Validate the loaded data
      const validation = await validateForm(data);
      if (!validation.valid) {
        throw new Error('Invalid assessment data: ' + validation.errors.join(', '));
      }
      
      // Reset the form with the new data
      reset(data);
      
      toast({
        title: "Assessment Loaded",
        description: "The assessment has been loaded successfully."
      });
    } catch (error) {
      console.error('Error loading assessment file:', error);
      toast({
        variant: "destructive",
        title: "Load Failed",
        description: error instanceof Error ? error.message : "Failed to load the assessment file."
      });
    } finally {
      setIsLoading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const formData = getValues();
      const validation = await validateForm(formData);
      
      if (!validation.valid) {
        throw new Error('Required data is missing: ' + validation.errors.join(', '));
      }

      await saveAssessment();

    } catch (error) {
      console.error('Error saving assessment:', error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Failed to save the assessment."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    setIsLoading(true);
    try {
      const formData = getValues();
      const validation = await validateForm(formData);
      
      if (!validation.valid) {
        throw new Error('Required data is missing: ' + validation.errors.join(', '));
      }

      await exportAssessment();

    } catch (error) {
      console.error('Error exporting assessment:', error);
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: error instanceof Error ? error.message : "Failed to export the assessment."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileLoad}
        accept=".json"
        className="hidden"
      />

      <ClearFormButton variant="outline" />
      
      <Button
        onClick={() => fileInputRef.current?.click()}
        variant="outline"
        disabled={isLoading}
        className="flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Upload className="h-4 w-4" />
        )}
        Load Assessment
      </Button>

      <Button
        onClick={handleSave}
        disabled={!isDirty || !isValid || isLoading}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        Save Progress
      </Button>
      
      <Button
        onClick={handleExport}
        variant="outline"
        disabled={!isValid || isLoading}
        className="flex items-center gap-2 border-green-600 text-green-600 hover:bg-green-50"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        Export Assessment
      </Button>

      <ReportGenerationButton />
    </div>
  );
};