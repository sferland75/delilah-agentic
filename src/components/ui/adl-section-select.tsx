import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import type { AssessmentFormData } from '../types';

export const ADL_CLASS_RATINGS = {
  class1: 'Class 1: No Impairment (0%)',
  class2: 'Class 2: Mild Impairment (10%-20%)',
  class3: 'Class 3: Moderate Impairment (30%-40%)',
  class4: 'Class 4: Marked Impairment (50%-70%)',
  class5: 'Class 5: Extreme Impairment (75%-90%)'
} as const;

interface ADLSectionSelectProps {
  name: string;
  label: string;
}

const ADLSectionSelect = ({ name, label }: ADLSectionSelectProps) => {
  const { control } = useFormContext<AssessmentFormData>();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select class rating" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {Object.entries(ADL_CLASS_RATINGS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
};

export default ADLSectionSelect;