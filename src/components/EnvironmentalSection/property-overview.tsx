<<<<<<< HEAD
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Home, Building, Shield } from 'lucide-react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '../ui/form';
import { Textarea } from '../ui/textarea';

export const PropertyOverview: React.FC = () => {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-4">
        <Home className="h-4 w-4 text-blue-600" />
        <h3 className="text-sm text-muted-foreground font-medium">Property Overview</h3>
      </div>

      {/* Property Details */}
      <div className="space-y-4">
        <div className="border rounded-md p-4 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Building className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-muted-foreground">General Property Description</span>
          </div>

          <FormField
            control={control}
            name="environmental.propertyOverview.propertyType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-muted-foreground">Property Type</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field}
                    placeholder="Describe the general layout and features of the property..."
                    className="resize-none text-sm min-h-[100px]"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
=======
import { useFormContext } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { environmentalConfigs } from './environmental-config';
import type { Assessment } from '@/lib/validation/assessment-schema';
import { Home, Footprints, DoorOpen, Grid } from 'lucide-react';
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
  const { control, setValue, getValues } = useFormContext<Assessment>();

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
                <Select onValueChange={field.onChange} value={field.value}>
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
                <Select onValueChange={field.onChange} value={field.value}>
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
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
              </FormItem>
            )}
          />
        </div>
<<<<<<< HEAD

        {/* Hazards and Safety */}
        <div className="border rounded-md p-4 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-muted-foreground">Hazards and Safety Concerns</span>
          </div>

          <FormField
            control={control}
            name="environmental.propertyOverview.identifiedHazards"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-muted-foreground">Identified Hazards</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field}
                    value={Array.isArray(field.value) ? field.value.join('\n') : field.value}
                    onChange={e => {
                      const value = e.target.value.split('\n').filter(line => line.trim());
                      field.onChange(value);
                    }}
                    placeholder="List any identified hazards or safety concerns..."
                    className="resize-none text-sm min-h-[100px]"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>

        {/* Outdoor Areas */}
        <div className="border rounded-md p-4 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Home className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-muted-foreground">Outdoor Areas</span>
          </div>

          <FormField
            control={control}
            name="environmental.propertyOverview.access.exterior.description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-muted-foreground">Access and Parking</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field}
                    placeholder="Describe parking, walkways, and outdoor access..."
                    className="resize-none text-sm min-h-[100px]"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="environmental.propertyOverview.yard"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-muted-foreground">Yard and Garden Areas</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field}
                    placeholder="Describe yard space, gardens, and maintenance requirements..."
                    className="resize-none text-sm min-h-[100px]"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>

        {/* Additional Notes */}
        <div className="border rounded-md p-4 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Home className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-muted-foreground">Additional Notes</span>
          </div>

          <FormField
            control={control}
            name="environmental.propertyOverview.additionalNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-muted-foreground">Additional Comments and Recommendations</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field}
                    placeholder="Add any additional notes, observations, or recommendations..."
                    className="resize-none text-sm min-h-[100px]"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyOverview;
=======
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
              <div className="flex items-center justify-between">
                <FormLabel className="text-slate-700 font-medium">{room.label}</FormLabel>
                
                <div className="flex items-center gap-2">
                  <FormField
                    control={control}
                    name={`environmental.propertyOverview.rooms.${room.type}.count`}
                    render={({ field }) => (
                      <FormItem className="w-20">
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            placeholder="#"
                            min={0}
                            className="bg-white text-center"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={control}
                name={`environmental.propertyOverview.rooms.${room.type}.flooring`}
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-2 gap-4">
                      <Select onValueChange={field.onChange} value={field.value}>
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

                      <FormField
                        control={control}
                        name={`environmental.propertyOverview.rooms.${room.type}.condition`}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Floor condition" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {environmentalConfigs.floorConditions.map((condition) => (
                                <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <FormDescription className="text-slate-500">
                      Floor covering and condition
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
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
