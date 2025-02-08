import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Tree, Warehouse, ClipboardList } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PropertyOverview } from './property-overview';
import { RoomInventory } from './RoomInventory';

export function EnvironmentalSection() {
  const { register } = useFormContext();

  return (
    <div className="space-y-6">
      {/* Property Overview */}
      <PropertyOverview />

      {/* Room Inventory */}
      <RoomInventory />

      {/* Outdoor Areas */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Tree className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm text-muted-foreground font-medium">Outdoor Areas</h3>
        </div>

        <div className="border rounded-md p-4 space-y-4">
          {/* Entrances and Access */}
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">Main Entrance</Label>
              <Textarea
                {...register('environmental.outdoor.mainEntrance')}
                placeholder="Describe main entrance accessibility (steps, ramps, lighting)"
                className="mt-2 resize-none text-sm min-h-[100px]"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Other Entrances</Label>
              <Textarea
                {...register('environmental.outdoor.otherEntrances')}
                placeholder="Describe other entrances (garage, back door, etc.)"
                className="mt-2 resize-none text-sm min-h-[100px]"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Parking</Label>
              <Textarea
                {...register('environmental.outdoor.parking')}
                placeholder="Describe parking situation (garage, driveway, street parking)"
                className="mt-2 resize-none text-sm min-h-[100px]"
              />
            </div>
          </div>
        </div>

        {/* Property Features */}
        <div className="border rounded-md p-4 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Warehouse className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-muted-foreground">Property Features</span>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">Yard Description</Label>
              <Textarea
                {...register('environmental.outdoor.yardDescription')}
                placeholder="Describe yard size, terrain, and features"
                className="mt-2 resize-none text-sm min-h-[100px]"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Outdoor Structures</Label>
              <Textarea
                {...register('environmental.outdoor.structures')}
                placeholder="Describe outdoor structures (deck, patio, shed, pool)"
                className="mt-2 resize-none text-sm min-h-[100px]"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Maintenance Requirements</Label>
              <Textarea
                {...register('environmental.outdoor.maintenance')}
                placeholder="Describe yard maintenance needs (mowing, gardening, snow removal)"
                className="mt-2 resize-none text-sm min-h-[100px]"
              />
            </div>
          </div>
        </div>

        {/* Safety and Accessibility */}
        <div className="border rounded-md p-4 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <ClipboardList className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-muted-foreground">Safety and Accessibility</span>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">Lighting</Label>
              <Textarea
                {...register('environmental.outdoor.lighting')}
                placeholder="Describe outdoor lighting (coverage, controls, timer systems)"
                className="mt-2 resize-none text-sm min-h-[100px]"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Safety Concerns</Label>
              <Textarea
                {...register('environmental.outdoor.safetyConcerns')}
                placeholder="List any outdoor safety concerns or hazards"
                className="mt-2 resize-none text-sm min-h-[100px]"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Accessibility Modifications</Label>
              <Textarea
                {...register('environmental.outdoor.accessibilityModifications')}
                placeholder="Describe needed outdoor accessibility modifications"
                className="mt-2 resize-none text-sm min-h-[100px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Notes */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <ClipboardList className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm text-muted-foreground font-medium">Additional Notes</h3>
        </div>

        <div className="border rounded-md p-4 space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">General Environmental Notes</Label>
            <Textarea
              {...register('environmental.notes.general')}
              placeholder="Additional observations or notes about the property"
              className="mt-2 resize-none text-sm min-h-[100px]"
            />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Recommendations</Label>
            <Textarea
              {...register('environmental.notes.recommendations')}
              placeholder="Overall recommendations for environmental modifications"
              className="mt-2 resize-none text-sm min-h-[100px]"
            />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Follow-up Items</Label>
            <Textarea
              {...register('environmental.notes.followUp')}
              placeholder="Items requiring follow-up or additional assessment"
              className="mt-2 resize-none text-sm min-h-[100px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}