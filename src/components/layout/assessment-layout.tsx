import React from 'react';

interface AssessmentLayoutProps {
  children: React.ReactNode;
}

export function AssessmentLayout({ children }: AssessmentLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6">
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}