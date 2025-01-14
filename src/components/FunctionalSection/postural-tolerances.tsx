import React from 'react';
import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { type Assessment } from '@/types';

const POSTURAL_POSITIONS = [
  {
    id: 'sitting',
    label: 'Sitting',
    description: 'Tolerance for maintaining seated position'
  },
  {
    id: 'standing',
    label: 'Standing',
    description: 'Tolerance for maintaining standing position'
  },
  {
    id: 'walking',
    label: 'Walking',
    description: 'Tolerance for continuous walking'
  },
  {
    id: 'stairs',
    label: 'Stairs',
    description: 'Ability to navigate stairs'
  },
  {
    id: 'kneeling',
    label: 'Kneeling',
    description: 'Tolerance for kneeling position'
  },
  {
    id: 'squatting',
    label: 'Squatting',
    description: 'Tolerance for squatting position'
  },
  {
    id: 'bent_over',
    label: 'Bent Over',
    description: 'Tolerance for bent over position'
  }
];

export function PosturalTolerances({ control }: { control: Control<Assessment> }) {
  return (
    <div className="space-y-8">
      {POSTURAL_POSITIONS.map((position) => (
        <div 
          key={position.id}
          className="p-4 bg-white rounded-lg border space-y-4"
        >
          <div>
            <h3 className="text-lg font-medium">{position.label}</h3>
            <p className="text-sm text-muted-foreground">{position.description}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={control}
              name={`functionalAssessment.posturalTolerances.${position.id}.duration`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter duration in minutes"
                      {...field}
                      onChange={e => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`functionalAssessment.posturalTolerances.${position.id}.frequency`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequency (times per day)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter frequency per day"
                      {...field}
                      onChange={e => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name={`functionalAssessment.posturalTolerances.${position.id}.limitations`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Limitations & Observations</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe any limitations, pain, or other observations..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      ))}
    </div>
  );
}