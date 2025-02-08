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
              </FormItem>
            )}
          />
        </div>

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