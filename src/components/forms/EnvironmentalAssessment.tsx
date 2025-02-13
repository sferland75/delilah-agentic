import React from 'react';
<<<<<<< HEAD
import { FormProvider, useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyOverview } from '../EnvironmentalSection/property-overview';
import { SafetyAssessment } from '../EnvironmentalSection/safety-assessment';
import { RoomAssessment } from '../EnvironmentalSection/room-assessment';
import { useForm as useDelilahForm } from '@/context/FormContext';

export function EnvironmentalAssessment() {
  // Get the form methods from the parent context
  const methods = useFormContext();

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Environmental Assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Make sure child components have access to form context */}
          <FormProvider {...methods}>
            <PropertyOverview />
            <RoomAssessment />
            <SafetyAssessment />
          </FormProvider>
        </CardContent>
      </Card>
    </div>
=======
import { useFormContext } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { HOME_LEVELS, FLOOR_COVERINGS, ROOM_TYPES } from '../EnvironmentalSection/environmental-values';

export function EnvironmentalAssessment() {
  const { register, watch, setValue } = useFormContext();
  const [openSections, setOpenSections] = React.useState<string[]>([]);
  const [assessedRooms, setAssessedRooms] = React.useState<string[]>(['Bedroom']);

  const toggleSection = (room: string) => {
    setOpenSections(prev => 
      prev.includes(room) 
        ? prev.filter(r => r !== room)
        : [...prev, room]
    );
  };

  const addRoom = (roomType: string) => {
    if (!assessedRooms.includes(roomType)) {
      setAssessedRooms(prev => [...prev, roomType]);
      setOpenSections(prev => [...prev, roomType]);
      
      // Set default description
      const defaultDesc = ROOM_TYPES.find(r => r.name === roomType)?.defaultDescription || '';
      setValue(`environmental.rooms.${roomType}.description`, defaultDesc);
    }
  };

  const removeRoom = (roomType: string) => {
    setAssessedRooms(prev => prev.filter(room => room !== roomType));
    setOpenSections(prev => prev.filter(room => room !== roomType));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Environmental Assessment</CardTitle>
        <CardDescription>Assess home environment and accessibility considerations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Home Level Selection */}
        <div className="space-y-2">
          <Label>Home Level</Label>
          <Select 
            onValueChange={(value) => setValue('environmental.homeLevel', value)}
            defaultValue="Single Level"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select home level" />
            </SelectTrigger>
            <SelectContent>
              {HOME_LEVELS.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Floor Covering Selection */}
        <div className="space-y-2">
          <Label>Primary Floor Covering</Label>
          <Select 
            onValueChange={(value) => setValue('environmental.floorCovering', value)}
            defaultValue="Mixed"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select floor covering" />
            </SelectTrigger>
            <SelectContent>
              {FLOOR_COVERINGS.map((covering) => (
                <SelectItem key={covering} value={covering}>
                  {covering}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Room Assessments */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Room Assessments</Label>
            <Select 
              onValueChange={addRoom}
              value=""
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Add room..." />
              </SelectTrigger>
              <SelectContent>
                {ROOM_TYPES.map((room) => (
                  <SelectItem 
                    key={room.name} 
                    value={room.name}
                    disabled={assessedRooms.includes(room.name)}
                  >
                    {room.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            {assessedRooms.map((roomType) => (
              <Collapsible 
                key={roomType} 
                open={openSections.includes(roomType)}
                className="border rounded-lg"
              >
                <div className="flex items-center justify-between p-4">
                  <CollapsibleTrigger 
                    className="flex items-center gap-2 hover:text-blue-600"
                    onClick={() => toggleSection(roomType)}
                  >
                    {openSections.includes(roomType) ? 
                      <ChevronDown className="h-4 w-4" /> : 
                      <ChevronRight className="h-4 w-4" />
                    }
                    <span className="font-medium">{roomType}</span>
                  </CollapsibleTrigger>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => removeRoom(roomType)}
                  >
                    Remove
                  </Button>
                </div>

                <CollapsibleContent>
                  <div className="p-4 pt-0 space-y-4">
                    <div className="space-y-2">
                      <Label>Observations</Label>
                      <Textarea
                        {...register(`environmental.rooms.${roomType}.description`)}
                        className="min-h-[100px]"
                        placeholder="Describe room layout, accessibility considerations, and any concerns..."
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </div>

        {/* General Notes */}
        <div className="space-y-2">
          <Label>General Environmental Notes</Label>
          <Textarea
            {...register('environmental.generalNotes')}
            placeholder="Add any additional observations about the home environment..."
            className="min-h-[100px]"
          />
        </div>
      </CardContent>
    </Card>
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
  );
}