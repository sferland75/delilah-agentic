import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';
import { useFieldArray } from 'react-hook-form';

interface SafetyAssessmentProps {
  control: Control<any>;
}

export function SafetyAssessment({ control }: SafetyAssessmentProps) {
  const { fields: hazards, append: appendHazard, remove: removeHazard } = useFieldArray({
    control,
    name: 'environmental.safety.hazards'
  });

  const { fields: recommendations, append: appendRecommendation, remove: removeRecommendation } = useFieldArray({
    control,
    name: 'environmental.safety.recommendations'
  });

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        {/* Hazards */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <FormLabel className="text-lg">Identified Hazards</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendHazard('')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Hazard
            </Button>
          </div>

          {hazards.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <FormField
                control={control}
                name={`environmental.safety.hazards.${index}`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Textarea {...field} placeholder="Describe safety hazard..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeHazard(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Features */}
        <FormField
          control={control}
          name="environmental.safety.features"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Safety Features</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Document existing safety features..."
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Concerns */}
        <FormField
          control={control}
          name="environmental.safety.concerns"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Safety Concerns</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Document safety concerns..."
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Recommendations */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <FormLabel className="text-lg">Safety Recommendations</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendRecommendation('')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Recommendation
            </Button>
          </div>

          {recommendations.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <FormField
                control={control}
                name={`environmental.safety.recommendations.${index}`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Textarea {...field} placeholder="Enter safety recommendation..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeRecommendation(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}