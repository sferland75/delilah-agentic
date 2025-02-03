import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const floorTypes = [
  { value: 'hardwood', label: 'Hardwood' },
  { value: 'carpet', label: 'Carpet' },
  { value: 'tile', label: 'Tile' },
  { value: 'vinyl', label: 'Vinyl' },
  { value: 'laminate', label: 'Laminate' },
  { value: 'concrete', label: 'Concrete' },
  { value: 'other', label: 'Other' }
];

const coreRooms = [
  { id: 'bedroom', label: 'Bedrooms' },
  { id: 'bathroom', label: 'Bathrooms' },
  { id: 'kitchen', label: 'Kitchen' },
  { id: 'livingRoom', label: 'Living Room' },
  { id: 'diningRoom', label: 'Dining Room' },
  { id: 'laundry', label: 'Laundry' },
  { id: 'garage', label: 'Garage' },
  { id: 'entryway', label: 'Entryway' }
];

export function RoomsAssessment() {
  const { register, setValue, watch } = useFormContext();
  const rooms = watch('environmental.propertyOverview.rooms') || {};

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium">Room Assessment</h4>
      
      <div className="space-y-6">
        {coreRooms.map((room) => (
          <div key={room.id} className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <div className="space-y-2">
                <Label>{room.label}</Label>
                <Input
                  type="number"
                  min="0"
                  {...register(`environmental.propertyOverview.rooms.${room.id}.count`)}
                  placeholder="Count"
                  className="w-full"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Floor Type</Label>
                <Select
                  value={rooms[room.id]?.floorType}
                  onValueChange={(value) => setValue(`environmental.propertyOverview.rooms.${room.id}.floorType`, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select floor type" />
                  </SelectTrigger>
                  <SelectContent>
                    {floorTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-3">
                <Label>Description & Notes</Label>
                <Textarea
                  {...register(`environmental.propertyOverview.rooms.${room.id}.description`)}
                  placeholder={`Details about the ${room.label.toLowerCase()}`}
                  className="h-24"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}