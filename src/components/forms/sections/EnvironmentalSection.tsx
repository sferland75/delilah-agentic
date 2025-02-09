import React from 'react';
import { HomeIcon, ShieldAlert, ParkingCircle, Trees, FileText } from 'lucide-react';
import { RoomInventory } from '@/components/EnvironmentalSection/RoomInventory';
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from 'react-hook-form';
import type { AssessmentFormData } from '@/lib/validation/assessment-schema';

export const EnvironmentalSection = () => {
  const { register, watch, setValue } = useFormContext<AssessmentFormData>();
  const environmental = watch('environmental');

  const updateField = (field: string, value: string) => {
    setValue(`environmental.${field}`, value, { shouldDirty: true });
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
            {...register('environmental.description')}
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
            {...register('environmental.hazards')}
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
            {...register('environmental.outdoor.access')}
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
            {...register('environmental.outdoor.yard')}
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
            {...register('environmental.notes')}
            placeholder="Add any additional notes, observations, or recommendations..."
            className="mt-2 resize-none text-sm min-h-[100px]"
          />
        </div>
      </div>
    </div>
  );
};