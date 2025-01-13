import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';
import { useFieldArray } from 'react-hook-form';

const DWELLING_TYPES = [
  'Single Family Home',
  'Apartment',
  'Condominium',
  'Townhouse',
  'Mobile Home',
  'Other'
];

const GROUND_TYPES = [
  'Flat',
  'Sloped',
  'Stepped',
  'Mixed',
  'Other'
];

interface PropertyOverviewProps {
  control: Control<any>;
}

export function PropertyOverview({ control }: PropertyOverviewProps) {
  const { fields: modifications, append: appendModification, remove: removeModification } = useFieldArray({
    control,
    name: 'environmental.propertyOverview.recommendedModifications'
  });

  const { fields: hazards, append: appendHazard, remove: removeHazard } = useFieldArray({
    control,
    name: 'environmental.propertyOverview.identifiedHazards'
  });

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={control}
            name="environmental.propertyOverview.type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type of Dwelling</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select dwelling type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {DWELLING_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="environmental.propertyOverview.groundType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ground Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ground type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {GROUND_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="environmental.propertyOverview.generalNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>General Notes</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="General notes about the property..."
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Recommended Modifications */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <FormLabel className="text-lg">Recommended Modifications</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendModification('')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Modification
            </Button>
          </div>

          {modifications.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <FormField
                control={control}
                name={`environmental.propertyOverview.recommendedModifications.${index}`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Textarea {...field} placeholder="Enter recommended modification..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeModification(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Identified Hazards */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <FormLabel className="text-lg">Identified Hazards</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendHazard('')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Hazard
            </Button>
          </div>

          {hazards.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <FormField
                control={control}
                name={`environmental.propertyOverview.identifiedHazards.${index}`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Textarea {...field} placeholder="Enter identified hazard..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeHazard(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}