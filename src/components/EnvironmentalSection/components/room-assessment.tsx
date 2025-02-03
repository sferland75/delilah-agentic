import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';

const roomTypes = [
  'Bedroom', 'Bathroom', 'Kitchen', 'Living Room', 'Dining Room',
  'Laundry Room', 'Basement', 'Garage', 'Home Office', 'Other'
];

export function RoomAssessment() {
  const { watch, setValue } = useFormContext();
  const rooms = watch('environmental.propertyOverview.rooms') || {};

  const addRoom = () => {
    const roomId = `room_${Object.keys(rooms).length + 1}`;
    setValue(`environmental.propertyOverview.rooms.${roomId}`, {
      type: '',
      name: '',
      dimensions: '',
      features: '',
      hazards: '',
      modifications: '',
      notes: ''
    });
  };

  const removeRoom = (roomId: string) => {
    const updatedRooms = { ...rooms };
    delete updatedRooms[roomId];
    setValue('environmental.propertyOverview.rooms', updatedRooms);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-medium">Room Assessment</h4>
        <Button 
          onClick={addRoom}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Room
        </Button>
      </div>

      <div className="space-y-4">
        {Object.entries(rooms).map(([roomId, room]) => (
          <Card key={roomId} className="p-4">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Room Type</Label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={room.type}
                      onChange={(e) => setValue(`environmental.propertyOverview.rooms.${roomId}.type`, e.target.value)}
                    >
                      <option value="">Select Room Type</option>
                      {roomTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Room Name/Location</Label>
                    <Input
                      value={room.name}
                      onChange={(e) => setValue(`environmental.propertyOverview.rooms.${roomId}.name`, e.target.value)}
                      placeholder="e.g., Master Bedroom, Upstairs Bathroom"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Dimensions/Size</Label>
                    <Input
                      value={room.dimensions}
                      onChange={(e) => setValue(`environmental.propertyOverview.rooms.${roomId}.dimensions`, e.target.value)}
                      placeholder="Room dimensions or approximate size"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Features</Label>
                    <Input
                      value={room.features}
                      onChange={(e) => setValue(`environmental.propertyOverview.rooms.${roomId}.features`, e.target.value)}
                      placeholder="Key features and fixtures"
                    />
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2"
                  onClick={() => removeRoom(roomId)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Hazards/Safety Concerns</Label>
                <Input
                  value={room.hazards}
                  onChange={(e) => setValue(`environmental.propertyOverview.rooms.${roomId}.hazards`, e.target.value)}
                  placeholder="Identify any potential hazards or safety concerns"
                />
              </div>

              <div className="space-y-2">
                <Label>Required Modifications</Label>
                <Input
                  value={room.modifications}
                  onChange={(e) => setValue(`environmental.propertyOverview.rooms.${roomId}.modifications`, e.target.value)}
                  placeholder="Suggested modifications or adaptations"
                />
              </div>

              <div className="space-y-2">
                <Label>Additional Notes</Label>
                <Textarea
                  value={room.notes}
                  onChange={(e) => setValue(`environmental.propertyOverview.rooms.${roomId}.notes`, e.target.value)}
                  placeholder="Any additional observations or notes"
                  className="h-20"
                />
              </div>
            </div>
          </Card>
        ))}

        {Object.keys(rooms).length === 0 && (
          <div className="text-center p-8 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">No rooms added yet. Click "Add Room" to begin assessment.</p>
          </div>
        )}
      </div>
    </div>
  );
}