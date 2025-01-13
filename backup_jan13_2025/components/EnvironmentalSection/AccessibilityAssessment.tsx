import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { ACCESSIBILITY_LEVELS } from '@/lib/validation/assessment-schema';

interface AccessibilityAssessmentProps {
  control: Control<any>;
}

const AREAS = [
  { id: 'entrance', label: 'Entrance Access' },
  { id: 'bathroom', label: 'Bathroom Accessibility' },
  { id: 'bedroom', label: 'Bedroom Access' },
  { id: 'kitchen', label: 'Kitchen Accessibility' },
  { id: 'living', label: 'Living Areas' },
  { id: 'hallways', label: 'Hallways & Transitions' },
  { id: 'stairs', label: 'Stairs & Steps' }
];

export function AccessibilityAssessment({ control }: AccessibilityAssessmentProps) {
  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        {AREAS.map((area) => (
          <div key={area.id} className="space-y-4">
            <h3 className="font-medium">{area.label}</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name={`environmental.accessibility.${area.id}.level`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Accessibility Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(ACCESSIBILITY_LEVELS).map(([key, value]) => (
                          <SelectItem key={key} value={key}>{value}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`environmental.accessibility.${area.id}.notes`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder={`Notes about ${area.label.toLowerCase()}...`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={control}
              name={`environmental.accessibility.${area.id}.modifications`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Required Modifications</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="List required modifications..."
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}