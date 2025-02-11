import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  FaHome,
  FaWarehouse,
  FaShieldAlt
} from 'react-icons/fa';

export function OutdoorAreas() {
  const { register } = useFormContext();

  return (
    <div className="space-y-6">
      {/* Entrances and Access */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <FaHome className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm font-medium text-slate-600">Entrances and Access</h3>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-sm text-slate-600 font-medium">Main Entrance</Label>
            <Textarea
              {...register('environmental.outdoor.mainEntrance')}
              placeholder="Describe main entrance accessibility (steps, ramps, lighting)"
              className="mt-2 resize-none bg-white border-slate-200 focus:border-blue-300"
            />
          </div>
          <div>
            <Label className="text-sm text-slate-600 font-medium">Other Entrances</Label>
            <Textarea
              {...register('environmental.outdoor.otherEntrances')}
              placeholder="Describe other entrances (garage, back door, etc.)"
              className="mt-2 resize-none bg-white border-slate-200 focus:border-blue-300"
            />
          </div>
          <div>
            <Label className="text-sm text-slate-600 font-medium">Parking</Label>
            <Textarea
              {...register('environmental.outdoor.parking')}
              placeholder="Describe parking situation (garage, driveway, street parking)"
              className="mt-2 resize-none bg-white border-slate-200 focus:border-blue-300"
            />
          </div>
        </div>
      </div>

      {/* Property Features */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <FaWarehouse className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm font-medium text-slate-600">Property Features</h3>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-sm text-slate-600 font-medium">Yard Description</Label>
            <Textarea
              {...register('environmental.outdoor.yardDescription')}
              placeholder="Describe yard size, terrain, and features"
              className="mt-2 resize-none bg-white border-slate-200 focus:border-blue-300"
            />
          </div>
          <div>
            <Label className="text-sm text-slate-600 font-medium">Outdoor Structures</Label>
            <Textarea
              {...register('environmental.outdoor.structures')}
              placeholder="Describe outdoor structures (deck, patio, shed, pool)"
              className="mt-2 resize-none bg-white border-slate-200 focus:border-blue-300"
            />
          </div>
          <div>
            <Label className="text-sm text-slate-600 font-medium">Maintenance Requirements</Label>
            <Textarea
              {...register('environmental.outdoor.maintenance')}
              placeholder="Describe yard maintenance needs (mowing, gardening, snow removal)"
              className="mt-2 resize-none bg-white border-slate-200 focus:border-blue-300"
            />
          </div>
        </div>
      </div>

      {/* Safety and Accessibility */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <FaShieldAlt className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm font-medium text-slate-600">Safety and Accessibility</h3>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-sm text-slate-600 font-medium">Lighting</Label>
            <Textarea
              {...register('environmental.outdoor.lighting')}
              placeholder="Describe outdoor lighting (coverage, controls, timer systems)"
              className="mt-2 resize-none bg-white border-slate-200 focus:border-blue-300"
            />
          </div>
          <div>
            <Label className="text-sm text-slate-600 font-medium">Safety Concerns</Label>
            <Textarea
              {...register('environmental.outdoor.safetyConcerns')}
              placeholder="List any outdoor safety concerns or hazards"
              className="mt-2 resize-none bg-white border-slate-200 focus:border-blue-300"
            />
          </div>
          <div>
            <Label className="text-sm text-slate-600 font-medium">Accessibility Modifications</Label>
            <Textarea
              {...register('environmental.outdoor.accessibilityModifications')}
              placeholder="Describe needed outdoor accessibility modifications"
              className="mt-2 resize-none bg-white border-slate-200 focus:border-blue-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
}