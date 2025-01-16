import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity } from 'lucide-react';
import { PosturalTolerances } from './postural-tolerances';
import { TransfersAssessment } from './transfers-assessment';
import { RangeOfMotion } from '../RangeOfMotion';
import { ManualMuscle } from '../ManualMuscle';
import { BergBalanceTest } from '../BergBalanceTest/BergBalanceTest';

export function FunctionalSection() {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="mb-6 flex items-start gap-3">
            <Activity className="h-5 w-5 text-slate-500 mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-[#2C3258]">Functional Assessment</h2>
              <p className="text-sm text-[#4556B4]">
                Comprehensive evaluation of functional abilities and limitations
              </p>
            </div>
          </div>

          <Tabs defaultValue="rom" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="rom">Range of Motion</TabsTrigger>
              <TabsTrigger value="mmt">Manual Muscle</TabsTrigger>
              <TabsTrigger value="berg">BERG Balance</TabsTrigger>
              <TabsTrigger value="postural">Postural Tolerances</TabsTrigger>
              <TabsTrigger value="transfers">Transfers</TabsTrigger>
            </TabsList>

            <TabsContent value="rom">
              <RangeOfMotion />
            </TabsContent>

            <TabsContent value="mmt">
              <ManualMuscle />
            </TabsContent>

            <TabsContent value="berg">
              <BergBalanceTest />
            </TabsContent>

            <TabsContent value="postural">
              <PosturalTolerances control={control} />
            </TabsContent>

            <TabsContent value="transfers">
              <TransfersAssessment control={control} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default FunctionalSection;