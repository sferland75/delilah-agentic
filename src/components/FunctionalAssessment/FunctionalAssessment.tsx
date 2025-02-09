import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ToleranceField {
  label: string;
  name: string;
  placeholder: string;
}

const toleranceFields: ToleranceField[] = [
  { label: 'Standing tolerance', name: 'standing', placeholder: 'e.g., 30 minutes' },
  { label: 'Walking tolerance', name: 'walking', placeholder: 'e.g., 100 meters' },
  { label: 'Sitting tolerance', name: 'sitting', placeholder: 'e.g., 1 hour' },
  { label: 'Lifting capacity', name: 'lifting', placeholder: 'e.g., 10 lbs' }
];

export interface FunctionalAssessmentProps {
  onSubmit?: (data: any) => void;
}

export const FunctionalAssessment: React.FC<FunctionalAssessmentProps> = ({ onSubmit }) => {
  const { register, formState: { errors }, handleSubmit } = useFormContext();

  const onFormSubmit = (data: any) => {
    if (onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Functional Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Tolerances</h3>
              {toleranceFields.map((field) => (
                <div key={field.name} className="grid gap-2">
                  <Label htmlFor={field.name}>{field.label}</Label>
                  <Input
                    id={field.name}
                    {...register(`functionalAssessment.tolerances.${field.name}`, {
                      required: `${field.label} is required`
                    })}
                    placeholder={field.placeholder}
                  />
                  {errors.functionalAssessment?.tolerances?.[field.name] && (
                    <p className="text-sm text-red-500">
                      {errors.functionalAssessment.tolerances[field.name]?.message as string}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <Button type="submit">Save Assessment</Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};