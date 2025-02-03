import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface Finding {
  joint?: string;
  muscle?: string;
  label: string;
  score: string;
  notes?: string;
  pain?: boolean;
}

interface FindingsSummaryProps {
  romFindings: Finding[];
  mmtFindings: Finding[];
}

export const FindingsSummary = ({ romFindings, mmtFindings }: FindingsSummaryProps) => {
  if (romFindings.length === 0 && mmtFindings.length === 0) return null;

  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-4">
        <div className="space-y-6">
          {romFindings.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-3">ROM Findings</h3>
              <div className="space-y-3">
                {romFindings.map((finding) => (
                  <div key={finding.joint} className="bg-slate-50 p-3 rounded-lg">
                    <div className="flex justify-between items-start">
                      <span className="font-medium">{finding.label}</span>
                      <span className="text-sm bg-blue-100 px-2 py-1 rounded">
                        Score: {finding.score}
                      </span>
                    </div>
                    {finding.notes && (
                      <p className="text-sm text-slate-600 mt-1">{finding.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {mmtFindings.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-3">MMT Findings</h3>
              <div className="space-y-3">
                {mmtFindings.map((finding) => (
                  <div key={finding.muscle} className="bg-slate-50 p-3 rounded-lg">
                    <div className="flex justify-between items-start">
                      <span className="font-medium">{finding.label}</span>
                      <span className="text-sm bg-blue-100 px-2 py-1 rounded">
                        Grade: {finding.score}/5
                      </span>
                    </div>
                    {finding.notes && (
                      <p className="text-sm text-slate-600 mt-1">{finding.notes}</p>
                    )}
                    {finding.pain && (
                      <p className="text-sm text-red-600 mt-1">Pain with testing</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};