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

const WorkAdaptation = () => {
  const { register, formState: { errors } } = useFormContext<AMAGuideFormData>();
  const fieldPrefix = 'adaptationToWork';
  const { title, description, categories } = amaQuotes.adaptationToWork;

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
          <AccordionTrigger>Work Adaptation Categories</AccordionTrigger>
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
          <CardDescription>Document work adaptation and coping strategies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label className="text-lg font-medium">Clinical Findings</Label>
            <Textarea 
              {...register(`${fieldPrefix}.clinicalFindings`)}
              placeholder="Document observed work behaviors, stress tolerance, and adaptation patterns..."
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
              placeholder="Describe response to workplace demands, changes, and stressors..."
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
              placeholder="Document workplace, environmental, and personal factors affecting work adaptation..."
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
              placeholder="Describe current workplace accommodations and potential adaptation strategies..."
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
              placeholder="Provide specific recommendations for workplace accommodations and supports..."
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

export default WorkAdaptation;