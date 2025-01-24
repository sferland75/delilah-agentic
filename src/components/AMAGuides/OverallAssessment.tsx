import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import type { AMAGuideFormData } from './schema';

const OverallAssessment = () => {
  const { register, formState: { errors } } = useFormContext<AMAGuideFormData>();
  const fieldPrefix = 'overallAssessment';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Overall Assessment Summary</CardTitle>
          <CardDescription className="text-foreground">
            Comprehensive summary of functional performance across all domains.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Clinical Summary</CardTitle>
          <CardDescription>
            Integrate findings from all functional domains to support clinical recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label className="text-lg font-medium">Clinical Rationale</Label>
            <Textarea 
              {...register(`${fieldPrefix}.rationale`)}
              placeholder="Provide a comprehensive analysis of findings across all functional domains..."
              className="min-h-[150px]"
            />
            {errors[fieldPrefix]?.rationale && (
              <p className="text-sm text-red-500">{errors[fieldPrefix]?.rationale.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <Label className="text-lg font-medium">Contextual Factors</Label>
            <Textarea 
              {...register(`${fieldPrefix}.contextualFactors`)}
              placeholder="Document environmental, personal, and social factors that influence overall function..."
              className="min-h-[150px]"
            />
            {errors[fieldPrefix]?.contextualFactors && (
              <p className="text-sm text-red-500">{errors[fieldPrefix]?.contextualFactors.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <Label className="text-lg font-medium">Treatment Response</Label>
            <Textarea 
              {...register(`${fieldPrefix}.treatmentResponse`)}
              placeholder="Describe response to interventions, compliance, and engagement in treatment..."
              className="min-h-[150px]"
            />
            {errors[fieldPrefix]?.treatmentResponse && (
              <p className="text-sm text-red-500">{errors[fieldPrefix]?.treatmentResponse.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <Label className="text-lg font-medium">Recommendations</Label>
            <Textarea 
              {...register(`${fieldPrefix}.recommendations`)}
              placeholder="Provide comprehensive recommendations for treatment, accommodations, and supports..."
              className="min-h-[150px]"
            />
            {errors[fieldPrefix]?.recommendations && (
              <p className="text-sm text-red-500">{errors[fieldPrefix]?.recommendations.message}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverallAssessment;