import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm as useFormContext } from '@/context/FormContext';
import { Card, CardContent } from "@/components/ui/card";

export const MedicalSection = () => {
  const { formData, updateFormData } = useFormContext();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section: 'injury' | 'symptoms' | 'treatments'
  ) => {
    const { name, value } = e.target;
    updateFormData({
      ...formData,
      medical: {
        ...formData.medical,
        [section]: {
          ...formData.medical?.[section],
          [name]: value
        }
      }
    });
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
                name="circumstance"
                value={formData.medical?.injury?.circumstance || ''}
                onChange={(e) => handleChange(e, 'injury')}
                placeholder="Describe how the injury occurred"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date of Injury</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.medical?.injury?.date || ''}
                  onChange={(e) => handleChange(e, 'injury')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Injury Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.medical?.injury?.description || ''}
                onChange={(e) => handleChange(e, 'injury')}
                placeholder="Detailed description of the injury and initial impact"
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
              name="treatments"
              value={formData.medical?.treatments?.join('\n') || ''}
              onChange={(e) => {
                const treatmentsArray = e.target.value.split('\n').filter(t => t.trim());
                updateFormData({
                  ...formData,
                  medical: {
                    ...formData.medical,
                    treatments: treatmentsArray
                  }
                });
              }}
              placeholder="Enter treatments (one per line)"
              className="h-32"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
