import React from 'react';
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";

interface CareActivityProps {
  form: UseFormReturn<any>;
  path: string;
  label: string;
  description?: string;
}

export const CareActivity = ({ form, path, label, description }: CareActivityProps) => {
  const minutesPath = `${path}.minutes`;
  const timesPerWeekPath = `${path}.timesPerWeek`;
  const totalMinutesPath = `${path}.totalMinutes`;

  // Function to calculate and update total
  const updateTotal = React.useCallback(() => {
    const minutes = Number(form.getValues(minutesPath)) || 0;
    const timesPerWeek = Number(form.getValues(timesPerWeekPath)) || 0;
    const total = minutes * timesPerWeek;

    form.setValue(totalMinutesPath, total, { shouldDirty: true });
  }, [form, minutesPath, timesPerWeekPath, totalMinutesPath]);

  // Setup watchers and initial calculation
  React.useEffect(() => {
    // Initial calculation
    updateTotal();

    // Watch for changes to input fields
    const subscription = form.watch((value, { name }) => {
      if (name === minutesPath || name === timesPerWeekPath) {
        updateTotal();
      }
    });

    return () => subscription.unsubscribe();
  }, [updateTotal, form, minutesPath, timesPerWeekPath]);

  return (
    <div className="grid grid-cols-3 gap-4 items-start">
      <div className="col-span-3">
        <FormLabel className="text-sm font-medium">
          {label}
          {description && (
            <span className="block text-xs text-muted-foreground mt-1">
              {description}
            </span>
          )}
        </FormLabel>
      </div>
      
      <FormField
        control={form.control}
        name={minutesPath}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Minutes</FormLabel>
            <Input 
              type="number" 
              min="0"
              {...field}
              value={field.value || ''}
              onChange={(e) => {
                field.onChange(e.target.value === '' ? '' : Number(e.target.value));
              }}
            />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={timesPerWeekPath}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Times per Week</FormLabel>
            <Input 
              type="number"
              min="0"
              {...field}
              value={field.value || ''}
              onChange={(e) => {
                field.onChange(e.target.value === '' ? '' : Number(e.target.value));
              }}
            />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={totalMinutesPath}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Total Minutes/Week</FormLabel>
            <Input 
              type="number"
              readOnly
              className="bg-muted"
              {...field}
              value={field.value || 0}
            />
          </FormItem>
        )}
      />
    </div>
  );
};