import React from 'react';
import { Control, useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaPills, FaSyringe, FaBookMedical, FaClock, FaNotesMedical, FaPlusCircle, FaTrash } from 'react-icons/fa';

interface MedicationsProps {
  control: Control<any>;
}

export function Medications({ control }: MedicationsProps) {
  const { watch, setValue } = useFormContext();
  const medical = watch('medical');

  const addMedication = () => {
    const currentMeds = medical?.medications || [];
    setValue('medical.medications', [
      ...currentMeds,
      { name: '', dosage: '', frequency: '', purpose: '' }
    ]);
  };

  const removeMedication = (index: number) => {
    const currentMeds = medical?.medications || [];
    setValue(
      'medical.medications',
      currentMeds.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-slate-800">Medications</h3>
        <p className="text-sm text-slate-600 mb-4">Document current medications and their details</p>
      </div>

      <div className="bg-white rounded-lg border shadow-sm p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <FaPills className="h-5 w-5 text-blue-500" />
            <h4 className="text-lg font-medium">Current Medications</h4>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={addMedication}
            className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
          >
            <FaPlusCircle className="h-4 w-4" />
            Add Medication
          </Button>
        </div>

        <div className="space-y-6">
          {(medical?.medications || []).map((_, index) => (
            <div key={index} className="relative p-4 border rounded-lg">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 text-blue-500 hover:text-blue-600"
                onClick={() => removeMedication(index)}
              >
                <FaTrash className="h-4 w-4" />
              </Button>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name={`medical.medications.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FaSyringe className="h-4 w-4 text-blue-500" />
                        <FormLabel className="text-slate-700">Medication Name</FormLabel>
                      </div>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter medication name"
                          className="bg-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`medical.medications.${index}.dosage`}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FaBookMedical className="h-4 w-4 text-blue-500" />
                        <FormLabel className="text-slate-700">Dosage</FormLabel>
                      </div>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter dosage"
                          className="bg-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`medical.medications.${index}.frequency`}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FaClock className="h-4 w-4 text-blue-500" />
                        <FormLabel className="text-slate-700">Frequency</FormLabel>
                      </div>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="How often taken"
                          className="bg-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`medical.medications.${index}.purpose`}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FaNotesMedical className="h-4 w-4 text-blue-500" />
                        <FormLabel className="text-slate-700">Purpose</FormLabel>
                      </div>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="What it's for"
                          className="bg-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
          
          {(!medical?.medications || medical.medications.length === 0) && (
            <div className="text-center py-8 text-slate-500">
              No medications added. Click "Add Medication" to begin.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}