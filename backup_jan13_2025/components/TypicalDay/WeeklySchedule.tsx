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
import { Plus, X } from 'lucide-react';
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
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="text-sm text-slate-600">{description}</p>
        </div>

        {DAYS_OF_WEEK.map((day) => (
          <div key={day.id} className="space-y-4">
            <FormField
              control={control}
              name={`${prefix}.${day.id}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{day.label}</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field}
                      placeholder={`Describe regular activities for ${day.label}...`}
                      className="min-h-[100px]"
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
                  <FormLabel>Notes & Challenges</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field}
                      placeholder="Describe any challenges, modifications needed, or other relevant details..."
                      className="min-h-[80px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <FormLabel className="text-lg">Regular Appointments & Activities</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendAppointment({ 
                type: '', 
                frequency: '', 
                details: '' 
              })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Activity/Appointment
            </Button>
          </div>

          {appointments.map((field, index) => (
            <div 
              key={field.id}
              className="grid grid-cols-1 gap-4 p-4 border rounded-lg relative"
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => removeAppointment(index)}
              >
                <X className="h-4 w-4" />
              </Button>

              <FormField
                control={control}
                name={`${prefix}.appointments.${index}.type`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Activity/Appointment Type</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field}
                        placeholder="Type of activity or appointment..."
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
                    <FormLabel>Frequency/Schedule</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field}
                        placeholder="How often or when scheduled..."
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
                    <FormLabel>Details & Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field}
                        placeholder="Additional details, modifications needed, or other notes..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>

        <FormField
          control={control}
          name={`${prefix}.notes`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Schedule Notes & Variations</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Add any notes about schedule variations, flexibility needed, or other important details..."
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