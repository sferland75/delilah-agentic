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
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface InjuryMechanismProps {
  control: Control<any>;
}

const INJURY_TYPES = [
  { value: 'traumatic', label: 'Traumatic Injury' },
  { value: 'repetitive', label: 'Repetitive Strain' },
  { value: 'gradual', label: 'Gradual Onset' },
  { value: 'other', label: 'Other' }
];

export function InjuryMechanism({ control }: InjuryMechanismProps) {
  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={control}
            name="medicalHistory.injury.date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Injury</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="medicalHistory.injury.type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type of Injury</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select injury type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {INJURY_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="medicalHistory.injury.mechanism"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mechanism of Injury</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Describe how the injury occurred..."
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="medicalHistory.injury.immediateSymptoms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Immediate Symptoms</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Describe symptoms immediately following injury..."
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="medicalHistory.injury.initialTreatment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Initial Treatment Received</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Describe any immediate treatment or first aid received..."
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="medicalHistory.injury.subsequentCare"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subsequent Medical Care</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="List all medical care received since injury..."
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}