import React from 'react';
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FaStethoscope, FaPlus, FaTrashAlt } from 'react-icons/fa';

export function DiagnosisCategories() {
  const { register, watch, setValue } = useFormContext();
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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FaStethoscope className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-medium">Diagnosis Categories</h3>
        </div>
        <Button 
          onClick={addDiagnosis} 
          variant="outline" 
          size="sm"
          className="text-blue-600 border-blue-200 hover:border-blue-300 hover:text-blue-700"
        >
          <FaPlus className="h-4 w-4 mr-2" />
          Add Diagnosis
        </Button>
      </div>

      <div className="space-y-6">
        {diagnosisCategories.map((_, index) => (
          <div key={index} className="p-6 border rounded-lg space-y-6 bg-white/50">
            <div className="flex justify-between items-start">
              <div className="font-medium text-lg text-slate-800">Diagnosis {index + 1}</div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeDiagnosis(index)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <FaTrashAlt className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="font-medium">Category</Label>
                <Input 
                  {...register(`ama.diagnosisCategories.${index}.category`)} 
                  className="bg-white border-slate-200 focus:border-blue-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="font-medium">Diagnosis Code</Label>
                <Input 
                  {...register(`ama.diagnosisCategories.${index}.diagnosisCode`)} 
                  className="bg-white border-slate-200 focus:border-blue-300"
                />
              </div>
              
              <div className="space-y-2 col-span-2">
                <Label className="font-medium">Description</Label>
                <Textarea 
                  {...register(`ama.diagnosisCategories.${index}.diagnosisDescription`)} 
                  className="min-h-[80px] bg-white border-slate-200 focus:border-blue-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="font-medium">Body Part</Label>
                <Input 
                  {...register(`ama.diagnosisCategories.${index}.bodyPart`)} 
                  className="bg-white border-slate-200 focus:border-blue-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="font-medium">Impairment Rating</Label>
                <Input 
                  {...register(`ama.diagnosisCategories.${index}.impairmentRating`)} 
                  className="bg-white border-slate-200 focus:border-blue-300"
                />
              </div>
              
              <div className="space-y-2 col-span-2">
                <Label className="font-medium">Rationale</Label>
                <Textarea 
                  {...register(`ama.diagnosisCategories.${index}.rationale`)} 
                  className="min-h-[80px] bg-white border-slate-200 focus:border-blue-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="font-medium">Guide Reference</Label>
                <Input 
                  {...register(`ama.diagnosisCategories.${index}.guideReference`)} 
                  className="bg-white border-slate-200 focus:border-blue-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="font-medium">Notes</Label>
                <Textarea 
                  {...register(`ama.diagnosisCategories.${index}.notes`)} 
                  className="min-h-[80px] bg-white border-slate-200 focus:border-blue-300"
                />
              </div>
            </div>
          </div>
        ))}
        
        {diagnosisCategories.length === 0 && (
          <div className="text-center py-8 text-slate-500 bg-slate-50/50 border border-dashed border-slate-200 rounded-lg">
            No diagnosis categories added. Click "Add Diagnosis" to begin.
          </div>
        )}
      </div>
    </div>
  );
}