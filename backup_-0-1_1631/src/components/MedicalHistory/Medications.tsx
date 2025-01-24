import React from 'react';
import { Control } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';
import { useFieldArray } from 'react-hook-form';

interface MedicationsProps {
  control: Control<any>;
}

export function Medications({ control }: MedicationsProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "medicalHistory.medications"
  });

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div className="flex justify-between items-center">
          <FormLabel className="text-lg">Current Medications</FormLabel>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ 
              name: '', 
              dosage: '', 
              frequency: '',
              purpose: '' 
            })}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Medication
          </Button>
        </div>

        {fields.map((field, index) => (
          <div 
            key={field.id}
            className="grid grid-cols-2 gap-4 p-4 border rounded-lg relative"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => remove(index)}
            >
              <X className="h-4 w-4" />
            </Button>

            <FormField
              control={control}
              name={`medicalHistory.medications.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medication Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter medication name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`medicalHistory.medications.${index}.dosage`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dosage</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter dosage" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`medicalHistory.medications.${index}.frequency`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequency</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="How often taken" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`medicalHistory.medications.${index}.purpose`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purpose</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="What is it treating" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}

        {fields.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <p>No medications added yet.</p>
            <p className="text-sm">Click 'Add Medication' to start tracking medications.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}