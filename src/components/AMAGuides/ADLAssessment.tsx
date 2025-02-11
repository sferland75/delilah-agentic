import React from 'react';
import { useFormContext } from 'react-hook-form';
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
  FaListAlt, 
  FaClipboardCheck, 
  FaSitemap, 
  FaTools, 
  FaLightbulb 
} from 'react-icons/fa';

const ADLAssessment = () => {
  const { register, formState: { errors } } = useFormContext<AMAGuideFormData>();
  const fieldPrefix = 'activitiesOfDailyLiving';
  const { title, description, categories } = amaQuotes.activitiesOfDailyLiving;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-sm text-slate-600 mb-6">{description}</p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="categories">
          <AccordionTrigger className="text-sm">ADL Categories Reference</AccordionTrigger>
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
              placeholder="Document observed performance in self-care, hygiene, and daily tasks..."
              className="min-h-[100px] bg-white border-slate-200 focus:border-blue-300"
            />
            {errors[fieldPrefix]?.clinicalFindings && (
              <p className="text-sm text-red-500">{errors[fieldPrefix]?.clinicalFindings.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-1.5">
              <FaListAlt className="h-4 w-4 text-blue-600" />
              <Label className="font-medium">Functional Observations</Label>
            </div>
            <Textarea 
              {...register(`${fieldPrefix}.functionalObservations`)}
              placeholder="Describe specific ADL limitations, compensations, and support needs..."
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
              placeholder="Document environmental, personal, and social factors affecting ADL performance..."
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
              placeholder="Describe current adaptations and potential strategies to improve ADL performance..."
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
              placeholder="Provide specific recommendations for maintaining/improving ADL function..."
              className="min-h-[100px] bg-white border-slate-200 focus:border-blue-300"
            />
            {errors[fieldPrefix]?.recommendations && (
              <p className="text-sm text-red-500">{errors[fieldPrefix]?.recommendations.message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ADLAssessment;