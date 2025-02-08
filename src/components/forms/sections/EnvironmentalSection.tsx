import React from 'react';
import { HomeIcon, ShieldAlert, ParkingCircle, Trees, FileText } from 'lucide-react';
import { RoomInventory } from '@/components/EnvironmentalSection/RoomInventory';
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
      {/* Property Details */}
      <div className="border rounded-md p-4 space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <HomeIcon className="h-4 w-4 text-blue-600" />
            <div className="text-sm font-semibold">General Property Description</div>
          </div>
          <Textarea
            value={formData.environmental?.description || ''}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Describe the general layout and features of the property..."
            className="mt-2 resize-none text-sm min-h-[100px]"
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert className="h-4 w-4 text-blue-600" />
            <div className="text-sm font-semibold">Hazards and Safety Concerns</div>
          </div>
          <Textarea
            value={formData.environmental?.hazards || ''}
            onChange={(e) => updateField('hazards', e.target.value)}
            placeholder="List any identified hazards or safety concerns..."
            className="mt-2 resize-none text-sm min-h-[100px]"
          />
        </div>
      </div>

      {/* Room Inventory */}
      <RoomInventory />

      {/* Outdoor Areas Section */}
      <div className="border rounded-md p-4 space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ParkingCircle className="h-4 w-4 text-blue-600" />
            <div className="text-sm font-semibold">Access and Parking</div>
          </div>
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
            className="mt-2 resize-none text-sm min-h-[100px]"
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Trees className="h-4 w-4 text-blue-600" />
            <div className="text-sm font-semibold">Yard and Garden Areas</div>
          </div>
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
            className="mt-2 resize-none text-sm min-h-[100px]"
          />
        </div>
      </div>

      {/* Notes Section */}
      <div className="border rounded-md p-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-blue-600" />
            <div className="text-sm font-semibold">Additional Comments and Recommendations</div>
          </div>
          <Textarea
            value={formData.environmental?.notes || ''}
            onChange={(e) => updateField('notes', e.target.value)}
            placeholder="Add any additional notes, observations, or recommendations..."
            className="mt-2 resize-none text-sm min-h-[100px]"
          />
        </div>
      </div>
    </div>
  );
};