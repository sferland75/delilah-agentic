import React from 'react';
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type AssessmentFormData } from '@/lib/validation/assessment-schema';

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
  FaClipboardList,
  FaPlusCircle,
  FaTrash,
  FaUserMd,
  FaHospital,
  FaCalendarAlt,
  FaUserNurse
} from 'react-icons/fa';

export const MedicalSection = () => {
  const { register, watch, setValue } = useFormContext<AssessmentFormData>();
  const medical = watch('medical');

  const addTreatmentProvider = () => {
    const currentTreatments = medical?.treatments || [];
    setValue('medical.treatments', [
      ...currentTreatments,
      { 
        providerName: '',
        company: '',
        profession: '',  // Added this
        frequency: '',
        focus: ''
      }
    ]);
  };

  const removeTreatmentProvider = (index: number) => {
    const currentTreatments = medical?.treatments || [];
    setValue(
      'medical.treatments',
      currentTreatments.filter((_, i) => i !== index)
    );
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
            <FaBandAid className="h-5 w-5 text-blue-500" />
            <h4 className="text-lg font-semibold">Injury Details</h4>
          </div>
          <div className="grid gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FaNotesMedical className="h-4 w-4 text-blue-500" />
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
                  <FaRegCalendarAlt className="h-4 w-4 text-blue-500" />
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
                <FaFileMedicalAlt className="h-4 w-4 text-blue-500" />
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
                <FaClipboardList className="h-4 w-4 text-blue-500" />
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

      {/* Treatment Providers */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <FaStethoscope className="h-5 w-5 text-blue-500" />
              <h4 className="text-lg font-semibold">Treatment Providers</h4>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={addTreatmentProvider}
              className="flex items-center gap-2 text-blue-500 hover:text-blue-500"
            >
              <FaPlusCircle className="h-4 w-4" />
              Add Treatment Provider
            </Button>
          </div>
          <div className="space-y-6">
            {(medical?.treatments || []).map((_, index) => (
              <div key={index} className="relative p-4 border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 text-blue-500 hover:text-blue-500"
                  onClick={() => removeTreatmentProvider(index)}
                >
                  <FaTrash className="h-4 w-4" />
                </Button>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FaUserMd className="h-4 w-4 text-blue-500" />
                      <Label>Provider Name</Label>
                    </div>
                    <Input
                      {...register(`medical.treatments.${index}.providerName`)}
                      placeholder="Provider name"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FaHospital className="h-4 w-4 text-blue-500" />
                      <Label>Company/Clinic</Label>
                    </div>
                    <Input
                      {...register(`medical.treatments.${index}.company`)}
                      placeholder="Company or clinic name"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FaUserNurse className="h-4 w-4 text-blue-500" />
                      <Label>Profession/Type</Label>
                    </div>
                    <Input
                      {...register(`medical.treatments.${index}.profession`)}
                      placeholder="e.g., Physiotherapist, OT"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="h-4 w-4 text-blue-500" />
                      <Label>Frequency</Label>
                    </div>
                    <Input
                      {...register(`medical.treatments.${index}.frequency`)}
                      placeholder="Treatment frequency"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <div className="flex items-center gap-2">
                      <FaList className="h-4 w-4 text-blue-500" />
                      <Label>Current Focus</Label>
                    </div>
                    <Input
                      {...register(`medical.treatments.${index}.focus`)}
                      placeholder="Current treatment focus"
                    />
                  </div>
                </div>
              </div>
            ))}
            {(!medical?.treatments || medical.treatments.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                No treatment providers added. Click "Add Treatment Provider" to begin.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Medications */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <FaPills className="h-5 w-5 text-blue-500" />
              <h4 className="text-lg font-semibold">Medications</h4>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={addMedication}
              className="flex items-center gap-2 text-blue-500 hover:text-blue-500"
            >
              <FaPlusCircle className="h-4 w-4" />
              Add Medication
            </Button>
          </div>
          <div className="space-y-6">
            {(medical?.medications || []).map((_, index) => (
              <div key={index} className="relative p-4 border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 text-blue-500 hover:text-blue-500"
                  onClick={() => removeMedication(index)}
                >
                  <FaTrash className="h-4 w-4" />
                </Button>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FaSyringe className="h-4 w-4 text-blue-500" />
                      <Label>Medication Name</Label>
                    </div>
                    <Input
                      {...register(`medical.medications.${index}.name`)}
                      placeholder="Medication name"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FaBookMedical className="h-4 w-4 text-blue-500" />
                      <Label>Dosage</Label>
                    </div>
                    <Input
                      {...register(`medical.medications.${index}.dosage`)}
                      placeholder="Dosage"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FaClock className="h-4 w-4 text-blue-500" />
                      <Label>Frequency</Label>
                    </div>
                    <Input
                      {...register(`medical.medications.${index}.frequency`)}
                      placeholder="How often taken"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FaNotesMedical className="h-4 w-4 text-blue-500" />
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