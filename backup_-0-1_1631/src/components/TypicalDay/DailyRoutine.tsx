import React from 'react';
import { Control } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface DailyRoutineProps {
  control: Control<any>;
  prefix: string;
  title: string;
  description: string;
}

const TIME_PERIODS = [
  { id: 'morning', label: 'Morning Routine (Wake up - Noon)', description: 'Activities from waking up until noon' },
  { id: 'afternoon', label: 'Afternoon Activities (Noon - 5pm)', description: 'Activities during afternoon hours' },
  { id: 'evening', label: 'Evening Routine (5pm - Bedtime)', description: 'Activities from evening until bedtime' },
  { id: 'night', label: 'Night (Sleep/Interruptions)', description: 'Sleep patterns and any night-time interruptions' }
];

export function DailyRoutine({ control, prefix, title, description }: DailyRoutineProps) {
  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="text-sm text-slate-600">{description}</p>
        </div>

        {/* Sleep Schedule */}
        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={control}
            name={`${prefix}.sleepSchedule.wakeTime`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Typical Wake Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`${prefix}.sleepSchedule.bedTime`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Typical Bed Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Daily Routines by Time Period */}
        {TIME_PERIODS.map((period) => (
          <div key={period.id} className="space-y-4">
            <div>
              <h3 className="text-base font-medium">{period.label}</h3>
              <p className="text-sm text-slate-600">{period.description}</p>
            </div>

            <FormField
              control={control}
              name={`${prefix}.routines.${period.id}.activities`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activities</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field}
                      placeholder={`Describe ${period.id} activities and routines...`}
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`${prefix}.routines.${period.id}.challenges`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Challenges & Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field}
                      placeholder="Describe any challenges, assistance needed, or other relevant details..."
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}

        {/* Overall Notes */}
        <FormField
          control={control}
          name={`${prefix}.generalNotes`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>General Notes & Observations</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Add any additional notes about daily routines, variations, or important observations..."
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