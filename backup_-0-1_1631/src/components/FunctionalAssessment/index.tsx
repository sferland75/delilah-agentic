import React from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RangeOfMotion } from '@/components/RangeOfMotion';
import { ManualMuscleTest } from '@/components/ManualMuscle';
import { BergBalanceTest } from '@/components/BergBalance';
import { PosturalTolerances } from './postural-tolerances';
import { TransfersAssessment } from './transfers-assessment';
import { useFormContext } from 'react-hook-form';

export function FunctionalAssessment() {
  const { control } = useFormContext();

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Functional Assessment</h2>
      
      <Tabs defaultValue="physical" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="physical">Physical Assessment</TabsTrigger>
          <TabsTrigger value="postural">Postural Tolerances</TabsTrigger>
          <TabsTrigger value="transfers">Mobility & Transfers</TabsTrigger>
        </TabsList>

        <TabsContent value="physical" className="space-y-6">
          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-medium">Range of Motion</h3>
            <div className="text-sm text-muted-foreground mb-4">Assess joint mobility and movement restrictions</div>
            <RangeOfMotion />
          </div>

          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-medium">Manual Muscle Testing</h3>
            <div className="text-sm text-muted-foreground mb-4">Evaluate muscle strength and function</div>
            <ManualMuscleTest />
          </div>

          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-medium">Berg Balance Test</h3>
            <div className="text-sm text-muted-foreground mb-4">Assess balance and stability</div>
            <BergBalanceTest />
          </div>
        </TabsContent>

        <TabsContent value="postural">
          <PosturalTolerances control={control} />
        </TabsContent>

        <TabsContent value="transfers">
          <TransfersAssessment control={control} />
        </TabsContent>
      </Tabs>
    </Card>
  );
}