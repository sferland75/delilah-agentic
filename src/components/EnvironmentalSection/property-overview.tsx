import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Home } from 'lucide-react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '../ui/form';
import { Textarea } from '../ui/textarea';
import { debugLog } from '../../utils/debug-utils';

export const PropertyOverview: React.FC = () => {
  const { control } = useFormContext();

  React.useEffect(() => {
    debugLog('PropertyOverview', 'Component mounted');
    return () => debugLog('PropertyOverview', 'Component unmounted');
  }, []);

  return (
    <>
      {/* Property Details */}
      <div className="space-y-6">
        <div className="bg-white rounded-lg border shadow-sm p-4 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Home className="h-4 w-4 text-blue-600" />
            <h4 className="font-medium text-slate-800">Property Details</h4>
          </div>

          <FormField
            control={control}
            name="environmental.propertyOverview.propertyType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Property Type</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field}
                    placeholder="Describe the property type"
                    className="min-h-[100px] bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="environmental.propertyOverview.layoutDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Layout Description</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field}
                    placeholder="Describe the property layout"
                    className="min-h-[100px] bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Access and Mobility */}
        <div className="bg-white rounded-lg border shadow-sm p-4 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Home className="h-4 w-4 text-blue-600" />
            <h4 className="font-medium text-slate-800">Access and Mobility</h4>
          </div>

          <FormField
            control={control}
            name="environmental.propertyOverview.access.exterior.description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Exterior Access</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field}
                    placeholder="Describe exterior access (parking, walkways, lighting)"
                    className="min-h-[100px] bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="environmental.propertyOverview.access.interior.description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Interior Access</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field}
                    placeholder="Describe interior access (stairs, doorways, hallways)"
                    className="min-h-[100px] bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Modifications and Hazards */}
        <div className="bg-white rounded-lg border shadow-sm p-4 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Home className="h-4 w-4 text-blue-600" />
            <h4 className="font-medium text-slate-800">Modifications and Hazards</h4>
          </div>

          <FormField
            control={control}
            name="environmental.propertyOverview.recommendedModifications"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Recommended Modifications</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field}
                    value={Array.isArray(field.value) ? field.value.join('\n') : field.value}
                    onChange={e => {
                      const value = e.target.value.split('\n').filter(line => line.trim());
                      field.onChange(value);
                    }}
                    placeholder="Enter recommended modifications (one per line)"
                    className="min-h-[100px] bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="environmental.propertyOverview.identifiedHazards"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Identified Hazards</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field}
                    value={Array.isArray(field.value) ? field.value.join('\n') : field.value}
                    onChange={e => {
                      const value = e.target.value.split('\n').filter(line => line.trim());
                      field.onChange(value);
                    }}
                    placeholder="Enter identified hazards (one per line)"
                    className="min-h-[100px] bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </>
  );
};

export default PropertyOverview;