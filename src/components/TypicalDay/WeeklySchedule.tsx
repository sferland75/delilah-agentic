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
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, X, Calendar, CalendarDays, CalendarClock } from 'lucide-react';
import { useFieldArray } from 'react-hook-form';

interface WeeklyScheduleProps {
  control: Control<any>;
  prefix: string;
  title: string;
  description: string;
}

const DAYS_OF_WEEK = [
  { id: 'monday', label: 'Monday' },
  { id: 'tuesday', label: 'Tuesday' },
  { id: 'wednesday', label: 'Wednesday' },
  { id: 'thursday', label: 'Thursday' },
  { id: 'friday', label: 'Friday' },
  { id: 'saturday', label: 'Saturday' },
  { id: 'sunday', label: 'Sunday' },
];

export function WeeklySchedule({ control, prefix, title, description }: WeeklyScheduleProps) {
  const { fields: appointments, append: appendAppointment, remove: removeAppointment } = 
    useFieldArray({
      control,
      name: `${prefix}.appointments`
    });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-slate-800">{title}</h3>
        <p className="text-sm text-slate-600">{description}</p>
      </div>

      {/* Regular Weekly Activities */}
      {DAYS_OF_WEEK.map((day) => (
        <div key={day.id} className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <h4 className="font-medium text-slate-800">{day.label}</h4>
          </div>

          <FormField
            control={control}
            name={`${prefix}.${day.id}`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Regular Activities</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field}
                    placeholder={`Describe regular activities for ${day.label}...`}
                    className="min-h-[100px] bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`${prefix}.${day.id}Notes`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Notes & Challenges</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field}
                    placeholder="Describe any challenges, modifications needed, or other relevant details..."
                    className="min-h-[80px] bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ))}

      {/* Regular Appointments/Activities */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-blue-600" />
            <h4 className="font-medium text-slate-800">Regular Appointments & Activities</h4>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendAppointment({ 
              type: '', 
              frequency: '', 
              details: '' 
            })}
            className="text-blue-600 hover:text-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Activity/Appointment
          </Button>
        </div>

        {appointments.map((field, index) => (
          <div 
            key={field.id}
            className="border border-slate-200 rounded-lg p-4 space-y-4 relative bg-slate-50"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-slate-500 hover:text-slate-700"
              onClick={() => removeAppointment(index)}
            >
              <X className="h-4 w-4" />
            </Button>

            <FormField
              control={control}
              name={`${prefix}.appointments.${index}.type`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700">Activity/Appointment Type</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field}
                      placeholder="Type of activity or appointment..."
                      className="bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`${prefix}.appointments.${index}.frequency`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700">Frequency/Schedule</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field}
                      placeholder="How often or when scheduled..."
                      className="bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`${prefix}.appointments.${index}.details`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700">Details & Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field}
                      placeholder="Additional details, modifications needed, or other notes..."
                      className="bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}
      </div>

      {/* Schedule Notes */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <CalendarClock className="h-5 w-5 text-blue-600" />
          <h4 className="font-medium text-slate-800">Schedule Notes & Variations</h4>
        </div>
        <FormField
          control={control}
          name={`${prefix}.notes`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700">Additional Notes</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Add any notes about schedule variations, flexibility needed, or other important details..."
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