import React from 'react';
import { UseFormReturn } from "react-hook-form";
<<<<<<< HEAD
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
=======
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801

interface CareActivityProps {
  form: UseFormReturn<any>;
  path: string;
  label: string;
  description?: string;
}

<<<<<<< HEAD
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
=======
export function CareActivity({ form, path, label, description }: CareActivityProps) {
  const basePath = `care.${path}`;

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name={`${basePath}.type`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            {description && (
              <FormDescription className="text-slate-500">
                {description}
              </FormDescription>
            )}
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select type of assistance" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="independent">Independent</SelectItem>
                <SelectItem value="supervision">Supervision Required</SelectItem>
                <SelectItem value="minimal">Minimal Assistance</SelectItem>
                <SelectItem value="moderate">Moderate Assistance</SelectItem>
                <SelectItem value="maximal">Maximal Assistance</SelectItem>
                <SelectItem value="dependent">Dependent</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
<<<<<<< HEAD
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
=======
        name={`${basePath}.frequency`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Frequency</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="asNeeded">As Needed</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
<<<<<<< HEAD
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
=======
        name={`${basePath}.notes`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Notes</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Add any relevant notes..."
                className="min-h-[80px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
          </FormItem>
        )}
      />
    </div>
  );
<<<<<<< HEAD
};
=======
}
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
