import React from 'react';
import { UseFormReturn } from "react-hook-form";
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

interface CareActivityProps {
  form: UseFormReturn<any>;
  path: string;
  label: string;
  description?: string;
}

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
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
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
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
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
          </FormItem>
        )}
      />
    </div>
  );
}