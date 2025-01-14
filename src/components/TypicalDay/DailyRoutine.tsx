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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, Sun, Sunset, Moon } from 'lucide-react';

interface DailyRoutineProps {
  control: Control<any>;
  prefix: string;
  title: string;
  description: string;
}

const TIME_PERIODS = [
  { 
    id: 'morning', 
    label: 'Morning Routine (Wake up - Noon)', 
    description: 'Activities from waking up until noon',
    icon: Sun
  },
  { 
    id: 'afternoon', 
    label: 'Afternoon Activities (Noon - 5pm)', 
    description: 'Activities during afternoon hours',
    icon: Clock
  },
  { 
    id: 'evening', 
    label: 'Evening Routine (5pm - Bedtime)', 
    description: 'Activities from evening until bedtime',
    icon: Sunset
  },
  { 
    id: 'night', 
    label: 'Night (Sleep/Interruptions)', 
    description: 'Sleep patterns and any night-time interruptions',
    icon: Moon
  }
];

export function DailyRoutine({ control, prefix, title, description }: DailyRoutineProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-slate-800">{title}</h3>
        <p className="text-sm text-slate-600">{description}</p>
      </div>

      {/* Sleep Schedule */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          <h4 className="font-medium text-slate-800">Sleep Schedule</h4>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={control}
            name={`${prefix}.sleepSchedule.wakeTime`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Typical Wake Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} className="bg-white" />
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
                <FormLabel className="text-slate-700">Typical Bed Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} className="bg-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Daily Routines by Time Period */}
      {TIME_PERIODS.map((period) => {
        const Icon = period.icon;
        return (
          <div key={period.id} className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="h-5 w-5 text-blue-600" />
              <div>
                <h4 className="font-medium text-slate-800">{period.label}</h4>
                <p className="text-sm text-slate-600">{period.description}</p>
              </div>
            </div>

            <FormField
              control={control}
              name={`${prefix}.routines.${period.id}.activities`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700">Activities</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field}
                      placeholder={`Describe ${period.id} activities and routines...`}
                      className="min-h-[100px] bg-white"
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
                  <FormLabel className="text-slate-700">Challenges & Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field}
                      placeholder="Describe any challenges, assistance needed, or other relevant details..."
                      className="min-h-[100px] bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      })}

      {/* Overall Notes */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-4">
        <FormField
          control={control}
          name={`${prefix}.generalNotes`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700">General Notes & Observations</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Add any additional notes about daily routines, variations, or important observations..."
                  className="min-h-[100px] bg-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}