import { useFormContext } from 'react-hook-form';
import { Card, CardContent } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from 'lucide-react';
import { environmentalConfigs } from './config';
import type { AssessmentFormData } from '@/lib/validation/assessment-schema';

interface Concern {
  id: string;
  description: string;
  impact: string;
  recommendations: string[];
}

export function AccessibilityAssessment() {
  const { control, watch, setValue } = useFormContext<AssessmentFormData>();
  const accessibility = watch('environmental.accessibility') || {
    concerns: '',
    modifications: '',
    recommendations: ''
  };

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <FormField
          control={control}
          name="environmental.accessibility.concerns"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Accessibility Concerns</FormLabel>
              <FormControl>
                <Textarea 
                  {...field}
                  placeholder="Describe any accessibility concerns or barriers"
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="environmental.accessibility.modifications"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Modifications</FormLabel>
              <FormControl>
                <Textarea 
                  {...field}
                  placeholder="List any existing accessibility modifications"
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="environmental.accessibility.recommendations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recommended Modifications</FormLabel>
              <FormControl>
                <Textarea 
                  {...field}
                  placeholder="Enter recommended accessibility modifications"
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