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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Room Assessment</h3>
        <Button onClick={addRoom} size="sm" type="button">
          <Plus className="h-4 w-4 mr-2" />
          Add Room
        </Button>
      </div>

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

      <div className="mt-4 p-4 bg-gray-100 rounded">
        <pre className="text-xs">
          {JSON.stringify(rooms, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default RoomAssessment;