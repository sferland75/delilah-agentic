import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DEFAULT_POSTURAL_VALUES } from './postural-default-values';

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
] as const;

export function PosturalTolerances() {
  const { control, setValue, getValues } = useFormContext();

  useEffect(() => {
    // Initialize default values if not already set
    const currentValues = getValues('functionalAssessment.posturalTolerances');
    if (!currentValues) {
      POSTURAL_POSITIONS.forEach((position) => {
        const defaultValue = DEFAULT_POSTURAL_VALUES[position.id];
        setValue(
          `functionalAssessment.posturalTolerances.${position.id}`,
          defaultValue,
          { shouldValidate: true }
        );
      });
    }
  }, [setValue, getValues]);

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
              defaultValue={DEFAULT_POSTURAL_VALUES[position.id].duration}
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
              defaultValue={DEFAULT_POSTURAL_VALUES[position.id].frequency}
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
            defaultValue={DEFAULT_POSTURAL_VALUES[position.id].limitations}
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