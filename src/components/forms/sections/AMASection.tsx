import React from 'react';
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
    <div className="p-6 space-y-6">
      {/* General AMA Information */}
      <div className="space-y-6">
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
      </div>

      {/* Diagnosis Categories */}
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-medium">Diagnosis Categories</div>
          <Button onClick={addDiagnosis} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Diagnosis
          </Button>
        </div>

        <div className="space-y-6">
          {diagnosisCategories.map((_, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-4 bg-white/50">
              <div className="flex justify-between items-start">
                <div className="font-medium">Diagnosis {index + 1}</div>
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
                <div className="space