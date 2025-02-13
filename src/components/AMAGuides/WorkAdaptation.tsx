import React from 'react';
import { useFormContext } from 'react-hook-form';
<<<<<<< HEAD
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { AMAGuideFormData } from './schema';
import { amaQuotes } from './schema';
import { 
  FaClipboardCheck, 
  FaBriefcase,
  FaSitemap,
  FaTools,
  FaLightbulb
} from 'react-icons/fa';
=======
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import type { AMAGuideFormData } from './schema';
import { classLabels } from './schema';
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801

const WorkAdaptation = () => {
  const { register, formState: { errors } } = useFormContext<AMAGuideFormData>();
  const fieldPrefix = 'adaptationToWork';
<<<<<<< HEAD
  const { title, description, categories } = amaQuotes.adaptationToWork;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-sm text-slate-600 mb-6">{description}</p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="categories">
          <AccordionTrigger className="text-sm">Work Adaptation Categories Reference</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-4">
              {categories.map((category) => (
                <div key={category} className="border-l-4 border-blue-600 pl-4 py-2 bg-blue-50/50">
                  <p className="text-sm font-medium text-slate-700">{category}</p>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="space-y-6 bg-white rounded-lg">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-1.5">
              <FaClipboardCheck className="h-4 w-4 text-blue-600" />
              <Label className="font-medium">Clinical Findings</Label>
            </div>
            <Textarea 
              {...register(`${fieldPrefix}.clinicalFindings`)}
              placeholder="Document observed work behaviors, stress tolerance, and adaptation patterns..."
              className="min-h-[100px] bg-white border-slate-200 focus:border-blue-300"
            />
            {errors[fieldPrefix]?.clinicalFindings && (
              <p className="text-sm text-red-500">{errors[fieldPrefix]?.clinicalFindings.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-1.5">
              <FaBriefcase className="h-4 w-4 text-blue-600" />
              <Label className="font-medium">Functional Observations</Label>
            </div>
            <Textarea 
              {...register(`${fieldPrefix}.functionalObservations`)}
              placeholder="Describe response to workplace demands, changes, and stressors..."
              className="min-h-[100px] bg-white border-slate-200 focus:border-blue-300"
            />
            {errors[fieldPrefix]?.functionalObservations && (
              <p className="text-sm text-red-500">{errors[fieldPrefix]?.functionalObservations.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-1.5">
              <FaSitemap className="h-4 w-4 text-blue-600" />
              <Label className="font-medium">Contextual Factors</Label>
            </div>
            <Textarea 
              {...register(`${fieldPrefix}.contextualFactors`)}
              placeholder="Document workplace, environmental, and personal factors affecting work adaptation..."
              className="min-h-[100px] bg-white border-slate-200 focus:border-blue-300"
            />
            {errors[fieldPrefix]?.contextualFactors && (
              <p className="text-sm text-red-500">{errors[fieldPrefix]?.contextualFactors.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-1.5">
              <FaTools className="h-4 w-4 text-blue-600" />
              <Label className="font-medium">Current/Potential Adaptive Strategies</Label>
            </div>
            <Textarea 
              {...register(`${fieldPrefix}.adaptiveStrategies`)}
              placeholder="Describe current workplace accommodations and potential adaptation strategies..."
              className="min-h-[100px] bg-white border-slate-200 focus:border-blue-300"
            />
            {errors[fieldPrefix]?.adaptiveStrategies && (
              <p className="text-sm text-red-500">{errors[fieldPrefix]?.adaptiveStrategies.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-1.5">
              <FaLightbulb className="h-4 w-4 text-blue-600" />
              <Label className="font-medium">Recommendations</Label>
            </div>
            <Textarea 
              {...register(`${fieldPrefix}.recommendations`)}
              placeholder="Provide specific recommendations for workplace accommodations and supports..."
              className="min-h-[100px] bg-white border-slate-200 focus:border-blue-300"
            />
            {errors[fieldPrefix]?.recommendations && (
              <p className="text-sm text-red-500">{errors[fieldPrefix]?.recommendations.message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
=======

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
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
  );
};

export default WorkAdaptation;