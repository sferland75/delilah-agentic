import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { type Assessment } from '@/types';

interface ClinicalObservationsProps {
  fieldName: string;
  label?: string;
  description?: string;
}

export function ClinicalObservations({ 
  fieldName,
  label = "Clinical Observations",
  description = "Document quality of movement, compensations, and safety concerns"
}: ClinicalObservationsProps) {
  const { control } = useFormContext<Assessment>();

  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700">{label}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={description}
              className="resize-none min-h-[100px] bg-white border-gray-200 hover:border-blue-200 transition-colors"
              {...field}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}