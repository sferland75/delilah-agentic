import React from 'react';
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { type AssessmentFormData } from '@/lib/validation/assessment-schema';

export const MedicalSection = () => {
  const { register, watch, setValue } = useFormContext<AssessmentFormData>();
  const medical = watch('medical');

  const handleTreatmentsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const treatmentsArray = e.target.value.split('\n').filter(t => t.trim());
    setValue('medical.treatments', treatmentsArray, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      {/* Injury Information */}
      <Card>
        <CardContent className="pt-6">
          <h4 className="text-lg font-semibold mb-4">Injury Details</h4>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="circumstance">Circumstance of Injury</Label>
              <Textarea
                id="circumstance"
                {...register('medical.injury.circumstance')}
                placeholder="Describe how the injury occurred"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date of Injury</Label>
                <Input
                  id="date"
                  type="date"
                  {...register('medical.injury.date')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Injury Description</Label>
              <Textarea
                id="description"
                {...register('medical.injury.description')}
                placeholder="Detailed description of the injury and initial impact"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
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
          <h4 className="text-lg font-semibold mb-4">Current Treatments</h4>
          <div className="space-y-2">
            <Label htmlFor="treatments">Treatment List</Label>
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
          <h4 className="text-lg font-semibold mb-4">Medications</h4>
          <div className="space-y-4">
            {medical?.medications?.map((_, index) => (
              <div key={index} className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Medication Name</Label>
                  <Input
                    {...register(`medical.medications.${index}.name`)}
                    placeholder="Medication name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Dosage</Label>
                  <Input
                    {...register(`medical.medications.${index}.dosage`)}
                    placeholder="Dosage"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Frequency</Label>
                  <Input
                    {...register(`medical.medications.${index}.frequency`)}
                    placeholder="How often taken"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Purpose</Label>
                  <Input
                    {...register(`medical.medications.${index}.purpose`)}
                    placeholder="What it's for"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Imaging */}
      <Card>
        <CardContent className="pt-6">
          <h4 className="text-lg font-semibold mb-4">Imaging Studies</h4>
          <div className="space-y-4">
            {medical?.imaging?.map((_, index) => (
              <div key={index} className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Input
                    {...register(`medical.imaging.${index}.type`)}
                    placeholder="Type of imaging"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    {...register(`medical.imaging.${index}.date`)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Region</Label>
                  <Input
                    {...register(`medical.imaging.${index}.region`)}
                    placeholder="Body region"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Findings</Label>
                  <Textarea
                    {...register(`medical.imaging.${index}.findings`)}
                    placeholder="Key findings"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
