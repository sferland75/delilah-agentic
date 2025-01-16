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
import { Checkbox } from "@/components/ui/checkbox";

interface DailyRoutineProps {
  control: Control<any>;
  prefix: string;
  title: string;
  description: string;
}

const WAKE_TIMES = [
  '5:00', '5:30', '6:00', '6:30', '7:00', '7:30', '8:00', '8:30', '9:00', '9:30', '10:00'
];

const BED_TIMES = [
  '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30', '00:00'
];

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

// Format 24hr time to 12hr display
const formatTimeDisplay = (time: string) => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export function DailyRoutine({ control, prefix, title, description }: DailyRoutineProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-slate-800">{title}</h3>
        <p className="text-sm text-slate-600">{description}</p>
      </div>

      {/* Irregular Schedule Checkbox */}
      <FormField
        control={control}
        name={`${prefix}.hasIrregularSchedule`}
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="text-slate-700">
                Irregular/Variable Schedule
              </FormLabel>
              <p className="text-sm text-slate-600">
                Check this if sleep/wake times vary significantly or don't follow a typical pattern
              </p>
            </div>
          </FormItem>
        )}
      />

      {/* Sleep Schedule */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          <h4 className="font-medium text-slate-800">Sleep Schedule</h4>
        </div>

        <FormField
          control={control}
          name={`${prefix}.hasIrregularSchedule`}
          render={({ field }) => (
            <>
              {field.value ? (
                <div className="space-y-4">
                  <FormField
                    control={control}
                    name={`${prefix}.irregularSchedule.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700">Describe Sleep Pattern</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Describe your typical sleep patterns, including when you usually sleep and wake, how it varies, and any relevant factors..."
                            className="min-h-[100px] bg-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`${prefix}.irregularSchedule.factors`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700">Factors Affecting Schedule</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="What influences your sleep schedule? (e.g., work shifts, health conditions, caregiving duties)..."
                            className="min-h-[100px] bg-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ) : (
                <div className="space-y-6">
                  <FormField
                    control={control}
                    name={`${prefix}.sleepSchedule.wakeTime`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700">Typical Wake Time</FormLabel>
                        <div className="space-y-2">
                          <FormControl>
                            <Input 
                              type="time" 
                              {...field} 
                              className="bg-white mb-2" 
                              placeholder="Select or type time..."
                            />
                          </FormControl>
                          <div className="flex flex-wrap gap-2">
                            {WAKE_TIMES.map((time) => (
                              <button
                                key={time}
                                type="button"
                                onClick={() => field.onChange(time)}
                                className={`px-3 py-1 rounded-md text-sm ${
                                  field.value === time 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                }`}
                              >
                                {formatTimeDisplay(time)}
                              </button>
                            ))}
                          </div>
                        </div>
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
                        <div className="space-y-2">
                          <FormControl>
                            <Input 
                              type="time" 
                              {...field} 
                              className="bg-white mb-2" 
                              placeholder="Select or type time..."
                            />
                          </FormControl>
                          <div className="flex flex-wrap gap-2">
                            {BED_TIMES.map((time) => (
                              <button
                                key={time}
                                type="button"
                                onClick={() => field.onChange(time)}
                                className={`px-3 py-1 rounded-md text-sm ${
                                  field.value === time 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                }`}
                              >
                                {formatTimeDisplay(time)}
                              </button>
                            ))}
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </>
          )}
        />
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