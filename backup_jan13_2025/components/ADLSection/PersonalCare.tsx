import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

interface PersonalCareProps {
  control: Control<any>;
}

const INDEPENDENCE_LEVELS = [
  { value: 'independent', label: 'Independent' },
  { value: 'supervision', label: 'Supervision Required' },
  { value: 'minimal', label: 'Minimal Assistance' },
  { value: 'moderate', label: 'Moderate Assistance' },
  { value: 'maximal', label: 'Maximal Assistance' },
  { value: 'dependent', label: 'Dependent' }
];

const ADL_TASKS = [
  { id: 'dressing', label: 'Dressing', description: 'Ability to dress upper and lower body' },
  { id: 'bathing', label: 'Bathing/Showering', description: 'Ability to wash body, transfer in/out' },
  { id: 'grooming', label: 'Grooming', description: 'Hair, teeth, face care' },
  { id: 'toileting', label: 'Toileting', description: 'Using toilet, cleaning self' },
  { id: 'feeding', label: 'Feeding', description: 'Eating and drinking' },
  { id: 'transfers', label: 'Transfers', description: 'Moving between surfaces' }
];

export function PersonalCare({ control }: PersonalCareProps) {
  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        {ADL_TASKS.map((task) => (
          <div key={task.id} className="space-y-4">
            <div>
              <h3 className="text-base font-medium">{task.label}</h3>
              <p className="text-sm text-slate-600">{task.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name={`adl.personalCare.${task.id}.level`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Independence Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {INDEPENDENCE_LEVELS.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`adl.personalCare.${task.id}.notes`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Additional notes or observations..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}