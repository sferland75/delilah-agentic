import React, { useState } from 'react';
import { useFormContext } from "react-hook-form";
import { Button } from '@/components/ui/button';
import { FileText, Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { ProgressDialog } from './ProgressDialog';
import { ReportGenerator } from '../services/reportTemplateSystem';
import { defaultTemplate } from '../services/reportTemplates';
import type { AssessmentFormData } from '@/lib/validation/assessment-schema';
import { assessmentSchema } from '@/lib/validation/assessment-schema';

interface ReportGenerationButtonProps {
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export const ReportGenerationButton: React.FC<ReportGenerationButtonProps> = ({
  variant = 'outline',
  size = 'default',
  className = ''
}) => {
  const { getValues, formState: { isValid } } = useFormContext<AssessmentFormData>();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState<string>('');
  const [error, setError] = useState<Error | null>(null);

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

  const handleGenerateReport = async () => {
    try {
      const formData = getValues();
      const validation = await validateForm(formData);
      
      if (!validation.valid) {
        toast({
          variant: "destructive",
          title: "Cannot Generate Report",
          description: "Required data is missing: " + validation.errors.join(', ')
        });
        return;
      }

      setIsGenerating(true);
      setError(null);

      // Generate sections
      const totalSections = defaultTemplate.sections.length;
      const report: string[] = [];

      // Header
      report.push(`
OCCUPATIONAL THERAPY IN-HOME ASSESSMENT
Client Name: ${formData.initial.personal.firstName} ${formData.initial.personal.lastName}
Date of Birth: ${formData.initial.personal.dateOfBirth}
Date of Assessment: ${new Date().toISOString().split('T')[0]}
`);

      // Generate each section
      for (let i = 0; i < totalSections; i++) {
        const section = defaultTemplate.sections[i];
        setCurrentSection(section.title);
        setProgress((i / totalSections) * 100);
        
        const content = await section.generate(formData);
        if (content) {
          report.push(content);
        }
        
        // Add small delay to prevent UI freezing
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Create download
      const blob = new Blob([report.join('\n\n')], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${formData.initial.personal.lastName}_${formData.initial.personal.firstName}_Assessment_${new Date().toISOString().split('T')[0]}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setProgress(100);
      toast({
        title: "Report Generated",
        description: "Your report has been generated and downloaded successfully."
      });
    } catch (error) {
      console.error('Error generating report:', error);
      setError(error instanceof Error ? error : new Error('Failed to generate report'));
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "There was an error generating your report. Please try again."
      });
    } finally {
      setIsGenerating(false);
      setProgress(0);
      setCurrentSection('');
    }
  };

  const handleCancel = () => {
    setIsGenerating(false);
    setProgress(0);
    setCurrentSection('');
    setError(null);
  };

  return (
    <>
      <Button
        onClick={handleGenerateReport}
        variant={variant}
        size={size}
        disabled={!isValid || isGenerating}
        className={`flex items-center gap-2 ${
          variant === 'outline' ? 'border-purple-600 text-purple-600 hover:bg-purple-50' : ''
        } ${className}`}
      >
        {isGenerating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FileText className="h-4 w-4" />
        )}
        {isGenerating ? 'Generating...' : 'Generate Report'}
      </Button>

      <ProgressDialog
        isOpen={isGenerating}
        progress={progress}
        section={currentSection}
        error={error}
        onCancel={handleCancel}
        onRetry={handleGenerateReport}
      />
    </>
  );
};