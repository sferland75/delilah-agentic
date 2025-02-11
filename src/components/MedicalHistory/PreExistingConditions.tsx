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
import { 
  FaHistory, 
  FaHospital, 
  FaUsers, 
  FaAllergies 
} from 'react-icons/fa';

interface PreExistingConditionsProps {
  control: Control<any>;
}

export function PreExistingConditions({ control }: PreExistingConditionsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <FaHistory className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-medium text-slate-800">Pre-Existing Medical Conditions</h3>
      </div>

      <div className="space-y-6">
        <FormField
          control={control}
          name="medicalHistory.preExisting"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2 mb-1.5">
                <FaHistory className="h-4 w-4 text-blue-600" />
                <FormLabel className="text-slate-700 font-medium">Pre-Existing Medical Conditions</FormLabel>
              </div>
              <FormDescription className="text-slate-600 mb-2">
                Include diagnosis dates, treatments, and current status
              </FormDescription>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Document any pre-existing medical conditions..."
                  className="min-h-[100px] bg-white border-slate-200 focus:border-blue-300"
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="medicalHistory.surgeries"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2 mb-1.5">
                <FaHospital className="h-4 w-4 text-blue-600" />
                <FormLabel className="text-slate-700 font-medium">Previous Surgeries</FormLabel>
              </div>
              <FormDescription className="text-slate-600 mb-2">
                List surgeries with dates and outcomes
              </FormDescription>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="List any previous surgeries and their dates..."
                  className="min-h-[100px] bg-white border-slate-200 focus:border-blue-300"
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="medicalHistory.familyHistory"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2 mb-1.5">
                <FaUsers className="h-4 w-4 text-blue-600" />
                <FormLabel className="text-slate-700 font-medium">Relevant Family History</FormLabel>
              </div>
              <FormDescription className="text-slate-600 mb-2">
                Note significant conditions in immediate family
              </FormDescription>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Document relevant family medical history..."
                  className="min-h-[100px] bg-white border-slate-200 focus:border-blue-300"
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="medicalHistory.allergies"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2 mb-1.5">
                <FaAllergies className="h-4 w-4 text-blue-600" />
                <FormLabel className="text-slate-700 font-medium">Allergies and Sensitivities</FormLabel>
              </div>
              <FormDescription className="text-slate-600 mb-2">
                Include reactions and severity
              </FormDescription>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="List any known allergies or sensitivities..."
                  className="min-h-[100px] bg-white border-slate-200 focus:border-blue-300"
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}