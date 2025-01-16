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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Room Assessment</h3>
        <Button onClick={addRoom} size="sm" type="button">
          <Plus className="w-4 h-4 mr-2" />
          Add Room
        </Button>
      </div>

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
    </div>
  );
}