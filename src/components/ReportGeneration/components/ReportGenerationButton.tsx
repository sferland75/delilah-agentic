import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { useForm } from '@/context/FormContext';
import { validateAssessmentData } from '@/utils/validation';
import { useToast } from "@/components/ui/use-toast";
import { ProgressDialog } from './ProgressDialog';
import { ReportGenerator } from '../services/reportTemplateSystem';
import { defaultTemplate } from '../services/reportTemplates';

export const ReportGenerationButton: React.FC = () => {
  const { formData } = useForm();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState<string>('');
  const [error, setError] = useState<Error | null>(null);

  const handleGenerateReport = async () => {
    try {
      const validation = validateAssessmentData(formData);
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
Client Name: ${formData.demographics.firstName} ${formData.demographics.lastName}
Date of Birth: ${formData.demographics.dateOfBirth}
Date of Assessment: ${new Date().toISOString().split('T')[0]}
`);

      // Generate each section
      for (let i = 0; i < totalSections; i++) {
        const section = defaultTemplate.sections[i];
        setCurrentSection(section.title);
        setProgress((i / totalSections) * 100);
        
        const content = await section.generate(formData);
        report.push(content);
      }

      // Create download
      const blob = new Blob([report.join('\n\n')], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${formData.demographics.lastName}_${formData.demographics.firstName}_Assessment_${new Date().toISOString().split('T')[0]}.md`;
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
        variant="outline"
        className="flex items-center gap-2 border-purple-600 text-purple-600 hover:bg-purple-50"
      >
        <FileText className="h-4 w-4" />
        Generate Report
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