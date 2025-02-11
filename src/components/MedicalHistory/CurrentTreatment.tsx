import React from 'react';
import { Control, useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  FaUserMd, 
  FaHospital, 
  FaUserNurse, 
  FaCalendarAlt, 
  FaListAlt,
  FaPlusCircle,
  FaTrash,
  FaStethoscope
} from 'react-icons/fa';

interface CurrentTreatmentProps {
  control: Control<any>;
}

export function CurrentTreatment({ control }: CurrentTreatmentProps) {
  const { watch, setValue } = useFormContext();
  const medical = watch('medical');

  const addTreatmentProvider = () => {
    const currentTreatments = medical?.treatments || [];
    setValue('medical.treatments', [
      ...currentTreatments,
      { 
        providerName: '',
        company: '',
        profession: '',
        frequency: '',
        focus: ''
      }
    ]);
  };

  const removeTreatmentProvider = (index: number) => {
    const currentTreatments = medical?.treatments || [];
    setValue(
      'medical.treatments',
      currentTreatments.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <FaStethoscope className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-medium text-slate-800">Current Treatment Providers</h3>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <FormDescription className="text-slate-600">
            Document all healthcare providers currently involved in treatment
          </FormDescription>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={addTreatmentProvider}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300"
          >
            <FaPlusCircle className="h-4 w-4" />
            Add Provider
          </Button>
        </div>

        <div className="space-y-6">
          {(medical?.treatments || []).map((_, index) => (
            <div key={index} className="relative p-6 border rounded-lg bg-white/50 border-slate-200">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                onClick={() => removeTreatmentProvider(index)}
              >
                <FaTrash className="h-4 w-4" />
              </Button>

              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={control}
                  name={`medical.treatments.${index}.providerName`}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2 mb-1.5">
                        <FaUserMd className="h-4 w-4 text-blue-600" />
                        <FormLabel className="text-slate-700 font-medium">Provider Name</FormLabel>
                      </div>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter provider name"
                          className="bg-white border-slate-200 focus:border-blue-300"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`medical.treatments.${index}.company`}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2 mb-1.5">
                        <FaHospital className="h-4 w-4 text-blue-600" />
                        <FormLabel className="text-slate-700 font-medium">Company/Clinic</FormLabel>
                      </div>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter clinic or company name"
                          className="bg-white border-slate-200 focus:border-blue-300"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`medical.treatments.${index}.profession`}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2 mb-1.5">
                        <FaUserNurse className="h-4 w-4 text-blue-600" />
                        <FormLabel className="text-slate-700 font-medium">Profession/Specialty</FormLabel>
                      </div>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., Physiotherapist, OT"
                          className="bg-white border-slate-200 focus:border-blue-300"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`medical.treatments.${index}.frequency`}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2 mb-1.5">
                        <FaCalendarAlt className="h-4 w-4 text-blue-600" />
                        <FormLabel className="text-slate-700 font-medium">Treatment Frequency</FormLabel>
                      </div>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., Weekly, Bi-weekly"
                          className="bg-white border-slate-200 focus:border-blue-300"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`medical.treatments.${index}.focus`}
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <div className="flex items-center gap-2 mb-1.5">
                        <FaListAlt className="h-4 w-4 text-blue-600" />
                        <FormLabel className="text-slate-700 font-medium">Treatment Focus</FormLabel>
                      </div>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Current treatment goals and focus areas"
                          className="bg-white border-slate-200 focus:border-blue-300"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
          
          {(!medical?.treatments || medical.treatments.length === 0) && (
            <div className="text-center py-8 text-slate-500 bg-slate-50/50 border border-dashed border-slate-200 rounded-lg">
              No treatment providers added. Click "Add Provider" to begin.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}