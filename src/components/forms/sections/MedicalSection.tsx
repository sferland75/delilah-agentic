import React from 'react';
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type AssessmentFormData } from '@/lib/validation/assessment-schema';
import { PlusCircle, Trash2 } from 'lucide-react';

import {
  FaBandAid,
  FaRegCalendarAlt,
  FaNotesMedical,
  FaFileMedicalAlt,
  FaPills,
  FaClock,
  FaList,
  FaStethoscope,
  FaBookMedical,
  FaSyringe,
  FaClipboardList
} from 'react-icons/fa';

export const MedicalSection = () => {
  const { register, watch, setValue } = useFormContext<AssessmentFormData>();
  const medical = watch('medical');

  const handleTreatmentsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const treatmentsArray = e.target.value.split('\n').filter(t => t.trim());
    setValue('medical.treatments', treatmentsArray, { shouldValidate: true });
  };

  const addMedication = () => {
    const currentMeds = medical?.medications || [];
    setValue('medical.medications', [
      ...currentMeds,
      { name: '', dosage: '', frequency: '', purpose: '' }
    ]);
  };

  const removeMedication = (index: number) => {
    const currentMeds = medical?.medications || [];
    setValue(
      'medical.medications',
      currentMeds.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-6">
      {/* Injury Information */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <FaBandAid className="h-5 w-5 text-blue-600" />
            <h4 className="text-lg font-semibold">Injury Details</h4>
          </div>
          <div className="grid gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FaNotesMedical className="h-4 w-4 text-blue-600" />
                <Label htmlFor="circumstance">Circumstance of Injury</Label>
              </div>
              <Textarea
                id="circumstance"
                {...register('medical.injury.circumstance')}
                placeholder="Describe how the injury occurred"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FaRegCalendarAlt className="h-4 w-4 text-blue-600" />
                  <Label htmlFor="date">Date of Injury</Label>
                </div>
                <Input
                  id="date"
                  type="date"
                  {...register('medical.injury.date')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FaFileMedicalAlt className="h-4 w-4 text-blue-600" />
                <Label htmlFor="description">Injury Description</Label>
              </div>
              <Textarea
                id="description"
                {...register('medical.injury.description')}
                placeholder="Detailed description of the injury and initial impact"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FaClipboardList className="h-4 w-4 text-blue-600" />
                <Label htmlFor="notes">Additional Notes</Label>
              </div>
              <Textarea
                id="notes"
                {...register('medical.injury.notes')}
                placeholder="Any additional notes about the injury"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Treatments */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <FaStethoscope className="h-5 w-5 text-blue-600" />
            <h4 className="text-lg font-semibold">Current Treatments</h4>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FaList className="h-4 w-4 text-blue-600" />
              <Label htmlFor="treatments">Treatment List</Label>
            </div>
            <Textarea
              id="treatments"
              value={medical?.treatments?.join('\n') || ''}
              onChange={handleTreatmentsChange}
              placeholder="Enter treatments (one per line)"
              className="h-32"
            />
            <p className="text-sm text-muted-foreground">
              Enter each treatment on a new line
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Medications */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <FaPills className="h-5 w-5 text-blue-600" />
              <h4 className="text-lg font-semibold">Medications</h4>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={addMedication}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Add Medication
            </Button>
          </div>
          <div className="space-y-6">
            {(medical?.medications || []).map((_, index) => (
              <div key={index} className="relative p-4 border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={() => removeMedication(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FaSyringe className="h-4 w-4 text-blue-600" />
                      <Label>Medication Name</Label>
                    </div>
                    <Input
                      {...register(`medical.medications.${index}.name`)}
                      placeholder="Medication name"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FaBookMedical className="h-4 w-4 text-blue-600" />
                      <Label>Dosage</Label>
                    </div>
                    <Input
                      {...register(`medical.medications.${index}.dosage`)}
                      placeholder="Dosage"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FaClock className="h-4 w-4 text-blue-600" />
                      <Label>Frequency</Label>
                    </div>
                    <Input
                      {...register(`medical.medications.${index}.frequency`)}
                      placeholder="How often taken"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FaNotesMedical className="h-4 w-4 text-blue-600" />
                      <Label>Purpose</Label>
                    </div>
                    <Input
                      {...register(`medical.medications.${index}.purpose`)}
                      placeholder="What it's for"
                    />
                  </div>
                </div>
              </div>
            ))}
            {(!medical?.medications || medical.medications.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                No medications added. Click "Add Medication" to begin.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};