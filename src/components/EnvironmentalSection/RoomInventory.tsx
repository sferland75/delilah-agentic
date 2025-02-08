import React from 'react';
import { useFormContext } from 'react-hook-form';
import { LayoutGrid } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const roomTypes = [
  "Primary Bedroom",
  "Secondary Bedroom",
  "Third Bedroom",
  "Fourth Bedroom",
  "Primary Bathroom",
  "Secondary Bathroom",
  "Third Bathroom",
  "Living Room",
  "Dining Room",
  "Family Room",
  "Kitchen",
  "Breakfast Nook",
  "Laundry Room",
  "Office/Den",
  "Basement",
  "Garage",
  "Foyer/Entry",
  "Hallway",
  "Storage/Utility"
];

const floorCoveringTypes = [
  "Carpet",
  "Hardwood",
  "Tile",
  "Vinyl",
  "Laminate",
  "Area Rugs",
  "Concrete",
  "Cork",
  "Other"
];

interface RoomData {
  type: string;
  quantity: number;
  floorCovering: string;
  comments: string;
}

export function RoomInventory() {
  const { register, watch, setValue } = useFormContext();
  const rooms = watch('environmental.rooms') || [];

  // Initialize room data if empty
  React.useEffect(() => {
    if (!rooms || rooms.length === 0) {
      const initialRooms = roomTypes.map(type => ({
        type,
        quantity: 0,
        floorCovering: '',
        comments: ''
      }));
      setValue('environmental.rooms', initialRooms);
    }
  }, []);

  const updateRoomField = (index: number, field: string, value: any) => {
    const newRooms = [...rooms];
    newRooms[index] = {
      ...newRooms[index],
      [field]: value
    };
    setValue('environmental.rooms', newRooms);
  };

  return (
    <div className="border rounded-md p-4 space-y-4">
      {/* Section Title */}
      <div className="flex items-center gap-2 mb-2">
        <LayoutGrid className="h-4 w-4 text-blue-600" />
        <div className="text-sm font-semibold">Room Inventory</div>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-slate-50 rounded-md">
        <div className="col-span-3">
          <span className="text-xs text-muted-foreground">Room Type</span>
        </div>
        <div className="col-span-2">
          <span className="text-xs text-muted-foreground">Quantity</span>
        </div>
        <div className="col-span-3">
          <span className="text-xs text-muted-foreground">Floor Covering</span>
        </div>
        <div className="col-span-4">
          <span className="text-xs text-muted-foreground">Comments / Modifications</span>
        </div>
      </div>

      {/* Room Rows */}
      <div className="space-y-2">
        {rooms.map((room: RoomData, index: number) => (
          <div 
            key={room.type} 
            className={`grid grid-cols-12 gap-4 px-4 py-2 border rounded-md transition-colors ${
              room.quantity === 0 ? 'bg-slate-50/50' : 'hover:bg-slate-50/50'
            }`}
          >
            <div className="col-span-3">
              <span className="text-sm">{room.type}</span>
            </div>
            <div className="col-span-2">
              <Input
                type="number"
                min="0"
                value={room.quantity}
                onChange={(e) => updateRoomField(index, 'quantity', parseInt(e.target.value) || 0)}
                className="text-sm w-20"
              />
            </div>
            <div className="col-span-3">
              <Select
                value={room.floorCovering}
                onValueChange={(value) => updateRoomField(index, 'floorCovering', value)}
                disabled={room.quantity === 0}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select floor type" />
                </SelectTrigger>
                <SelectContent>
                  {floorCoveringTypes.map((type) => (
                    <SelectItem key={type} value={type} className="text-sm">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-4">
              <Textarea
                value={room.comments}
                onChange={(e) => updateRoomField(index, 'comments', e.target.value)}
                placeholder={room.quantity === 0 ? "N/A" : "Add comments about modifications needed..."}
                className="text-sm min-h-[60px] resize-none"
                disabled={room.quantity === 0}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}