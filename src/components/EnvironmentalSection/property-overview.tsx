import React from 'react';
import { useForm as useDelilahForm } from '@/context/FormContext';
import { useFormContext } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { environmentalConfigs } from './environmental-config';
import { Home, DoorOpen, Grid, Accessibility } from 'lucide-react';
import { Input } from "@/components/ui/input";

export function PropertyOverview() {
  const { formData } = useDelilahForm();
  const methods = useFormContext();
  const { control } = methods;

  // Initialize values from formData
  React.useEffect(() => {
    if (formData?.environmental?.propertyOverview) {
      const data = formData.environmental.propertyOverview;
      methods.setValue('environmental.propertyOverview.type', data.type);
      methods.setValue('environmental.propertyOverview.levels', data.levels);
      methods.setValue('environmental.propertyOverview.exteriorAccess', data.exteriorAccess);
      methods.setValue('environmental.propertyOverview.interiorAccess', data.interiorAccess);
      methods.setValue('environmental.propertyOverview.generalNotes', data.generalNotes);
      
      // Set room values
      if (data.rooms) {
        Object.entries(data.rooms).forEach(([roomType, roomData]) => {
          methods.setValue(`environmental.propertyOverview.rooms.${roomType}.count`, roomData.count);
          methods.setValue(`environmental.propertyOverview.rooms.${roomType}.notes`, roomData.notes);
        });
      }
    }
  }, [formData]);

  return (
    <div className="space-y-8">
      {/* Property Details Section */}
      <div>
        <h3 className="text-lg font-medium text-slate-800">Property Overview</h3>
        <p className="text-sm text-slate-600 mb-4">Document property characteristics and accessibility features</p>
      </div>

      {/* Property Details */}
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
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Access Features */}
      <div className="bg-white rounded-lg border shadow-sm p-4 space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <Accessibility className="h-4 w-4 text-blue-600" />
          <h4 className="font-medium text-slate-800">Access Features</h4>
        </div>

        <FormField
          control={control}
          name="environmental.propertyOverview.exteriorAccess"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700">Exterior Access</FormLabel>
              <FormControl>
                <Textarea 
                  {...field}
                  placeholder="Describe exterior access (steps, ramps, railings, etc.)"
                  className="min-h-[80px] bg-white"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="environmental.propertyOverview.interiorAccess"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700">Interior Access</FormLabel>
              <FormControl>
                <Textarea 
                  {...field}
                  placeholder="Describe interior accessibility features (grab bars, stairlifts, etc.)"
                  className="min-h-[80px] bg-white"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {/* Room Assessment */}
      <div className="bg-white rounded-lg border shadow-sm p-4 space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <DoorOpen className="h-4 w-4 text-blue-600" />
          <h4 className="font-medium text-slate-800">Room Assessment</h4>
        </div>

        <div className="space-y-6">
          {environmentalConfigs.roomTypes.map((roomType) => (
            <div key={roomType} className="space-y-4">
              <div className="flex items-center gap-2">
                <FormField
                  control={control}
                  name={`environmental.propertyOverview.rooms.${roomType}.count`}
                  render={({ field: { onChange, value, ...field } }) => (
                    <FormItem className="w-16">
                      <FormControl>
                        <Input 
                          type="number"
                          {...field}
                          value={value ?? 0}
                          onChange={(e) => {
                            const val = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
                            onChange(val);
                          }}
                          min={0}
                          className="bg-white text-center h-8"
                          onWheel={(e) => e.currentTarget.blur()}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormLabel className="text-slate-700 font-medium">{roomType}</FormLabel>
              </div>

              <FormField
                control={control}
                name={`environmental.propertyOverview.rooms.${roomType}.notes`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder={`Notes about ${roomType.toLowerCase()} (flooring, layout, access issues)`}
                        className="min-h-[60px] bg-white"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>
      </div>

      {/* General Notes */}
      <div className="bg-white rounded-lg border shadow-sm p-4 space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <Grid className="h-4 w-4 text-blue-600" />
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
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}