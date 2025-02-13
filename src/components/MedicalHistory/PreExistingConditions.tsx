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
<<<<<<< HEAD
import { 
  FaHistory, 
  FaHospital, 
  FaUsers, 
  FaAllergies 
} from 'react-icons/fa';
=======
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801

interface PreExistingConditionsProps {
  control: Control<any>;
}

export function PreExistingConditions({ control }: PreExistingConditionsProps) {
  return (
    <div className="space-y-6">
<<<<<<< HEAD
      <div className="flex items-center gap-2 mb-6">
        <FaHistory className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-medium text-slate-800">Pre-Existing Medical Conditions</h3>
      </div>

      <div className="space-y-6">
=======
      <div>
        <h3 className="text-lg font-medium text-slate-800">Pre-Existing Conditions</h3>
        <p className="text-sm text-slate-600 mb-4">Document medical conditions prior to the incident</p>
      </div>

      <div className="bg-white rounded-lg border shadow-sm p-4 space-y-6">
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
        <FormField
          control={control}
          name="medicalHistory.preExisting"
          render={({ field }) => (
            <FormItem>
<<<<<<< HEAD
              <div className="flex items-center gap-2 mb-1.5">
                <FaHistory className="h-4 w-4 text-blue-600" />
                <FormLabel className="text-slate-700 font-medium">Pre-Existing Medical Conditions</FormLabel>
              </div>
              <FormDescription className="text-slate-600 mb-2">
=======
              <FormLabel className="text-slate-700">Pre-Existing Medical Conditions</FormLabel>
              <FormDescription className="text-slate-600">
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
                Include diagnosis dates, treatments, and current status
              </FormDescription>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Document any pre-existing medical conditions..."
<<<<<<< HEAD
                  className="min-h-[100px] bg-white border-slate-200 focus:border-blue-300"
                />
              </FormControl>
              <FormMessage className="text-red-500" />
=======
                  className="min-h-[100px] bg-white"
                />
              </FormControl>
              <FormMessage />
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="medicalHistory.surgeries"
          render={({ field }) => (
            <FormItem>
<<<<<<< HEAD
              <div className="flex items-center gap-2 mb-1.5">
                <FaHospital className="h-4 w-4 text-blue-600" />
                <FormLabel className="text-slate-700 font-medium">Previous Surgeries</FormLabel>
              </div>
              <FormDescription className="text-slate-600 mb-2">
=======
              <FormLabel className="text-slate-700">Previous Surgeries</FormLabel>
              <FormDescription className="text-slate-600">
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
                List surgeries with dates and outcomes
              </FormDescription>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="List any previous surgeries and their dates..."
<<<<<<< HEAD
                  className="min-h-[100px] bg-white border-slate-200 focus:border-blue-300"
                />
              </FormControl>
              <FormMessage className="text-red-500" />
=======
                  className="min-h-[100px] bg-white"
                />
              </FormControl>
              <FormMessage />
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="medicalHistory.familyHistory"
          render={({ field }) => (
            <FormItem>
<<<<<<< HEAD
              <div className="flex items-center gap-2 mb-1.5">
                <FaUsers className="h-4 w-4 text-blue-600" />
                <FormLabel className="text-slate-700 font-medium">Relevant Family History</FormLabel>
              </div>
              <FormDescription className="text-slate-600 mb-2">
=======
              <FormLabel className="text-slate-700">Relevant Family History</FormLabel>
              <FormDescription className="text-slate-600">
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
                Note significant conditions in immediate family
              </FormDescription>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Document relevant family medical history..."
<<<<<<< HEAD
                  className="min-h-[100px] bg-white border-slate-200 focus:border-blue-300"
                />
              </FormControl>
              <FormMessage className="text-red-500" />
=======
                  className="min-h-[100px] bg-white"
                />
              </FormControl>
              <FormMessage />
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="medicalHistory.allergies"
          render={({ field }) => (
            <FormItem>
<<<<<<< HEAD
              <div className="flex items-center gap-2 mb-1.5">
                <FaAllergies className="h-4 w-4 text-blue-600" />
                <FormLabel className="text-slate-700 font-medium">Allergies and Sensitivities</FormLabel>
              </div>
              <FormDescription className="text-slate-600 mb-2">
=======
              <FormLabel className="text-slate-700">Allergies and Sensitivities</FormLabel>
              <FormDescription className="text-slate-600">
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
                Include reactions and severity
              </FormDescription>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="List any known allergies or sensitivities..."
<<<<<<< HEAD
                  className="min-h-[100px] bg-white border-slate-200 focus:border-blue-300"
                />
              </FormControl>
              <FormMessage className="text-red-500" />
=======
                  className="min-h-[100px] bg-white"
                />
              </FormControl>
              <FormMessage />
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}