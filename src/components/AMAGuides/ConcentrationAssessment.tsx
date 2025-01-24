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
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { AMAGuideFormData } from './schema';
import { amaQuotes } from './schema';

const ConcentrationAssessment = () => {
  const { register, formState: { errors } } = useFormContext<AMAGuideFormData>();
  const fieldPrefix = 'concentrationPersistencePace';
  const { title, description, categories } = amaQuotes.concentrationPersistencePace;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription className="text-foreground">
            {description}
          </CardDescription>
        </CardHeader>
      </Card>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="categories">
          <AccordionTrigger>Concentration, Persistence and Pace Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-4">
              {categories.map((category) => (
                <div key={category} className="border-l-4 border-blue-500 pl-4 py-2">
                  <p className="text-sm font-medium">{category}</p>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Card>
        <CardHeader>
          <CardTitle>Clinical Assessment</CardTitle>
          <CardDescription>Document attention, task completion, and work pace</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label className="text-lg font-medium">Clinical Findings</Label>
            <Textarea 
              {...register(`${fieldPrefix}.clinicalFindings`)}
              placeholder="Document observed attention span, task completion patterns, and work pace..."
              className="min-h-[100px]"
            />
            {errors[fieldPrefix]?.clinicalFindings && (
              <p className="text-sm text-red-500">{errors[fieldPrefix]?.clinicalFindings.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <Label className="text-lg font-medium">Functional Observations</Label>
            <Textarea 
              {...register(`${fieldPrefix}.functionalObservations`)}
              placeholder="Describe performance in tasks requiring sustained attention and consistent pace..."
              className="min-h-[100px]"
            />
            {errors[fieldPrefix]?.functionalObservations && (
              <p className="text-sm text-red-500">{errors[fieldPrefix]?.functionalObservations.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <Label className="text-lg font-medium">Contextual Factors</Label>
            <Textarea 
              {...register(`${fieldPrefix}.contextualFactors`)}
              placeholder="Document environmental and personal factors affecting concentration and task completion..."
              className="min-h-[100px]"
            />
            {errors[fieldPrefix]?.contextualFactors && (
              <p className="text-sm text-red-500">{errors[fieldPrefix]?.contextualFactors.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <Label className="text-lg font-medium">Current/Potential Adaptive Strategies</Label>
            <Textarea 
              {...register(`${fieldPrefix}.adaptiveStrategies`)}
              placeholder="Describe current strategies and potential approaches to improve attention and task completion..."
              className="min-h-[100px]"
            />
            {errors[fieldPrefix]?.adaptiveStrategies && (
              <p className="text-sm text-red-500">{errors[fieldPrefix]?.adaptiveStrategies.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <Label className="text-lg font-medium">Recommendations</Label>
            <Textarea 
              {...register(`${fieldPrefix}.recommendations`)}
              placeholder="Provide specific recommendations for maintaining/improving concentration and work pace..."
              className="min-h-[100px]"
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

export default ConcentrationAssessment;