import React, { useState, useCallback } from 'react';
import { useAssessmentForm } from '@/hooks/useAssessmentForm';
import { ReportGenerationButton } from './components/ReportGenerationButton';
import { ProgressDialog } from './components/ProgressDialog';
import { ReportPreviewDialog } from './components/ReportPreviewDialog';
import { useReportGeneration } from './hooks/useReportGeneration';
import { useReportValidation } from './hooks/useReportValidation';
import type { AssessmentForm } from '@/lib/validation/assessment-schema';

export const ReportGenerationIntegration: React.FC = () => {
  const form = useAssessmentForm();
  const [reportContent, setReportContent] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  
  const { validateForm } = useReportValidation();
  
  const handleComplete = useCallback((content: string) => {
    setReportContent(content);
    setShowPreview(true);
  }, []);

  const { 
    generateReport, 
    resumeGeneration,
    isGenerating, 
    progress, 
    currentSection, 
    error, 
    reset 
  } = useReportGeneration({
    onComplete: handleComplete,
    onError: (error: Error) => {
      console.error('Report generation error:', error);
    }
  });

  const handleGenerate = async () => {
    const formData = form.getValues() as AssessmentForm;
    const validationErrors = validateForm(formData);
    
    if (validationErrors.length > 0) {
      return;
    }

    try {
      const partialReport = await resumeGeneration();
      if (partialReport && window.confirm('Resume from previous session?')) {
        setReportContent(partialReport);
        setShowPreview(true);
        return;
      }

      await generateReport(formData);
    } catch (err) {
      console.error('Failed to generate report:', err);
    }
  };

  const handleCancel = useCallback(() => {
    if (progress > 0 && progress < 100 && !error) {
      const shouldCancel = window.confirm(
        'Are you sure you want to cancel? Progress will be saved and you can resume later.'
      );
      if (!shouldCancel) {
        return;
      }
    }
    reset();
    setShowPreview(false);
  }, [progress, error, reset]);

  const handleDownload = useCallback(() => {
    const filename = `assessment-report-${new Date().toISOString().split('T')[0]}.txt`;
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [reportContent]);

  // Get validation errors from form state
  const validationErrors = Object.entries(form.formState.errors).map(([section, err]) => ({
    section,
    message: err && typeof err === 'object' && 'message' in err 
      ? (err.message as string) 
      : 'Invalid field'
  }));

  return (
    <div className="space-y-4">
      <ReportGenerationButton
        onGenerate={handleGenerate}
        isValid={form.formState.isValid}
        validationErrors={validationErrors}
        isGenerating={isGenerating}
      />

      <ProgressDialog
        progress={progress}
        section={currentSection}
        error={error}
        onCancel={handleCancel}
        onRetry={error ? handleGenerate : undefined}
        isOpen={isGenerating}
      />

      <ReportPreviewDialog
        content={reportContent}
        onDownload={handleDownload}
        onClose={() => setShowPreview(false)}
        isOpen={showPreview}
      />
    </div>
  );
};