import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ClaudeReportService } from '@/services/claude-integration';
import { AssessmentData } from '@/types/assessment';

interface ReportGeneratorProps {
  assessmentData: AssessmentData;
  apiKey: string;
  onComplete?: (sections: string[]) => void;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  assessmentData,
  apiKey,
  onComplete
}) => {
  const [progress, setProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [sections, setSections] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const reportService = new ClaudeReportService(apiKey);

  const generateReport = async () => {
    setIsGenerating(true);
    setProgress(0);
    setError(null);
    setSections([]);

    try {
      const totalSections = 5;
      const generatedSections: string[] = [];

      // Demographics
      setCurrentSection('Demographics');
      setProgress((1 / totalSections) * 100);
      const demographics = await reportService.generateDemographicsSection(assessmentData);
      if (demographics.success) {
        generatedSections.push(demographics.content);
      }

      // Medical History
      setCurrentSection('Medical History');
      setProgress((2 / totalSections) * 100);
      const medicalHistory = await reportService.generateMedicalHistorySection(assessmentData);
      if (medicalHistory.success) {
        generatedSections.push(medicalHistory.content);
      }

      // Functional Assessment
      setCurrentSection('Functional Assessment');
      setProgress((3 / totalSections) * 100);
      const functional = await reportService.generateFunctionalAssessmentSection(assessmentData);
      if (functional.success) {
        generatedSections.push(functional.content);
      }

      // ADL
      setCurrentSection('Activities of Daily Living');
      setProgress((4 / totalSections) * 100);
      const adl = await reportService.generateADLSection(assessmentData);
      if (adl.success) {
        generatedSections.push(adl.content);
      }

      // Environmental
      setCurrentSection('Environmental Assessment');
      setProgress(100);
      const environmental = await reportService.generateEnvironmentalSection(assessmentData);
      if (environmental.success) {
        generatedSections.push(environmental.content);
      }

      setSections(generatedSections);
      if (onComplete) {
        onComplete(generatedSections);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while generating the report');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Report Generator</h2>
          <Button 
            onClick={generateReport} 
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate Report'}
          </Button>
        </div>

        {isGenerating && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Generating: {currentSection}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}

        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}

        {sections.length > 0 && (
          <div className="space-y-4">
            {sections.map((section, index) => (
              <div key={index} className="p-4 bg-muted rounded-lg">
                <pre className="whitespace-pre-wrap text-sm">
                  {section}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};