import React from 'react';
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import type { AssessmentFormData } from '@/lib/validation/assessment-schema';

export const AMASection = () => {
  const { register, watch, setValue } = useFormContext<AssessmentFormData>();
  const diagnosisCategories = watch('ama.diagnosisCategories') || [];
  
  const addDiagnosis = () => {
    setValue('ama.diagnosisCategories', [
      ...diagnosisCategories,
      {
        category: '',
        diagnosisCode: '',
        diagnosisDescription: '',
        bodyPart: '',
        impairmentRating: '',
        rationale: '',
        guideReference: '',
        notes: ''
      }
    ]);
  };

  const removeDiagnosis = (index: number) => {
    const newCategories = [...diagnosisCategories];
    newCategories.splice(index, 1);
    setValue('ama.diagnosisCategories', newCategories);
  };

  return (
    <div className="space-y-6">
      {/* General AMA Information */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>AMA Guides Edition</Label>
              <Input {...register('ama.edition')} placeholder="e.g., 6th Edition" />
            </div>
            <div className="space-y-2">
              <Label>Assessment Date</Label>
              <Input type="date" {...register('ama.assessmentDate')} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diagnosis Categories */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold">Diagnosis Categories</h4>
            <Button onClick={addDiagnosis} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Diagnosis
            </Button>
          </div>

          <div className="space-y-6">
            {diagnosisCategories.map((_, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-4">
                <div className="flex justify-between items-start">
                  <h5 className="font-medium">Diagnosis {index + 1}</h5>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDiagnosis(index)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Input {...register(`ama.diagnosisCategories.${index}.category`)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Diagnosis Code</Label>
                    <Input {...register(`ama.diagnosisCategories.${index}.diagnosisCode`)} />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Description</Label>
                    <Textarea {...register(`ama.diagnosisCategories.${index}.diagnosisDescription`)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Body Part</Label>
                    <Input {...register(`ama.diagnosisCategories.${index}.bodyPart`)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Impairment Rating</Label>
                    <Input {...register(`ama.diagnosisCategories.${index}.impairmentRating`)} />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Rationale</Label>
                    <Textarea {...register(`ama.diagnosisCategories.${index}.rationale`)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Guide Reference</Label>
                    <Input {...register(`ama.diagnosisCategories.${index}.guideReference`)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea {...register(`ama.diagnosisCategories.${index}.notes`)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Total Impairment and Methodology */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Total Impairment Rating</Label>
              <Input {...register('ama.totalImpairment')} />
            </div>
            <div className="space-y-2">
              <Label>Combined Values Methodology</Label>
              <Textarea {...register('ama.methodology')} />
            </div>
            <div className="space-y-2">
              <Label>Additional Notes</Label>
              <Textarea {...register('ama.additionalNotes')} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AMASection;