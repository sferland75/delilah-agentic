import React from 'react';
import { Control } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

interface PreExistingConditionsProps {
  control: Control<any>;
}

export function PreExistingConditions({ control }: PreExistingConditionsProps) {
  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <FormField
          control={control}
          name="medicalHistory.preExisting"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pre-Existing Medical Conditions</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Document any pre-existing medical conditions..."
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="medicalHistory.surgeries"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Previous Surgeries</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="List any previous surgeries and their dates..."
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="medicalHistory.familyHistory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Relevant Family History</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Document relevant family medical history..."
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="medicalHistory.allergies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Allergies and Sensitivities</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="List any known allergies or sensitivities..."
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