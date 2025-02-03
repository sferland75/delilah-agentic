import React, { useState } from 'react';
import { Assessment } from '@/types/assessment';
import { DelilahReportGenerator } from '@/lib/reports';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

interface ReportGeneratorProps {
  assessment: Assessment;
  apiKey: string;
}

export function ReportGenerator({ assessment, apiKey }: ReportGeneratorProps) {
  const [report, setReport] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateReport = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const generator = new DelilahReportGenerator({ apiKey });
      const generatedReport = await generator.generateReport(assessment);
      setReport(generatedReport);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `assessment-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <Button 
        onClick={handleGenerateReport}
        disabled={loading}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Report...
          </>
        ) : (
          'Generate Report'
        )}
      </Button>
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}
      
      {report && (
        <Card className="p-4">
          <div className="flex justify-end mb-4">
            <Button 
              onClick={handleDownload}
              variant="outline"
              size="sm"
            >
              Download Report
            </Button>
          </div>
          <div className="bg-muted p-4 rounded-md">
            <pre className="whitespace-pre-wrap font-mono text-sm">
              {report}
            </pre>
          </div>
        </Card>
      )}
    </div>
  );
}

export default ReportGenerator;