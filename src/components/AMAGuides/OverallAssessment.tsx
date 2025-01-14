import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import type { AMAGuideFormData } from './schema';
import { classLabels, impairmentClass } from './schema';

const OverallAssessment = () => {
  const { register, formState: { errors }, control } = useFormContext<AMAGuideFormData>();

  // Watch all class ratings to determine highest automatically
  const formValues = useWatch({
    control,
    name: ['activitiesOfDailyLiving.classRating', 
           'socialFunctioning.classRating',
           'concentrationPersistencePace.classRating', 
           'adaptationToWork.classRating']
  });

  // Get numeric class value for comparison
  const getClassValue = (classRating: string) => {
    return parseInt(classRating.replace('class', ''));
  };

  // Determine highest class rating
  const highestClass = React.useMemo(() => {
    const validRatings = formValues.filter(Boolean);
    if (validRatings.length === 0) return 'class1';
    
    const highest = validRatings.reduce((max, current) => {
      return getClassValue(current) > getClassValue(max) ? current : max;
    }, validRatings[0]);
    
    return highest;
  }, [formValues]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Overall Mental/Behavioral Impairment Assessment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertDescription>
            Per AMA Guides 4th Edition Chapter 14, the final impairment determination is based on the 
            highest rated impairment among the four areas. Additional factors may be considered in the 
            overall assessment but must be clearly documented.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <Label className="text-lg font-semibold">Final Impairment Classification</Label>
          <RadioGroup 
            value={highestClass}
            className="grid grid-cols-1 gap-4"
            {...register('overallAssessment.highestClass')}
          >
            {Object.entries(classLabels).map(([value, label]) => (
              <div key={value} className="flex items-center space-x-2">
                <RadioGroupItem value={value} id={`overall-${value}`} />
                <Label htmlFor={`overall-${value}`}>{label}</Label>
              </div>
            ))}
          </RadioGroup>
          {errors.overallAssessment?.highestClass && (
            <p className="text-sm text-red-500">{errors.overallAssessment?.highestClass.message}</p>
          )}
        </div>

        <Separator />

        <div className="space-y-4">
          <Label className="text-lg font-semibold">Assessment Justification</Label>
          <Textarea 
            {...register('overallAssessment.justification')}
            placeholder="Provide detailed justification for the final impairment classification, referencing specific findings from each assessment area..."
            className="min-h-[100px]"
          />
          {errors.overallAssessment?.justification && (
            <p className="text-sm text-red-500">{errors.overallAssessment?.justification.message}</p>
          )}
        </div>

        <div className="space-y-4">
          <Label className="text-lg font-semibold">Additional Factors</Label>
          <Textarea 
            {...register('overallAssessment.additionalFactors')}
            placeholder="Document any additional factors considered in the overall assessment (optional)..."
            className="min-h-[100px]"
          />
          {errors.overallAssessment?.additionalFactors && (
            <p className="text-sm text-red-500">{errors.overallAssessment?.additionalFactors.message}</p>
          )}
        </div>

        <Alert>
          <AlertDescription>
            The overall impairment class is determined by the highest rated area among:
            Activities of Daily Living, Social Functioning, Concentration/Persistence/Pace,
            and Adaptation to Work Settings.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default OverallAssessment;