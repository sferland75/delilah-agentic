import React from 'react';
import { Control } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

interface PreExistingConditionsProps {
  control: Control<any>;
}

export function PreExistingConditions({ control }: PreExistingConditionsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-slate-800">Pre-Existing Conditions</h3>
        <p className="text-sm text-slate-600 mb-4">Document medical conditions prior to the incident</p>
      </div>

      <div className="bg-white rounded-lg border shadow-sm p-4 space-y-6">
        <FormField
          control={control}
          name="medicalHistory.preExisting"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700">Pre-Existing Medical Conditions</FormLabel>
              <FormDescription className="text-slate-600">
                Include diagnosis dates, treatments, and current status
              </FormDescription>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Document any pre-existing medical conditions..."
                  className="min-h-[100px] bg-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="medicalHistory.surgeries"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700">Previous Surgeries</FormLabel>
              <FormDescription className="text-slate-600">
                List surgeries with dates and outcomes
              </FormDescription>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="List any previous surgeries and their dates..."
                  className="min-h-[100px] bg-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="medicalHistory.familyHistory"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700">Relevant Family History</FormLabel>
              <FormDescription className="text-slate-600">
                Note significant conditions in immediate family
              </FormDescription>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Document relevant family medical history..."
                  className="min-h-[100px] bg-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="medicalHistory.allergies"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700">Allergies and Sensitivities</FormLabel>
              <FormDescription className="text-slate-600">
                Include reactions and severity
              </FormDescription>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="List any known allergies or sensitivities..."
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