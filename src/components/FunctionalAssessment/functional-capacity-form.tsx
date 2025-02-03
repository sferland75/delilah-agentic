import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';

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

export function FunctionalCapacityForm() {
  const { getValues, setValue } = useFormContext();

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
                  className="w-full"
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
}