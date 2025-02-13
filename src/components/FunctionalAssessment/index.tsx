import React from 'react';
<<<<<<< HEAD
import { useFormContext } from '@/context/FormContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RomMmtMap } from '@/components/RomMmtMap';
import { FunctionalCapacityForm } from './functional-capacity-form';

export const FunctionalAssessment: React.FC = () => {
  const { formData, updateFormData } = useFormContext();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Functional Assessment</CardTitle>
        <CardDescription>
          Evaluate functional capacities and limitations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="capacity" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="capacity">Functional Capacity</TabsTrigger>
            <TabsTrigger value="bodymap">ROM & MMT Assessment</TabsTrigger>
          </TabsList>

          <TabsContent value="capacity">
            <FunctionalCapacityForm />
          </TabsContent>

          <TabsContent value="bodymap">
            <RomMmtMap onUpdate={(data) => {
              updateFormData({
                functionalAssessment: {
                  ...formData.functionalAssessment,
                  [data.type === 'ROM' ? 'rangeOfMotion' : 'manualMuscleTesting']: data.data
                }
              });
            }} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FunctionalAssessment;
=======
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RangeOfMotion } from '@/components/RangeOfMotion';
import { ManualMuscleTest } from '@/components/ManualMuscle';
import { BergBalanceTest } from '@/components/BergBalance';
import { PosturalTolerances } from './postural-tolerances';
import { MobilityAssessment } from './MobilityAssessment';
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
          <TabsTrigger value="physical">
            <div className="flex items-center gap-2">
              <ActivitySquare className="h-4 w-4" />
              <span>Physical Assessment</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="postural">
            <div className="flex items-center gap-2">
              <MoveVertical className="h-4 w-4" />
              <span>Postural Tolerances</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="transfers">
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
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
