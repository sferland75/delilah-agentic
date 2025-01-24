import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import type { AMAGuideFormData } from './schema';
import { classLabels } from './schema';

const WorkAdaptation = () => {
  const { register, formState: { errors } } = useFormContext<AMAGuideFormData>();
  const fieldPrefix = 'adaptationToWork';

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Adaptation to Work or Work-Like Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertDescription>
            Per AMA Guides 4th Edition Chapter 14, evaluate the ability to adapt to stressful circumstances
            in work settings or work-like settings. Consider ability to maintain regular attendance,
            follow supervisor instructions, interact with coworkers, deal with workplace pressures,
            and respond appropriately to changes in work environment.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <Label className="text-lg font-semibold">Impairment Classification</Label>
          <RadioGroup 
            defaultValue="class1" 
            className="grid grid-cols-1 gap-4"
            {...register(`${fieldPrefix}.classRating`)}
          >
            {Object.entries(classLabels).map(([value, label]) => (
              <div key={value} className="flex items-center space-x-2">
                <RadioGroupItem value={value} id={`${fieldPrefix}-${value}`} />
                <Label htmlFor={`${fieldPrefix}-${value}`}>{label}</Label>
              </div>
            ))}
          </RadioGroup>
          {errors[fieldPrefix]?.classRating && (
            <p className="text-sm text-red-500">{errors[fieldPrefix]?.classRating.message}</p>
          )}
        </div>

        <Separator />

        <div className="space-y-4">
          <Label className="text-lg font-semibold">Clinical Findings</Label>
          <Textarea 
            {...register(`${fieldPrefix}.clinicalFindings`)}
            placeholder="Document observations of work-related behaviors, stress responses, and adaptive capabilities..."
            className="min-h-[100px]"
          />
          {errors[fieldPrefix]?.clinicalFindings && (
            <p className="text-sm text-red-500">{errors[fieldPrefix]?.clinicalFindings.message}</p>
          )}
        </div>

        <div className="space-y-4">
          <Label className="text-lg font-semibold">Functional Limitations</Label>
          <Textarea 
            {...register(`${fieldPrefix}.functionalLimitations`)}
            placeholder="Describe specific limitations in workplace adaptation and stress management..."
            className="min-h-[100px]"
          />
          {errors[fieldPrefix]?.functionalLimitations && (
            <p className="text-sm text-red-500">{errors[fieldPrefix]?.functionalLimitations.message}</p>
          )}
        </div>

        <div className="space-y-4">
          <Label className="text-lg font-semibold">Treatment and Prognosis</Label>
          <Textarea 
            {...register(`${fieldPrefix}.treatmentAndPrognosis`)}
            placeholder="Document interventions for work adaptation, accommodations needed, and expected capacity for improvement..."
            className="min-h-[100px]"
          />
          {errors[fieldPrefix]?.treatmentAndPrognosis && (
            <p className="text-sm text-red-500">{errors[fieldPrefix]?.treatmentAndPrognosis.message}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkAdaptation;