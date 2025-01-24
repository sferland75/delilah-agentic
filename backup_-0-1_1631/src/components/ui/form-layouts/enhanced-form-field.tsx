import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface EnhancedFormFieldProps {
  control: any;
  name: string;
  label: string;
  type?: 'text' | 'date' | 'email' | 'tel' | 'select' | 'textarea';
  placeholder?: string;
  options?: { value: string; label: string }[];
  className?: string;
}

export function EnhancedFormField({
  control,
  name,
  label,
  type = 'text',
  placeholder,
  options,
  className
}: EnhancedFormFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className="text-primary-700">{label}</FormLabel>
          <FormControl>
            {type === 'textarea' ? (
              <Textarea
                placeholder={placeholder}
                className="resize-none"
                {...field}
              />
            ) : type === 'select' && options ? (
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder={placeholder || "Select option"} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                type={type}
                placeholder={placeholder}
                className="bg-white"
                {...field}
              />
            )}
          </FormControl>
        </FormItem>
      )}
    />
  );
}