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
  FaHeartbeat, 
  FaBrain, 
  FaPrescriptionBottleAlt, 
  FaUserMd, 
  FaWalking, 
  FaRunning 
} from 'react-icons/fa';

interface PreAccidentHistoryProps {
  control: Control<any>;
}

export function PreAccidentHistory({ control }: PreAccidentHistoryProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <FaHeartbeat className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-medium text-slate-800">Pre-Accident Health Status</h3>
      </div>

      <div className="space-y-6">
        <FormField
          control={control}
          name="medicalHistory.preAccident.physicalHealth"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2 mb-1.5">
                <FaHeartbeat className="h-4 w-4 text-blue-600" />
                <FormLabel className="text-slate-700 font-medium">Physical Health Status</FormLabel>
              </div>
              <FormDescription className="text-slate-600 mb-2">
                Describe overall physical health, fitness level, and any ongoing health concerns before the accident
              </FormDescription>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Document physical health status prior to accident..."
                  className="min-h-[100px] bg-white border-slate-200 focus:border-blue-300"
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="medicalHistory.preAccident.mentalHealth"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2 mb-1.5">
                <FaBrain className="h-4 w-4 text-blue-600" />
                <FormLabel className="text-slate-700 font-medium">Mental Health Status</FormLabel>
              </div>
              <FormDescription className="text-slate-600 mb-2">
                Note any pre-existing mental health conditions, stress levels, or psychological treatments
              </FormDescription>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Document mental health status prior to accident..."
                  className="min-h-[100px] bg-white border-slate-200 focus:border-blue-300"
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="medicalHistory.preAccident.medications"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2 mb-1.5">
                <FaPrescriptionBottleAlt className="h-4 w-4 text-blue-600" />
                <FormLabel className="text-slate-700 font-medium">Pre-Accident Medications</FormLabel>
              </div>
              <FormDescription className="text-slate-600 mb-2">
                List all medications, dosages, and frequency of use before the accident
              </FormDescription>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="List medications taken prior to accident..."
                  className="min-h-[100px] bg-white border-slate-200 focus:border-blue-300"
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="medicalHistory.preAccident.treatments"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2 mb-1.5">
                <FaUserMd className="h-4 w-4 text-blue-600" />
                <FormLabel className="text-slate-700 font-medium">Pre-Accident Treatments/Therapies</FormLabel>
              </div>
              <FormDescription className="text-slate-600 mb-2">
                Detail any ongoing treatments, therapies, or medical care before the accident
              </FormDescription>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Document treatments or therapies prior to accident..."
                  className="min-h-[100px] bg-white border-slate-200 focus:border-blue-300"
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="medicalHistory.preAccident.functionalStatus"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2 mb-1.5">
                <FaWalking className="h-4 w-4 text-blue-600" />
                <FormLabel className="text-slate-700 font-medium">Functional Status</FormLabel>
              </div>
              <FormDescription className="text-slate-600 mb-2">
                Describe daily activities, work capacity, and any functional limitations before the accident
              </FormDescription>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Document functional status prior to accident..."
                  className="min-h-[100px] bg-white border-slate-200 focus:border-blue-300"
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="medicalHistory.preAccident.activities"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2 mb-1.5">
                <FaRunning className="h-4 w-4 text-blue-600" />
                <FormLabel className="text-slate-700 font-medium">Activities and Sports Participation</FormLabel>
              </div>
              <FormDescription className="text-slate-600 mb-2">
                List regular physical activities, sports, hobbies, and frequency of participation
              </FormDescription>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Document activities and sports participation prior to accident..."
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