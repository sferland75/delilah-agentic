import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { AMAGuideFormData } from './schema';
import { 
  FaChartLine,
  FaSitemap,
  FaHandHoldingMedical,
  FaLightbulb 
} from 'react-icons/fa';

const OverallAssessment = () => {
  const { register, formState: { errors } } = useFormContext<AMAGuideFormData>();
  const fieldPrefix = 'overallAssessment';

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Overall Assessment Summary</h3>
        <p className="text-sm text-slate-600 mb-6">
          Comprehensive summary of functional performance across all domains.
        </p>
      </div>

      <div className="space-y-6 bg-white rounded-lg">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-1.5">
              <FaChartLine className="h-4 w-4 text-blue-600" />
              <Label className="font-medium">Clinical Rationale</Label>
            </div>
            <Textarea 
              {...register(`${fieldPrefix}.rationale`)}
              placeholder="Provide a comprehensive analysis of findings across all functional domains..."
              className="min-h-[150px] bg-white border-slate-200 focus:border-blue-300"
            />
            {errors[fieldPrefix]?.rationale && (
              <p className="text-sm text-red-500">{errors[fieldPrefix]?.rationale.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-1.5">
              <FaSitemap className="h-4 w-4 text-blue-600" />
              <Label className="font-medium">Contextual Factors</Label>
            </div>
            <Textarea 
              {...register(`${fieldPrefix}.contextualFactors`)}
              placeholder="Document environmental, personal, and social factors that influence overall function..."
              className="min-h-[150px] bg-white border-slate-200 focus:border-blue-300"
            />
            {errors[fieldPrefix]?.contextualFactors && (
              <p className="text-sm text-red-500">{errors[fieldPrefix]?.contextualFactors.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-1.5">
              <FaHandHoldingMedical className="h-4 w-4 text-blue-600" />
              <Label className="font-medium">Treatment Response</Label>
            </div>
            <Textarea 
              {...register(`${fieldPrefix}.treatmentResponse`)}
              placeholder="Describe response to interventions, compliance, and engagement in treatment..."
              className="min-h-[150px] bg-white border-slate-200 focus:border-blue-300"
            />
            {errors[fieldPrefix]?.treatmentResponse && (
              <p className="text-sm text-red-500">{errors[fieldPrefix]?.treatmentResponse.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-1.5">
              <FaLightbulb className="h-4 w-4 text-blue-600" />
              <Label className="font-medium">Recommendations</Label>
            </div>
            <Textarea 
              {...register(`${fieldPrefix}.recommendations`)}
              placeholder="Provide comprehensive recommendations for treatment, accommodations, and supports..."
              className="min-h-[150px] bg-white border-slate-200 focus:border-blue-300"
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

export default OverallAssessment;