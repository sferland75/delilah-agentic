<<<<<<< HEAD
import React, { useState, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

type Room = {
  id: string;
  type: string;
  notes: string;
};

const RoomAssessment: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [nextId, setNextId] = useState(1);

  const addRoom = useCallback(() => {
    setRooms(prev => [...prev, {
      id: `room-${nextId}`,
      type: 'living_room',
      notes: ''
    }]);
    setNextId(prev => prev + 1);
  }, [nextId]);

  const updateNotes = useCallback((id: string, value: string) => {
    setRooms(prev => prev.map(room => 
      room.id === id ? { ...room, notes: value } : room
    ));
  }, []);

  const updateType = useCallback((id: string, value: string) => {
    setRooms(prev => prev.map(room => 
      room.id === id ? { ...room, type: value } : room
    ));
  }, []);

  const removeRoom = useCallback((id: string) => {
    setRooms(prev => prev.filter(room => room.id !== id));
  }, []);
=======
import { useFormContext } from 'react-hook-form';
import { Card, CardContent } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from 'lucide-react';
import { nanoid } from 'nanoid';
import { environmentalConfigs } from './config';
import type { AssessmentFormData } from '@/lib/validation/assessment-schema';
import type { Room } from './models';

export function RoomAssessment() {
  const { control, watch, setValue } = useFormContext<AssessmentFormData>();
  const rooms = watch('environmental.rooms') || [];

  const addRoom = () => {
    const newRoom: Room = {
      id: nanoid(),
      name: '',
      type: environmentalConfigs.rooms.areas[0],
      accessibility: environmentalConfigs.rooms.assessmentTypes.accessibility[0],
      safety: environmentalConfigs.rooms.assessmentTypes.safety[0],
      recommendations: [],
      hazards: []
    };

    setValue('environmental.rooms', [...rooms, newRoom]);
  };

  const removeRoom = (roomId: string) => {
    setValue(
      'environmental.rooms', 
      rooms.filter(room => room.id !== roomId)
    );
  };
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Room Assessment</h3>
        <Button onClick={addRoom} size="sm" type="button">
<<<<<<< HEAD
          <Plus className="h-4 w-4 mr-2" />
=======
          <Plus className="w-4 h-4 mr-2" />
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
          Add Room
        </Button>
      </div>

<<<<<<< HEAD
      {rooms.map(room => (
        <Card key={room.id}>
          <CardContent className="space-y-6 pt-6">
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <select
                  className="w-full p-2 border rounded"
                  value={room.type}
                  onChange={e => updateType(room.id, e.target.value)}
                >
                  <option value="living_room">Living Room</option>
                  <option value="bedroom">Bedroom</option>
                  <option value="bathroom">Bathroom</option>
                  <option value="kitchen">Kitchen</option>
                  <option value="dining">Dining Room</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span>Notes:</span>
                <textarea 
                  className="border rounded px-2 py-1 min-w-[150px]"
                  value={room.notes}
                  onChange={e => updateNotes(room.id, e.target.value)}
                  placeholder="Enter notes"
                  rows={1}
                />
              </div>
            </div>
            
            <Button 
              variant="destructive" 
              onClick={() => removeRoom(room.id)}
              className="w-full mt-4"
=======
      {rooms.map((room, index) => (
        <Card key={room.id}>
          <CardContent className="space-y-6 pt-6">
            <FormField
              control={control}
              name={`environmental.rooms.${index}.type`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {environmentalConfigs.rooms.areas.map((area) => (
                        <SelectItem key={area} value={area}>{area}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`environmental.rooms.${index}.accessibility`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Accessibility</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select accessibility level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {environmentalConfigs.rooms.assessmentTypes.accessibility.map((level) => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`environmental.rooms.${index}.safety`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Safety Assessment</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select safety level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {environmentalConfigs.rooms.assessmentTypes.safety.map((level) => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`environmental.rooms.${index}.measurements`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Measurements</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter room measurements" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`environmental.rooms.${index}.hazards`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hazards</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field}
                      value={field.value?.join('\n') || ''}
                      onChange={(e) => field.onChange(e.target.value.split('\n').filter(Boolean))}
                      placeholder="Enter hazards (one per line)"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`environmental.rooms.${index}.recommendations`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recommendations</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field}
                      value={field.value?.join('\n') || ''}
                      onChange={(e) => field.onChange(e.target.value.split('\n').filter(Boolean))}
                      placeholder="Enter recommendations (one per line)"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              variant="destructive" 
              onClick={() => removeRoom(room.id)}
              className="w-full"
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
            >
              Remove Room
            </Button>
          </CardContent>
        </Card>
      ))}

      {rooms.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          No rooms added. Click the button above to add a room.
        </p>
      )}
<<<<<<< HEAD

      <div className="mt-4 p-4 bg-gray-100 rounded">
        <pre className="text-xs">
          {JSON.stringify(rooms, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default RoomAssessment;
=======
    </div>
  );
}
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
