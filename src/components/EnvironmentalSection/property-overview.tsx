import React from 'react';
import { useFormContext } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { environmentalConfigs } from './environmental-config';
import type { Assessment } from '@/lib/validation/assessment-schema';
import { Home, DoorOpen, Grid } from 'lucide-react';
import { Input } from "@/components/ui/input";

const COMMON_ROOMS = [
  { type: 'Living Room', label: 'Living Room(s)' },
  { type: 'Kitchen', label: 'Kitchen' },
  { type: 'Dining Room', label: 'Dining Room' },
  { type: 'Primary Bedroom', label: 'Primary Bedroom' },
  { type: 'Secondary Bedroom', label: 'Additional Bedrooms' },
  { type: 'Bathroom', label: 'Bathroom(s)' },
  { type: 'Ensuite', label: 'Ensuite(s)' },
  { type: 'Laundry', label: 'Laundry Room' },
  { type: 'Family Room', label: 'Family Room' },
  { type: 'Office', label: 'Office/Study' },
  { type: 'Basement', label: 'Basement' },
  { type: 'Garage', label: 'Garage' },
] as const;

export function PropertyOverview() {
  const methods = useFormContext<Assessment>();
  const { control } = methods;

  // Initialize room counts
  React.useEffect(() => {
    COMMON_ROOMS.forEach(room => {
      methods.setValue(`environmental.propertyOverview.rooms.${room.type}.count`, '0', { 
        shouldDirty: false 
      });
    });
  }, [methods]);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium text-slate-800">Property Overview</h3>
        <p className="text-sm text-slate-600 mb-4">Document property characteristics and layout</p>
      </div>

      {/* Property Characteristics */}
      <div className="bg-white rounded-lg border shadow-sm p-4 space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <Home className="h-4 w-4 text-blue-600" />
          <h4 className="font-medium text-slate-800">Property Details</h4>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={control}
            name="environmental.propertyOverview.type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Property Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ''}>
                  <FormControl>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {environmentalConfigs.propertyTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription className="text-slate-500">
                  Type of dwelling
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="environmental.propertyOverview.levels"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Number of Levels</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ''}>
                  <FormControl>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select number of levels" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="single">Single Level</SelectItem>
                    <SelectItem value="split">Split Level</SelectItem>
                    <SelectItem value="two">Two Story</SelectItem>
                    <SelectItem value="three">Three Story</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription className="text-slate-500">
                  Number of floors in home
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Room Types and Flooring */}
      <div className="bg-white rounded-lg border shadow-sm p-4 space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <Grid className="h-4 w-4 text-blue-600" />
          <h4 className="font-medium text-slate-800">Room Types & Flooring</h4>
        </div>

        <div className="grid gap-6">
          {COMMON_ROOMS.map((room) => (
            <div key={room.type} className="space-y-4">
              <div className="flex items-center gap-2">
                <FormField
                  control={control}
                  name={`environmental.propertyOverview.rooms.${room.type}.count`}
                  defaultValue="0"
                  render={({ field }) => (
                    <FormItem className="w-16">
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          value={field.value || '0'}
                          onChange={e => field.onChange(e.target.value || '0')}
                          placeholder="#"
                          min={0}
                          className="bg-white text-center h-8"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormLabel className="text-slate-700 font-medium">{room.label}</FormLabel>
              </div>

              <FormField
                control={control}
                name={`environmental.propertyOverview.rooms.${room.type}.flooring`}
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} value={field.value || ''}>
                      <FormControl>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Floor covering" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {environmentalConfigs.floorCoverings.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-slate-500">
                      Floor covering type
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>

        {/* Additional Rooms */}
        <FormField
          control={control}
          name="environmental.propertyOverview.additionalRooms"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700">Additional Rooms</FormLabel>
              <FormControl>
                <Textarea 
                  {...field}
                  value={field.value || ''}
                  placeholder="Note any additional rooms or spaces..."
                  className="min-h-[80px] bg-white"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {/* General Notes */}
      <div className="bg-white rounded-lg border shadow-sm p-4 space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <DoorOpen className="h-4 w-4 text-blue-600" />
          <h4 className="font-medium text-slate-800">Additional Information</h4>
        </div>

        <FormField
          control={control}
          name="environmental.propertyOverview.generalNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700">General Notes</FormLabel>
              <FormControl>
                <Textarea 
                  {...field}
                  value={field.value || ''}
                  placeholder="Enter any general notes about the property layout, unique features, etc."
                  className="min-h-[100px] bg-white"
                />
              </FormControl>
              <FormDescription className="text-slate-500">
                Additional observations about property characteristics
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}