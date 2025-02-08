import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RoomInventory } from '@/components/EnvironmentalSection/RoomInventory';
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAssessmentForm } from '@/context/FormProvider';

export const EnvironmentalSection = () => {
  const { formData, updateForm } = useAssessmentForm();

  const updateField = (field: string, value: string) => {
    updateForm({
      environmental: {
        ...formData.environmental,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Room Inventory */}
      <Card>
        <CardHeader>
          <CardTitle>Room Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <RoomInventory />
        </CardContent>
      </Card>

      {/* Property Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Property Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>General Property Description</Label>
            <Textarea
              value={formData.environmental?.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Describe the general layout and features of the property..."
              className="mt-2"
            />
          </div>

          <div>
            <Label>Hazards and Safety Concerns</Label>
            <Textarea
              value={formData.environmental?.hazards || ''}
              onChange={(e) => updateField('hazards', e.target.value)}
              placeholder="List any identified hazards or safety concerns..."
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Outdoor Areas */}
      <Card>
        <CardHeader>
          <CardTitle>Outdoor Areas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Access and Parking</Label>
            <Textarea
              value={formData.environmental?.outdoor?.access || ''}
              onChange={(e) => updateForm({
                environmental: {
                  ...formData.environmental,
                  outdoor: {
                    ...formData.environmental?.outdoor,
                    access: e.target.value
                  }
                }
              })}
              placeholder="Describe parking, walkways, and outdoor access..."
              className="mt-2"
            />
          </div>

          <div>
            <Label>Yard and Garden Areas</Label>
            <Textarea
              value={formData.environmental?.outdoor?.yard || ''}
              onChange={(e) => updateForm({
                environmental: {
                  ...formData.environmental,
                  outdoor: {
                    ...formData.environmental?.outdoor,
                    yard: e.target.value
                  }
                }
              })}
              placeholder="Describe yard space, gardens, and maintenance requirements..."
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Additional Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label>Additional Comments and Recommendations</Label>
            <Textarea
              value={formData.environmental?.notes || ''}
              onChange={(e) => updateField('notes', e.target.value)}
              placeholder="Add any additional notes, observations, or recommendations..."
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};