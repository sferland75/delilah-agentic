import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GenerationProgress } from '@/lib/reports/ReportGenerator';

interface ProgressProps {
  sections: Record<string, GenerationProgress>;
  currentSection?: string;
  error?: string;
}

export const GenerationProgressUI: React.FC<ProgressProps> = ({
  sections,
  currentSection,
  error
}) => {
  // Calculate overall progress
  const overallProgress = Object.values(sections).reduce(
    (sum, section) => sum + section.progress,
    0
  ) / Object.keys(sections).length;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Report Generation Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span>{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} />
        </div>

        {/* Current Section */}
        {currentSection && (
          <div className="text-sm text-muted-foreground">
            Currently processing: {currentSection}
          </div>
        )}

        {/* Section Progress */}
        <div className="space-y-3">
          {Object.entries(sections).map(([key, section]) => (
            <div key={key} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{section.section}</span>
                <span>{Math.round(section.progress)}%</span>
              </div>
              <Progress 
                value={section.progress}
                className={
                  section.status === 'error' 
                    ? 'bg-red-200' 
                    : section.status === 'complete'
                    ? 'bg-green-200'
                    : ''
                }
              />
              {section.error && (
                <div className="text-xs text-red-500 mt-1">
                  {section.error}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};