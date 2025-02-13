<<<<<<< HEAD
import React, { useState } from 'react';
import { Control } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
=======
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface MMTAssessmentProps {
<<<<<<< HEAD
  control: Control<any>;
  prefix: string;
=======
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
  segment: {
    id: string;
    label: string;
  };
  initialData?: any;
  onSave: (data: any) => void;
<<<<<<< HEAD
=======
  onCancel: () => void;
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
}

const MMT_GRADES = [
  { value: '5', label: '5 - Normal strength', description: 'Full ROM against gravity with full resistance' },
  { value: '4', label: '4 - Good', description: 'Full ROM against gravity with some resistance' },
  { value: '3', label: '3 - Fair', description: 'Full ROM against gravity only' },
  { value: '2', label: '2 - Poor', description: 'Full ROM with gravity eliminated' },
  { value: '1', label: '1 - Trace', description: 'Visible/palpable contraction, no ROM' },
  { value: '0', label: '0 - Zero', description: 'No contraction palpable' }
];

export const MMTAssessment: React.FC<MMTAssessmentProps> = ({
<<<<<<< HEAD
  control,
  prefix,
  segment,
  initialData,
  onSave
}) => {
  const [score, setScore] = useState(initialData?.score || '5');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [pain, setPain] = useState(initialData?.pain || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      segment: segment.id,
      score,
      notes,
      pain,
      label: segment.label
    });
  };

  const handleCancel = () => {
    onSave(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
=======
  segment,
  initialData,
  onSave,
  onCancel
}) => {
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: initialData || {
      segment: segment.id,
      score: '',
      notes: '',
      pain: false
    }
  });

  const onSubmit = (data: any) => {
    onSave({
      segment: segment.id,
      ...data
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
      <div className="space-y-4">
        {/* MMT Score */}
        <div className="space-y-2">
          <Label>Manual Muscle Testing Grade</Label>
          <Select 
<<<<<<< HEAD
            value={score}
            onValueChange={setScore}
=======
            defaultValue={initialData?.score || undefined}
            onValueChange={(value) => setValue('score', value)}
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
          >
            <SelectTrigger>
              <SelectValue placeholder="Select MMT grade" />
            </SelectTrigger>
            <SelectContent>
              {MMT_GRADES.map((grade) => (
                <SelectItem 
                  key={grade.value} 
                  value={grade.value}
                  className="flex flex-col items-start py-2"
                >
                  <div className="font-medium">{grade.label}</div>
                  <div className="text-sm text-muted-foreground">
                    {grade.description}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Pain During Testing */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="pain"
<<<<<<< HEAD
            checked={pain}
            onCheckedChange={(checked) => setPain(checked as boolean)}
=======
            checked={watch('pain')}
            onCheckedChange={(checked) => setValue('pain', checked)}
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
          />
          <Label htmlFor="pain">Pain during testing</Label>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
<<<<<<< HEAD
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
=======
            {...register('notes')}
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
            placeholder="Enter any additional observations, compensations, or notes..."
            className="min-h-[100px]"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
<<<<<<< HEAD
        <Button type="button" variant="outline" onClick={handleCancel}>
=======
        <Button type="button" variant="outline" onClick={onCancel}>
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
          Cancel
        </Button>
        <Button type="submit">
          Save Assessment
        </Button>
      </div>
    </form>
  );
};