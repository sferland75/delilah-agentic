import React from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BergBalanceTest } from '@/components/BergBalance';
import { PosturalTolerances } from './postural-tolerances';
import { MobilityAssessment } from './MobilityAssessment';
import { useFormContext } from 'react-hook-form';
import { ActivitySquare, MoveVertical, Move, ClipboardList } from 'lucide-react';
import { AssessmentMapIntegration } from '@/components/AssessmentMap';

interface MeasurementSummaryProps {
  data: any;
}

const MeasurementSummary: React.FC<MeasurementSummaryProps> = ({ data }) => {
  const romDeficits = Object.entries(data.rom || {}).filter(([_, value]: [string, any]) => value?.affected);
  const mmtDeficits = Object.entries(data.mmt || {}).filter(([_, value]: [string, any]) => value?.affected);

  if (romDeficits.length === 0 && mmtDeficits.length === 0) {
    return null;
  }

  const getROMSeverity = (percentage: number) => {
    if (percentage >= 90) return "Normal";
    if (percentage >= 75) return "Mild Restriction";
    if (percentage >= 50) return "Moderate Restriction";
    return "Severe Restriction";
  };

  const getMMTSeverity = (grade: number) => {
    if (grade >= 4) return "Good-Normal";
    if (grade === 3) return "Fair";
    if (grade === 2) return "Poor";
    return "Trace-None";
  };

  return (
    <div className="mt-6 space-y-6">
      {romDeficits.length > 0 && (
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-medium text-lg mb-3">ROM Deficits</h3>
          <div className="space-y-2">
            {romDeficits.map(([joint, data]: [string, any]) => (
              <div key={joint} className="flex justify-between items-start border-b pb-2">
                <div>
                  <span className="font-medium">{data.label || joint}</span>
                  <div className="text-sm text-slate-600">
                    {getROMSeverity(parseInt(data.percentage))} ({data.percentage}% ROM)
                  </div>
                  {data.restrictions && (
                    <div className="text-sm text-slate-500 mt-1">{data.restrictions}</div>
                  )}
                </div>
                {data.painLevel > 0 && (
                  <span className="text-sm bg-red-50 text-red-600 px-2 py-1 rounded">
                    Pain: {data.painLevel}/10
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {mmtDeficits.length > 0 && (
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-medium text-lg mb-3">MMT Deficits</h3>
          <div className="space-y-2">
            {mmtDeficits.map(([muscle, data]: [string, any]) => (
              <div key={muscle} className="flex justify-between items-start border-b pb-2">
                <div>
                  <span className="font-medium">{data.label || muscle}</span>
                  <div className="text-sm text-slate-600">
                    {getMMTSeverity(parseInt(data.grade))} (Grade {data.grade}/5)
                  </div>
                  {data.observations && (
                    <div className="text-sm text-slate-500 mt-1">{data.observations}</div>
                  )}
                </div>
                {data.painLevel > 0 && (
                  <span className="text-sm bg-red-50 text-red-600 px-2 py-1 rounded">
                    Pain: {data.painLevel}/10
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export function FunctionalAssessment() {
  const { control, watch } = useFormContext();

  return (
    <Card className="p-6 bg-slate-50">
      <h2 className="text-2xl font-semibold mb-2 text-slate-800">Functional Assessment</h2>
      <p className="text-sm text-slate-600 mb-6">Comprehensive evaluation of physical function and mobility</p>

      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <AlertDescription className="text-slate-700">
          Document detailed assessment of:
          - Physical function and joint mobility
          - Postural control and tolerances
          - Transfer abilities and mobility needs
          - Balance and stability measures
        </AlertDescription>
      </Alert>
      
      <Tabs defaultValue="physical-map" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="physical-map">
            <div className="flex items-center gap-2">
              <ActivitySquare className="h-4 w-4" />
              <span>ROM/MMT</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="berg">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              <span>Berg Balance</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="postural">
            <div className="flex items-center gap-2">
              <MoveVertical className="h-4 w-4" />
              <span>Postural</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="mobility">
            <div className="flex items-center gap-2">
              <Move className="h-4 w-4" />
              <span>Mobility</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="physical-map" className="space-y-6">
          <div className="border rounded-lg p-4 bg-white shadow-sm">
            <AssessmentMapIntegration />
            <MeasurementSummary data={watch()} />
          </div>
        </TabsContent>

        <TabsContent value="berg">
          <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList className="h-5 w-5 text-blue-600" />
              <div>
                <h3 className="text-lg font-medium text-slate-800">Berg Balance Scale</h3>
                <div className="text-sm text-slate-600">Assessment of balance and fall risk</div>
              </div>
            </div>
            <BergBalanceTest />
          </div>
        </TabsContent>

        <TabsContent value="postural">
          <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
            <PosturalTolerances control={control} />
          </div>
        </TabsContent>

        <TabsContent value="mobility">
          <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
            <MobilityAssessment 
              control={control} 
              prefix="functionalAssessment.mobility"
            />
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}