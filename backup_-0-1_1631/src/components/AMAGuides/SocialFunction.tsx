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

const SocialFunction = () => {
  const { register, formState: { errors } } = useFormContext<AMAGuideFormData>();
  const fieldPrefix = 'socialFunctioning';

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Social Functioning</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertDescription>
            Per AMA Guides 4th Edition Chapter 14, evaluate the ability to interact and communicate effectively
            with others. Consider ability to get along with family, friends, neighbors, supervisors, and coworkers.
            Assess both frequency and quality of social interactions and relationships.
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
            placeholder="Document observations of social interactions, communication patterns, and behavioral manifestations..."
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
            placeholder="Describe specific limitations in social interactions, relationships, and communication effectiveness..."
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
            placeholder="Document interventions for social functioning, their effectiveness, and expected outcomes..."
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

export default SocialFunction;