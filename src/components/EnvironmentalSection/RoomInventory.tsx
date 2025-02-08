import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
    <div className="space-y-4">
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Room Type</TableHead>
              <TableHead className="w-[100px] text-center">Quantity</TableHead>
              <TableHead className="w-[200px]">Floor Covering</TableHead>
              <TableHead>Comments / Modifications Needed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.map((room: RoomData, index: number) => (
              <TableRow 
                key={room.type}
                className={room.quantity === 0 ? 'bg-muted/50' : ''}
              >
                <TableCell className="font-medium">{room.type}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    value={room.quantity}
                    onChange={(e) => updateRoomField(index, 'quantity', parseInt(e.target.value) || 0)}
                    className="w-20 mx-auto text-center"
                  />
                </TableCell>
                <TableCell>
                  <Select
                    value={room.floorCovering}
                    onValueChange={(value) => updateRoomField(index, 'floorCovering', value)}
                    disabled={room.quantity === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select floor type" />
                    </SelectTrigger>
                    <SelectContent>
                      {floorCoveringTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Textarea
                    value={room.comments}
                    onChange={(e) => updateRoomField(index, 'comments', e.target.value)}
                    placeholder={room.quantity === 0 ? "N/A" : "Add comments about modifications needed, hazards, or other observations..."}
                    className="min-h-[60px]"
                    disabled={room.quantity === 0}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}