import React from 'react';
import { useFormContext } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { RomMmtMap } from '@/components/RomMmtMap';
import { type AssessmentFormData } from '@/lib/validation/assessment-schema';

const activities = [
  'Standing',
  'Walking',
  'Sitting',
  'Lifting',
  'Carrying',
  'Pushing/Pulling',
  'Climbing',
  'Balancing',
  'Stooping',
  'Kneeling',
  'Crouching',
  'Reaching',
  'Handling',
  'Fingering',
  'Feeling',
] as const;

const FunctionalCapacityForm = () => {
  const { getValues, setValue } = useFormContext<AssessmentFormData>();

  return (
    <div className="space-y-6">
      {activities.map((activity) => {
        const tolerances = getValues('functionalAssessment.tolerances') || {};
        const activityData = tolerances[activity] || {};

        return (
          <div key={activity} className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">{activity}</Label>
              <div className="w-1/2">
                <Slider
                  value={[activityData.painLevel || 0]}
                  max={10}
                  step={1}
                  onValueChange={([value]) => {
                    setValue(`functionalAssessment.tolerances.${activity}`, {
                      ...activityData,
                      painLevel: value
                    }, { shouldValidate: true });
                  }}
                />
                <div className="flex justify-between mt-1 text-sm text-gray-500">
                  <span>No Difficulty</span>
                  <span>Severe Difficulty</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Limitations</Label>
                <Textarea
                  value={activityData.limitations || ''}
                  onChange={(e) => {
                    setValue(`functionalAssessment.tolerances.${activity}`, {
                      ...activityData,
                      limitations: e.target.value
                    }, { shouldValidate: true });
                  }}
                  placeholder="Describe any limitations..."
                  className="h-20"
                />
              </div>
              <div className="space-y-2">
                <Label>Adaptations/Modifications</Label>
                <Textarea
                  value={activityData.adaptations || ''}
                  onChange={(e) => {
                    setValue(`functionalAssessment.tolerances.${activity}`, {
                      ...activityData,
                      adaptations: e.target.value
                    }, { shouldValidate: true });
                  }}
                  placeholder="Describe any adaptations..."
                  className="h-20"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const FunctionalSection = () => {
  const { getValues, setValue } = useFormContext<AssessmentFormData>();
  const functionalAssessment = getValues('functionalAssessment') || {};

  const handleRomMmtUpdate = (data: any) => {
    setValue('functionalAssessment', {
      ...functionalAssessment,
      [data.type === 'ROM' ? 'rangeOfMotion' : 'manualMuscleTesting']: data.data
    }, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="capacity" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-100">
          <TabsTrigger 
            value="capacity" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Functional Capacity
          </TabsTrigger>
          <TabsTrigger 
            value="bodymap"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            ROM & MMT Assessment
          </TabsTrigger>
        </TabsList>

        <TabsContent value="capacity">
          <div className="space-y-4">
            <FunctionalCapacityForm />
          </div>
        </TabsContent>

        <TabsContent value="bodymap">
          <RomMmtMap onUpdate={handleRomMmtUpdate} />
        </TabsContent>
      </Tabs>
    </div>
  );
};