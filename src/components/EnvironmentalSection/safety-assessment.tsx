import { useFormContext } from 'react-hook-form';
import { useForm as useDelilahForm } from '@/context/FormContext';
import { Card, CardContent } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { environmentalConfigs } from './environmental-config';
import { Shield } from 'lucide-react';

export function SafetyAssessment() {
  const methods = useFormContext();
  const { control, watch, setValue } = methods;
  const { formData } = useDelilahForm();

  // Debug logging
  console.log('SafetyAssessment - safety data:', formData?.environmental?.safety);

  const currentHazards = watch('environmental.safety.hazards') || formData?.environmental?.safety?.hazards || [];

  const toggleHazard = (hazard: string) => {
    const newHazards = currentHazards.includes(hazard)
      ? currentHazards.filter(h => h !== hazard)
      : [...currentHazards, hazard];
    setValue('environmental.safety.hazards', newHazards, {
      shouldValidate: true
    });
  };

  return (
    <Card className="mt-8">
      <CardContent className="space-y-6 pt-6">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-4 w-4 text-blue-600" />
          <h4 className="font-medium text-slate-800">Safety Assessment</h4>
        </div>

        {/* Common Hazards */}
        <div className="space-y-4">
          <FormLabel className="text-slate-700">Common Hazards</FormLabel>
          <div className="flex flex-wrap gap-2">
            {environmentalConfigs.commonHazards.map((hazard) => (
              <Button
                key={hazard}
                variant={currentHazards.includes(hazard) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleHazard(hazard)}
                type="button"
              >
                {hazard}
              </Button>
            ))}
          </div>
        </div>

        {/* Safety Concerns */}
        <FormField
          control={control}
          name="environmental.safety.concerns"
          defaultValue={formData?.environmental?.safety?.concerns}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700">Safety Concerns</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Describe any safety concerns in detail..."
                  className="min-h-[100px] bg-white"
                />
              </FormControl>
              <FormDescription className="text-slate-500">
                Document specific safety issues and risks
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Recommendations */}
        <FormField
          control={control}
          name="environmental.safety.recommendations"
          defaultValue={formData?.environmental?.safety?.recommendations}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700">Safety Recommendations</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="List safety recommendations and suggested modifications..."
                  className="min-h-[100px] bg-white"
                />
              </FormControl>
              <FormDescription className="text-slate-500">
                Provide specific recommendations for improving safety
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}