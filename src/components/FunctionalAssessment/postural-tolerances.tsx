import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  const { control } = useFormContext();

  return (
    <div>
      <h3 className="text-lg font-medium text-slate-800">Postural Tolerances</h3>
      <div className="text-sm text-slate-600 mb-4">Assess positional tolerances and limitations</div>
      
      <Alert className="mb-4 bg-blue-50 border-blue-200">
        <AlertDescription className="text-slate-700">
          Document time tolerances, frequency of positions, and any limitations or modifications needed.
        </AlertDescription>
      </Alert>

      <div className="space-y-8">
        {POSTURAL_POSITIONS.map((position) => (
          <div 
            key={position.id}
            className="bg-white rounded-lg border shadow-sm space-y-4 p-4"
          >
            <div>
              <h3 className="text-lg font-medium text-slate-800">{position.label}</h3>
              <p className="text-sm text-slate-600">{position.description}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={control}
                name={`functionalAssessment.posturalTolerances.${position.id}.duration`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700">Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter duration in minutes"
                        className="bg-white"
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
                    <FormLabel className="text-slate-700">Frequency (times per day)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter frequency per day"
                        className="bg-white"
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
                  <FormLabel className="text-slate-700">Limitations & Observations</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe any limitations, pain, or other observations..."
                      className="min-h-[100px] bg-white"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
}