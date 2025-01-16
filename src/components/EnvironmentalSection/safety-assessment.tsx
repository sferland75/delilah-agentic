import { useFormContext } from 'react-hook-form';
import { Card, CardContent } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { AssessmentForm } from '@/types/form';

const COMMON_HAZARDS = [
  'Uneven Surfaces',
  'Poor Lighting',
  'Loose Rugs',
  'Cluttered Pathways',
  'Unstable Furniture',
  'Exposed Wiring',
  'Steep Stairs',
  'Slippery Surfaces',
  'Missing Handrails',
  'Poor Ventilation'
] as const;

export function SafetyAssessment() {
  const { control, watch, setValue } = useFormContext<AssessmentForm>();
  const currentHazards = watch('environmentalAssessment.safety.hazards') || [];

  const addHazard = (hazard: string) => {
    if (!currentHazards.includes(hazard)) {
      setValue('environmentalAssessment.safety.hazards', [...currentHazards, hazard], {
        shouldValidate: true
      });
    }
  };

  const removeHazard = (hazard: string) => {
    setValue(
      'environmentalAssessment.safety.hazards',
      currentHazards.filter(h => h !== hazard),
      { shouldValidate: true }
    );
  };

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Common Hazards</h3>
          <div className="flex flex-wrap gap-2">
            {COMMON_HAZARDS.map((hazard) => (
              <Button
                key={hazard}
                variant={currentHazards.includes(hazard) ? "default" : "outline"}
                size="sm"
                onClick={() => currentHazards.includes(hazard) ? removeHazard(hazard) : addHazard(hazard)}
                type="button"
              >
                {hazard}
              </Button>
            ))}
          </div>
        </div>

        <FormField
          control={control}
          name="environmentalAssessment.safety.concerns"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Safety Concerns</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Describe any safety concerns"
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="environmentalAssessment.safety.features"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Existing Safety Features</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="List existing safety features"
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="environmentalAssessment.safety.recommendations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Safety Recommendations</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Enter safety recommendations"
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
