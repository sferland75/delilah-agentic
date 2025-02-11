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
import { Input } from "@/components/ui/input";
import { Textarea } from '@/components/ui/textarea';
import { FaNotesMedical, FaRegCalendarAlt, FaFileMedicalAlt, FaClipboardList } from 'react-icons/fa';

interface InjuryMechanismProps {
  control: Control<any>;
}

export function InjuryMechanism({ control }: InjuryMechanismProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-slate-800">Injury Details</h3>
        <p className="text-sm text-slate-600 mb-4">Document information about the injury and its mechanism</p>
      </div>

      <div className="bg-white rounded-lg border shadow-sm p-4 space-y-6">
        <FormField
          control={control}
          name="medical.injury.circumstance"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2 mb-1.5">
                <FaNotesMedical className="h-4 w-4 text-blue-500" />
                <FormLabel className="text-slate-700">Circumstance of Injury</FormLabel>
              </div>
              <FormDescription className="text-slate-600">
                Describe how the injury occurred
              </FormDescription>
              <FormControl>
                <Textarea
                  {...field}
                  className="min-h-[100px] bg-white"
                  placeholder="Describe the circumstances leading to the injury..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="medical.injury.date"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2 mb-1.5">
                <FaRegCalendarAlt className="h-4 w-4 text-blue-500" />
                <FormLabel className="text-slate-700">Date of Injury</FormLabel>
              </div>
              <FormDescription className="text-slate-600">
                When did the injury occur?
              </FormDescription>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  className="bg-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="medical.injury.description"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2 mb-1.5">
                <FaFileMedicalAlt className="h-4 w-4 text-blue-500" />
                <FormLabel className="text-slate-700">Injury Description</FormLabel>
              </div>
              <FormDescription className="text-slate-600">
                Detailed description of the injury and initial impact
              </FormDescription>
              <FormControl>
                <Textarea
                  {...field}
                  className="min-h-[100px] bg-white"
                  placeholder="Describe the nature and extent of the injury..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="medical.injury.notes"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2 mb-1.5">
                <FaClipboardList className="h-4 w-4 text-blue-500" />
                <FormLabel className="text-slate-700">Additional Notes</FormLabel>
              </div>
              <FormDescription className="text-slate-600">
                Any other relevant information about the injury
              </FormDescription>
              <FormControl>
                <Textarea
                  {...field}
                  className="min-h-[100px] bg-white"
                  placeholder="Add any additional notes about the injury..."
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