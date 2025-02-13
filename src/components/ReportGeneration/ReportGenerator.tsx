<<<<<<< HEAD
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
=======
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ReportHeader } from './components/ReportHeader';
import { ReportSection } from './components/ReportSection';
import { NatureOfInjury } from './components/sections/NatureOfInjury';
import { MedicalHistory } from './components/sections/MedicalHistory';
import { Symptoms } from './components/sections/Symptoms';
import { FunctionalAssessment } from './components/sections/FunctionalAssessment';
import { EnvironmentalAssessment } from './components/sections/EnvironmentalAssessment';
import { ADLAssessment } from './components/sections/ADLAssessment';
import { AMAGuidesAssessment } from './components/sections/AMAGuidesAssessment';
import { CareAssessment } from './components/sections/CareAssessment';
import type { Assessment } from '@/types';

interface ReportGeneratorProps {
  assessment: Assessment;
  onError?: (error: Error, sectionName: string) => void;
}

// Error boundary component for report sections
class SectionErrorBoundary extends React.Component<{
  children: React.ReactNode;
  sectionName: string;
  onError?: (error: Error, sectionName: string) => void;
}> {
  componentDidCatch(error: Error) {
    this.props.onError?.(error, this.props.sectionName);
  }

  render() {
    return this.props.children;
  }
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({ assessment, onError }) => {
  const renderSection = (name: string, Component: React.ComponentType<{ assessment: Assessment }>) => (
    <SectionErrorBoundary sectionName={name} onError={onError}>
      <Component assessment={assessment} />
    </SectionErrorBoundary>
  );

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white shadow-lg">
      <CardContent className="p-8">
        <SectionErrorBoundary sectionName="Header" onError={onError}>
          <ReportHeader assessment={assessment} />
        </SectionErrorBoundary>
        
        <ReportSection title="NATURE OF INJURY">
          {renderSection('Nature of Injury', NatureOfInjury)}
        </ReportSection>

        <ReportSection title="MEDICAL HISTORY">
          {renderSection('Medical History', MedicalHistory)}
        </ReportSection>

        <ReportSection title="SYMPTOMS">
          {renderSection('Symptoms', Symptoms)}
        </ReportSection>

        <ReportSection title="FUNCTIONAL ASSESSMENT">
          {renderSection('Functional Assessment', FunctionalAssessment)}
        </ReportSection>

        <ReportSection title="ENVIRONMENTAL ASSESSMENT">
          {renderSection('Environmental Assessment', EnvironmentalAssessment)}
        </ReportSection>

        <ReportSection title="ACTIVITIES OF DAILY LIVING">
          {renderSection('ADL Assessment', ADLAssessment)}
        </ReportSection>

        <ReportSection title="AMA GUIDES ASSESSMENT">
          {renderSection('AMA Guides Assessment', AMAGuidesAssessment)}
        </ReportSection>

        <ReportSection title="CARE NEEDS AND COSTS">
          {renderSection('Care Assessment', CareAssessment)}
        </ReportSection>
      </CardContent>
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
    </Card>
  );
};