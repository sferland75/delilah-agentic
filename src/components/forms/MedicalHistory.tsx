import { useFormContext } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import type { AssessmentForm } from '@/types/form';

export function MedicalHistory() {
  const { control } = useFormContext<AssessmentForm>();

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <FormField
          control={control}
          name="medicalHistory.preAccidentHistory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pre-Accident History</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Document pre-existing conditions and medical history"
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="medicalHistory.mechanismOfInjury"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mechanism of Injury</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Document how the injury occurred"
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="medicalHistory.natureOfInjury"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nature of Injury</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Document injuries sustained in the incident"
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