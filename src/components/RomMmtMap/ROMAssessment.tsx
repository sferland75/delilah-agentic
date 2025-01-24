import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

interface ROMAssessmentProps {
  joint: {
    id: string;
    label: string;
    movements: string[];
  };
  initialData?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const ROM_GRADES = [
  { value: 'WFL', label: 'WFL', description: 'Within Functional Limits' },
  { value: '3/4', label: '3/4', description: 'Three Quarter Range' },
  { value: '1/2', label: '1/2', description: 'Half Range' },
  { value: '1/4', label: '1/4', description: 'Quarter Range' },
  { value: 'nominal', label: 'Nominal', description: 'Minimal Movement' }
];

export const ROMAssessment: React.FC<ROMAssessmentProps> = ({
  joint,
  initialData,
  onSave,
  onCancel
}) => {
  const [selectedScore, setSelectedScore] = useState(initialData?.score || 'WFL');
  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: initialData || {
      joint: joint.id,
      score: 'WFL',
      notes: '',
      movements: {}
    }
  });

  const onSubmit = (data: any) => {
    onSave({
      joint: joint.id,
      score: selectedScore,  // Use the state value
      ...data
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        {/* Overall ROM Score */}
        <div>
          <Label>Overall Range Assessment</Label>
          <RadioGroup
            value={selectedScore}
            onValueChange={setSelectedScore}
            className="grid grid-cols-5 gap-4 mt-2"
          >
            {ROM_GRADES.map((grade) => (
              <div key={grade.value} className="flex flex-col items-center space-y-1">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={grade.value} id={grade.value} />
                  <Label htmlFor={grade.value}>{grade.label}</Label>
                </div>
                <span className="text-xs text-muted-foreground">{grade.description}</span>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Movement-specific Assessments */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <Label>Movement-specific Assessment</Label>
            {joint.movements.map((movement) => (
              <div key={movement} className="space-y-2">
                <Label>{movement.charAt(0).toUpperCase() + movement.slice(1)}</Label>
                <RadioGroup
                  defaultValue={initialData?.movements?.[movement] || 'WFL'}
                  onValueChange={(value) => {
                    setValue(`movements.${movement}`, value);
                  }}
                  className="grid grid-cols-5 gap-4"
                >
                  {ROM_GRADES.map((grade) => (
                    <div key={`${movement}-${grade.value}`} className="flex items-center space-x-2">
                      <RadioGroupItem value={grade.value} id={`${movement}-${grade.value}`} />
                      <Label htmlFor={`${movement}-${grade.value}`}>{grade.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            {...register('notes')}
            placeholder="Enter any additional observations or notes..."
            className="min-h-[100px]"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save Assessment
        </Button>
      </div>
    </form>
  );
};