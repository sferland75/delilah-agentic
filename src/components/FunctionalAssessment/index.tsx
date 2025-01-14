import React from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RangeOfMotion } from '@/components/RangeOfMotion';
import { ManualMuscleTest } from '@/components/ManualMuscle';
import { BergBalanceTest } from '@/components/BergBalance';
import { PosturalTolerances } from './postural-tolerances';
import { TransfersAssessment } from './transfers-assessment';
import { useFormContext } from 'react-hook-form';
import { ActivitySquare, MoveVertical, Move, Ruler, GripHorizontal, Scale3d } from 'lucide-react';

export function FunctionalAssessment() {
  const { control } = useFormContext();

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
      
      <Tabs defaultValue="physical" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger 
            value="physical" 
            className="bg-white/50 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50"
          >
            <div className="flex items-center gap-2">
              <ActivitySquare className="h-4 w-4" />
              <span>Physical Assessment</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="postural" 
            className="bg-white/50 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50"
          >
            <div className="flex items-center gap-2">
              <MoveVertical className="h-4 w-4" />
              <span>Postural Tolerances</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="transfers" 
            className="bg-white/50 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50"
          >
            <div className="flex items-center gap-2">
              <Move className="h-4 w-4" />
              <span>Mobility & Transfers</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="physical" className="space-y-6">
          <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Ruler className="h-5 w-5 text-blue-600" />
              <div>
                <h3 className="text-lg font-medium text-slate-800">Range of Motion</h3>
                <div className="text-sm text-slate-600">Assess joint mobility and movement restrictions</div>
              </div>
            </div>
            <RangeOfMotion />
          </div>

          <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <GripHorizontal className="h-5 w-5 text-blue-600" />
              <div>
                <h3 className="text-lg font-medium text-slate-800">Manual Muscle Testing</h3>
                <div className="text-sm text-slate-600">Evaluate muscle strength and function</div>
              </div>
            </div>
            <ManualMuscleTest />
          </div>

          <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Scale3d className="h-5 w-5 text-blue-600" />
              <div>
                <h3 className="text-lg font-medium text-slate-800">Berg Balance Test</h3>
                <div className="text-sm text-slate-600">Assess balance and stability</div>
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

        <TabsContent value="transfers">
          <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
            <TransfersAssessment control={control} />
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}