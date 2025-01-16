import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import type { AssessmentForm } from '@/types/form';

export function CurrentStatusAssessment() {
  const { control } = useFormContext<AssessmentForm>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Status Assessment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={control}
          name="currentStatus.generalNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>General Notes</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Any additional notes or observations about symptoms and their overall impact"
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <h3 className="font-medium">Cognitive Symptoms</h3>
          
          <FormField
            control={control}
            name="currentStatus.cognitive.attentionAndConcentration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Attention & Concentration</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Describe attention span, distractibility, multi-tasking abilities"
                    className="min-h-[100px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="currentStatus.cognitive.memory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Memory</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Describe memory issues, both short and long-term"
                    className="min-h-[100px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="currentStatus.cognitive.processingSpeed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Processing Speed</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Describe information processing speed and efficiency"
                    className="min-h-[100px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Emotional Symptoms</h3>
          
          <FormField
            control={control}
            name="currentStatus.emotional.mood"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mood</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Describe mood changes and emotional stability"
                    className="min-h-[100px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="currentStatus.emotional.anxiety"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Anxiety</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Describe anxiety levels and triggers"
                    className="min-h-[100px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="currentStatus.emotional.behavioralChanges"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Behavioral Changes</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Describe any changes in behavior or personality"
                    className="min-h-[100px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Physical Symptoms</h3>
          
          <FormField
            control={control}
            name="currentStatus.physical.pain"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pain</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Describe pain locations, intensity, and patterns"
                    className="min-h-[100px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="currentStatus.physical.sensoryChanges"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sensory Changes</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Describe any sensory changes or disturbances"
                    className="min-h-[100px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="currentStatus.physical.fatigue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fatigue</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Describe energy levels and fatigue patterns"
                    className="min-h-[100px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}