import React, { useCallback, memo } from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Shield } from 'lucide-react';
import { environmentalConfigs } from './environmental-config';
import useEnvironmentalForm from '../../hooks/useEnvironmentalForm';

const HazardButton = memo(({ hazard, isSelected, onToggle }: { 
  hazard: string;
  isSelected: boolean;
  onToggle: () => void;
}) => (
  <Button
    variant={isSelected ? "default" : "outline"}
    size="sm"
    onClick={onToggle}
    type="button"
  >
    {hazard}
  </Button>
));

HazardButton.displayName = 'HazardButton';

const SafetyAssessment: React.FC = () => {
  const { control } = useFormContext();
  const { data, updateField } = useEnvironmentalForm();

  const hazards = data?.safety?.hazards || [];

  const toggleHazard = useCallback((hazard: string) => {
    const newHazards = hazards.includes(hazard)
      ? hazards.filter(h => h !== hazard)
      : [...hazards, hazard];
    
    updateField('safety.hazards', newHazards);
  }, [hazards, updateField]);

  return (
    <Card>
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
              <HazardButton
                key={hazard}
                hazard={hazard}
                isSelected={hazards.includes(hazard)}
                onToggle={() => toggleHazard(hazard)}
              />
            ))}
          </div>
        </div>

        {/* Safety Concerns */}
        <FormField
          control={control}
          name="environmental.safety.concerns"
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
};

export default memo(SafetyAssessment);